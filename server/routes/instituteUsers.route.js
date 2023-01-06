const { Router } = require("express");
const { authUsers } = require("../middleware/authorization");
const userValidations = require("../validations/user.validations");
const userController = require("../controllers/user.controller");
const tokenController = require("../controllers/token.controller");

// Path: /institutes/:id/users/
const usersRouter = Router({ mergeParams: true });

// Get users
usersRouter.get(
  "/",
  (req, res, next) => {
    const { user } = res.locals;
    if (user.role !== "super-admin") {
      req.query.query = {
        ...req.query.query,
        institute: req.params.instituteId,
      };
    }
    next();
  },
  userController.getUsers
);

// Create new user
usersRouter.post(
  "/",
  userValidations.createInstituteUser,
  (req, res, next) => {
    req.body.institute = req.params.id;
    return next();
  },
  userController.createUser,
  tokenController.generateToken
);

// Approve account
usersRouter.put("/approve/:userId", authUsers, userController.approveUser);

// Update a user
usersRouter.put(
  "/:userId",
  authUsers,
  userValidations.updateInstituteUser,
  userController.updateUserById
);

// Delete account
usersRouter.delete("/:userId", authUsers, userController.deleteUserById);

module.exports = usersRouter;
