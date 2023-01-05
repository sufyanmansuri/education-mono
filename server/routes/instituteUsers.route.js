const { Router } = require("express");
const authentication = require("../middleware/authentication");
const {
  authorization,
  authInstituteUser,
} = require("../middleware/authorization");
const userValidations = require("../validations/user.validations");
const userController = require("../controllers/user.controller");
const tokenController = require("../controllers/token.controller");

// Path: /institutes/:id/users/
const instituteUsersRouter = Router({ mergeParams: true });
instituteUsersRouter.use((req, res, next) => {
  res.locals.resource = "user";
  return next();
});

instituteUsersRouter.get(
  "/",
  authentication,
  authorization,
  (req, res, next) => {
    req.query.query = { ...req.query.query, institute: res.locals.user.scope };
    next();
  },
  userController.getUsers
);

// Create new user
instituteUsersRouter.post(
  "/",
  authentication,
  authorization,
  userValidations.createInstituteUser,
  (req, res, next) => {
    req.body.institute = req.params.id;
    return next();
  },
  userController.createUser,
  tokenController.generateToken
);

// Update a user
instituteUsersRouter.put(
  "/:userId",
  authentication,
  authorization,
  authInstituteUser,
  userValidations.updateInstituteUser,
  userController.updateUserById
);

// Approve account
instituteUsersRouter.put(
  "/approve/:userId",
  authentication,
  authorization,
  authInstituteUser,
  userController.approveUser
);

// Delete account
instituteUsersRouter.delete(
  "/:userId",
  authentication,
  authorization,
  authInstituteUser,
  userController.deleteUserById
);

module.exports = instituteUsersRouter;
