const jwt = require("jsonwebtoken");
const { JTI } = require("../models/jti.model");
const { User } = require("../models/user.model");

/**
 * Verify if authorization token is valid
 * if valid then stores user details in res.locals.user
 */
const authenticate = async (req, res, next) => {
  let token = req.get("Authorization");
  if (!token) {
    return next({
      status: 401,
      error: { message: "Unauthenticated user access." },
    });
  }

  token = token.replace("Bearer ", "");

  const { JWT_SECRET_KEY } = process.env;
  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    // Check if token is valid
    if (!payload) {
      return next({ status: 498, error: { message: "Invalid token" } });
    }

    // Check jwt id (jti claim)
    const jti = await JTI.findById(payload.jti);
    if (!jti) return next({ status: 403, error: { message: "Token expired" } });

    // Check if user exists.
    const user = await User.findOne({ email: payload.sub });
    if (!user) {
      return next({ status: 403, error: { message: "Unknown user access" } });
    }

    res.locals.user = user;
    return next();
  } catch (error) {
    // Handle invalid token error
    if (error.name === "JsonWebTokenError") {
      return next({
        status: 401,
        error: { message: "Invalid token" },
      });
    }

    // Handle token expired error
    if (error.name === "TokenExpiredError") {
      return next({
        status: 403,
        error: { message: "Token expired. Login again." },
      });
    }
    return next({ error });
  }
};

module.exports = authenticate;
