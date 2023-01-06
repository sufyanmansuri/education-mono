const { Class } = require("../models/class.model");
const { User } = require("../models/user.model");

/**
 * Determines whether user has access to requested resource
 * @param  {...any} roles
 */
const authorization =
  (...roles) =>
  (req, res, next) => {
    const { user } = res.locals;
    if (roles.includes(user.role)) return next();
    return next({ status: 403, error: { message: "Unauthorized" } });
  };

/**
 * Determines if user can access requested institute
 */
const authInstitute = (req, res, next) => {
  const { user } = res.locals;
  if (user.role === "super-admin") return next();

  const { instituteId } = req.params;
  if (user.institute === instituteId) return next();

  return next({ status: 403, error: { message: "Unauthorized" } });
};

/**
 * Determines if user can access requested class
 */
const authClass = async (req, res, next) => {
  const { user } = res.locals;
  if (user.role === "super-admin") return next();

  try {
    const { classId, instituteId } = req.params;

    const classDoc = await Class.findById(classId);
    if (!classDoc)
      return next({ status: 404, error: { message: "Class does not exist." } });

    if (classDoc.institute.toString() === instituteId) return next();

    return next({ status: 403, error: { message: "Unauthorized" } });
  } catch (error) {
    return next({ error });
  }
};

/**
 * Determines if user can access requested user account
 */
const authUsers = async (req, res, next) => {
  const { user } = res.locals;
  if (user.role === "super-admin") return next();

  try {
    const { userId, instituteId } = req.params;

    const userDoc = await User.findById(userId);
    if (!userDoc)
      return next({ status: 404, error: { message: "User does not exist." } });

    if (userDoc.institute.toString() === instituteId) return next();

    return next({ status: 403, error: { message: "Unauthorized" } });
  } catch (error) {
    return next({ error });
  }
};

module.exports = { authorization, authInstitute, authClass, authUsers };
