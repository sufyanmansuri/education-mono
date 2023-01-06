const { Router } = require("express");
const userController = require("../controllers/user.controller");
const userValidations = require("../validations/user.validations");
const tokenController = require("../controllers/token.controller");
const authentication = require("../middleware/authentication");
const { authorization } = require("../middleware/authorization");

// Path: /user
const usersRouter = Router();

// Verify token
usersRouter.get("/token/check", tokenController.verifyToken, (req, res) =>
  res.send()
);

// Regenerate new token
usersRouter.get(
  "/token/regenerate",
  tokenController.regenerateToken,
  (req, res) => res.send()
);

// Create user password if token is valid
usersRouter.put(
  "/set-password",
  tokenController.verifyToken,
  userValidations.password,
  userController.createPassword
);

// Registration
usersRouter.post(
  "/register",
  userValidations.register,
  userController.register,
  tokenController.generateToken
);

// Login
usersRouter.post(
  "/login",
  userValidations.login,
  userController.login,
  userController.getAccessToken
);

// Reset password
usersRouter.post(
  "/reset-password",
  userValidations.email,
  userController.generatePasswordResetToken
);

// Authentication middleware
usersRouter.use(authentication);

// Update profile
usersRouter.put(
  "/profile",
  userValidations.updateProfile,
  (req, res, next) => {
    req.params.userId = res.locals.user.sub;
    next();
  },
  userController.updateUserById
);

// Logout (delete jti)
usersRouter.delete("/logout", userController.logout);

// Authorization middleware
usersRouter.use(authorization("super-admin"));

// Create new user
usersRouter.post(
  "/",
  userValidations.createUser,
  userController.createUser,
  tokenController.generateToken
);

// Get users
usersRouter.get("/", userController.getUsers);

// Approve account
usersRouter.put("/approve/:userId", userController.approveUser);

// Update existing user
usersRouter.put(
  "/update/:userId",
  userValidations.updateUser,
  userController.updateUserById
);

// Delete User by id
usersRouter.delete("/:userId", userController.deleteUserById);

module.exports = usersRouter;
