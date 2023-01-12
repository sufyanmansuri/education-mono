const jwt = require("jsonwebtoken");
const { JTI } = require("../models/jti.model");

/**
 * Verify if authorization token is valid
 * if valid then stores user details in res.locals.user
 */
const authentication = async (req, res, next) => {
  let { token } = req.signedCookies;
  if (!token) {
    return next({
      status: 401,
      error: { message: "Unauthenticated user access." },
    });
  }
  token = token.replace("Bearer ", "");

  const { JWT_SECRET_KEY } = process.env;
  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY); // verify token
    if (!payload) {
      return next({ status: 498, error: { message: "Invalid token" } });
    }
    const jti = await JTI.findOne({ token: payload.jti, user: payload.sub }); // verify jti
    if (!jti) {
      res.clearCookie("token");
      return next({ status: 403, error: { message: "Token expired" } });
    }

    res.locals.user = payload;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next({
        status: 401,
        error: { message: "Invalid token" },
      });
    }
    if (error.name === "TokenExpiredError") {
      return next({
        status: 403,
        error: { message: "Token expired. Login again." },
      });
    }
    return next({ error });
  }
};

module.exports = authentication;
