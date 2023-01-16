const { Router } = require("express");
const {
  Types: { ObjectId },
} = require("mongoose");
const userController = require("../../controllers/user.controller");
const userSchema = require("../../controllers/user.schema");
const tokenController = require("../../controllers/token.controller");
const { authUsers, authorization } = require("../../middleware/authorization");

// Path: /admin/user
const usersRouter = Router();
usersRouter.use(authorization("institute-admin"));

// Create new user
usersRouter.post(
  "/",
  userSchema.createUser,
  userController.createUser,
  tokenController.generateToken
);

// Get users
usersRouter.get(
  "/",
  (req, res, next) => {
    const { user } = res.locals;
    if (user.role === "super-admin") return next();
    req.query = {
      ...req.query,
      query: { ...req.query.query, institute: new ObjectId(user.institute) },
    };
    return next();
  },
  userController.getUsers
);

// Approve account
usersRouter.put("/approve/:userId", authUsers, userController.approveUser);

// Update existing user
usersRouter.put(
  "/:userId",
  authUsers,
  userSchema.updateUser,
  userController.updateUserById
);

// Delete User by id
usersRouter.delete("/:userId", authUsers, userController.deleteUserById);

module.exports = usersRouter;
