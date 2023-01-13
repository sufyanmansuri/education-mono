const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;
const { randomUUID } = require("node:crypto");
const { User } = require("../models/user.model");
const { Token } = require("../models/token.model");
const sendMail = require("../utils/sendMail");
const { JTI } = require("../models/jti.model");

/**
 * Generates password reset token
 */
const generatePasswordResetToken = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists with given email
    if (!user) {
      return next({ status: 401, message: "User does not exist." });
    }

    const token = randomUUID();

    await Token.findOneAndUpdate(
      { user: user._id },
      { token },
      { upsert: true }
    );

    sendMail(email, token, "reset");

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Creates a new user and sends verification token in email
 */
const createUser = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return next({
        status: 403,
        error: [
          {
            message: "An account with this email already exists.",
            type: "any.invalid",
            context: {
              key: "email",
            },
          },
        ],
        message: "An account with this email already exists.",
      });
    }

    const user = new User({
      ...req.body,
      approved: true,
    });
    await user.save();

    res.locals.user = user;

    return next();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Encrypts and inserts password into db
 */
const createPassword = async (req, res, next) => {
  const { token } = req.query;

  try {
    const { user } = await Token.findOne({ token }, { user: 1 });
    const { password } = req.body;

    // Check new password is not same as old if user is not new
    const oldPassword = (await User.findById(user, "password")).password;
    if (oldPassword && bcrypt.compareSync(password, oldPassword)) {
      return next({
        status: 400,
        error: { message: "New password can't be same as old password." },
      });
    }

    // Generate hash and update user document
    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user, {
      password: hash,
      verified: true,
    });

    // Delete token
    await Token.findOneAndDelete({ token });

    // Delete jti claims
    await JTI.deleteMany({ user });

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Verify user credentials
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return next({
        status: 401,
        error: { message: "Invalid username or password" },
      });
    }

    // Check whether account is verified & approved
    if (!user.verified) {
      return next({
        status: 403,
        error: { message: "Account is not verified" },
      });
    }
    if (!user.approved) {
      return next({
        status: 403,
        error: { message: "Account is not approved." },
      });
    }

    // Check whether password is valid
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return next({
        status: 401,
        error: { message: "Invalid username or password" },
      });
    }

    res.locals.user = user;
    return next();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Generates access token and stores it in res.locals
 */
const getAccessToken = async (req, res, next) => {
  const { user } = res.locals;
  const { JWT_SECRET_KEY } = process.env;
  const tokenValidity = "1d"; // 3days

  try {
    // Create jti claim
    const jti = new JTI({ user: user._id, token: randomUUID() });
    await jti.save();

    const token = jwt.sign(
      { role: user.role, institute: user.institute },
      JWT_SECRET_KEY,
      {
        expiresIn: tokenValidity,
        jwtid: jti.token,
        subject: user._id.toString(),
      }
    );

    return res
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        signed: true,
      })
      .send({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          title: user.title,
          institute: user.institute,
        },
      });
  } catch (error) {
    return next({ error });
  }
};

/**
 * Approves user account
 */
const approveUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return next({ status: 400, error: { message: "User does not exist." } });
    }

    // Check if email is verified
    if (!user.verified) {
      return next({
        status: 400,
        error: { message: "User's email is not verified." },
      });
    }

    user.approved = true;
    await user.save();

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Updates user by id
 */
const updateUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(userId, req.body);

    // Check if user exists
    if (!user) {
      return next({ status: 404, error: { message: "User does not exist." } });
    }

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Get users filtered by query, selected columns & pagination
 */
const getUsers = async (req, res, next) => {
  const { sortBy = "updatedAt" } = req.query;
  let {
    query = {},
    fields = ["_id", "firstName", "lastName", "createdAt", "updatedAt"],
    page = 1,
    perPage = 5,
    order = -1,
  } = req.query;

  // Convert string to number
  page = parseInt(page, 10) - 1;
  perPage = parseInt(perPage, 10);
  order = parseInt(order, 10);

  try {
    const totalCount = await User.count(query);
    fields = {
      _id: 1,
      institute: 1,
      ...fields.reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {}),
    };

    if (query.institute) {
      query.institute = ObjectId(query.institute);
    }
    query = Object.keys(query).reduce((prev, curr) => {
      if (Array.isArray(query[curr]))
        return { ...prev, [curr]: { $in: query[curr] } };
      return { ...prev, [curr]: query[curr] };
    }, {});

    const users = await User.aggregate([
      { $match: { ...query } },
      {
        $lookup: {
          from: "institutes",
          localField: "institute",
          foreignField: "_id",
          as: "institute",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$institute",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: fields,
      },
      {
        $unset: "password",
      },
      {
        $sort: { [sortBy]: order },
      },
      { $skip: perPage * page },
      { $limit: perPage },
    ]);

    return res.send({
      totalPages: Math.ceil(totalCount / perPage),
      totalCount,
      data: users,
      page: page + 1,
      perPage,
      sortBy,
      fields: Object.keys(fields),
      order,
      query,
      allFields: [
        "firstName",
        "lastName",
        "title",
        "email",
        "role",
        "verified",
        "approved",
        "createdAt",
        "updatedAt",
      ],
    });
  } catch (error) {
    return next({ error });
  }
};

/**
 * Register a new teacher
 */
const register = async (req, res, next) => {
  try {
    const exists = await User.exists({ email: req.body.email });
    if (exists) {
      return next({
        status: 400,
        message: "An account with this email already exists.",
      });
    }

    const user = new User({ ...req.body, role: "teacher" });
    await user.save();

    res.locals.user = user;

    return next();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Deletes a user by id
 */
const deleteUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    await User.findByIdAndDelete(userId);

    // Delete jti claims
    await JTI.deleteMany({ user: userId });

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Clear jti claims by user id
 */
const logout = async (req, res, next) => {
  const { user } = res.locals;

  try {
    await JTI.findOneAndDelete({ token: user.jti });

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

module.exports = {
  createUser,
  register,
  createPassword,
  generatePasswordResetToken,
  getAccessToken,
  approveUser,
  login,
  logout,
  getUsers,
  updateUserById,
  deleteUserById,
};
