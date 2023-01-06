const { randomUUID } = require("node:crypto");
const { Token, getTokenExpiry } = require("../models/token.model");
const sendMail = require("../utils/sendMail");

/**
 * Generates and sends token in mail
 */
const generateToken = async (req, res, next) => {
  try {
    const { user } = res.locals;

    const token = randomUUID();
    const verification = new Token({
      token,
      user: user._id,
    });
    await verification.save();

    // Send email
    sendMail(user.email, token);

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

/**
 *  Verify that token is valid
 */
const verifyToken = async (req, res, next) => {
  const { token } = req.query;

  // Check if token is provided
  if (!token) return next({ status: 400, error: { message: "Invalid token" } });

  try {
    // Check if token is in db
    const record = await Token.findOne({ token });
    if (!record) return next({ status: 401, message: "Invalid token" });

    // Check if token is expired
    if (record.expiresAt.getTime() <= new Date().getTime()) {
      return next({
        status: 401,
        message: "Token expired.",
        error: { message: "Token expired" },
      });
    }

    return next();
  } catch (error) {
    return next({ error });
  }
};

/*
    Regenerate new token
  */
const regenerateToken = async (req, res, next) => {
  const { token } = req.query;

  // Check if token is provided
  if (!token) return next({ status: 400, error: { message: "Invalid token" } });

  try {
    // Check whether token exists in db
    let record = await Token.findOne({ token });
    if (!record) {
      return next({ status: 401, error: { message: "Invalid token" } });
    }

    // Generate new token
    record.token = randomUUID();
    record.expiresAt = getTokenExpiry();

    await record.save();
    record = await record.populate("user", "email");

    // Send mail
    sendMail(record.user.email, record.token);

    return next();
  } catch (error) {
    return next({ error });
  }
};

module.exports = { verifyToken, regenerateToken, generateToken };
