const { Class } = require("../models/class.model");
const { User } = require("../models/user.model");

const permissions = {
  "institute-admin": [
    "institute:GET",
    "institute:PUT",
    "class:GET",
    "class:PUT",
    "class:POST",
    "class:DELETE",
    "user:GET",
    "user:PUT",
    "user:POST",
    "user:DELETE",
  ],
  teacher: [
    "institute:GET",
    "class:GET",
    "class:PUT",
    "class:POST",
    "class:DELETE",
  ],
};

/**
 * Determines if user can access the resource
 */
const authorization = async (req, res, next) => {
  const { user } = res.locals;

  if (user.role !== "super-admin") {
    const requestedInstitute = req.params.id;
    const { resource } = res.locals;
    const permission = `${resource}:${req.method}`;

    // console.log({
    //   institute: {
    //     requested: requestedInstitute,
    //     scope: user.scope,
    //   },
    //   permission: {
    //     requested: permission,
    //     scope: permissions[user.role],
    //   },
    // });

    if (
      user.scope !== requestedInstitute ||
      !permissions[user.role].includes(permission)
    ) {
      return next({
        status: 403,
        error: {
          message: "You don't have permission to access this resource.",
        },
      });
    }
  }

  return next();
};

/**
 * Determines wether user has access to requested class
 */
const authInstituteClass = async (req, res, next) => {
  const requestedInstitute = req.params.id;

  try {
    const { classId } = req.params;
    const requestedClass = await Class.findById(classId, { institute: 1 });

    if (!requestedClass)
      return next({ status: 404, error: { message: "Class does not exist." } });

    if (requestedClass.institute.toString() !== requestedInstitute) {
      return next({
        status: 403,
        error: {
          message: "You don't have permission to access this resource.",
        },
      });
    }

    return next();
  } catch (error) {
    return next({
      status: 404,
      error: { message: "Requested resource not found." },
    });
  }
};

const authInstituteUser = async (req, res, next) => {
  const requestedInstitute = req.params.id;
  const { userId } = req.params;

  try {
    const requestedUser = await User.findById(userId, { institute: 1 });

    if (!requestedUser)
      return next({ status: 404, error: { message: "User does not exist." } });

    if (requestedUser.institute.toString() !== requestedInstitute) {
      return next({
        status: 403,
        error: {
          message: "You don't have permission to access this resource.",
        },
      });
    }

    return next();
  } catch (error) {
    return next({ error });
  }
};

module.exports = { authorization, authInstituteClass, authInstituteUser };
