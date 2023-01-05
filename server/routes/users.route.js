const { Router } = require("express");
const userController = require("../controllers/user.controller");
const userValidations = require("../validations/user.validations");
const tokenController = require("../controllers/token.controller");
const authentication = require("../middleware/authentication");
const { authorization } = require("../middleware/authorization");

// Path: /user
const usersRouter = Router();
usersRouter.use((req, res, next) => {
  res.locals.resource = "user";
  return next();
});

// Create new user
usersRouter.post(
  "/",
  authentication,
  authorization,
  userValidations.createUser,
  userController.createUser,
  tokenController.generateToken
);

// Get users
usersRouter.get("/", authentication, authorization, userController.getUsers);

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
  userController.createPassword,
  (req, res) => res.send()
);

// Registration
usersRouter.post(
  "/register",
  userValidations.register,
  userController.register,
  tokenController.generateToken,
  (req, res) => res.send()
);

// Approve account
usersRouter.put(
  "/approve/:userId",
  authentication,
  authorization,
  userController.approveUser
);

// Login
usersRouter.post(
  "/login",
  userValidations.login,
  userController.login,
  userController.getAccessToken
);

// Update existing user
usersRouter.put(
  "/update/:userId",
  authentication,
  authorization,
  userValidations.updateUser,
  userController.updateUserById
);

// Reset password
usersRouter.post(
  "/reset-password",
  userValidations.email,
  userController.generatePasswordResetToken,
  (req, res) => res.send()
);

// Update profile
usersRouter.put(
  "/profile",
  authentication,
  userValidations.updateProfile,
  (req, res, next) => {
    req.params.userId = res.locals.user.sub;
    next();
  },
  userController.updateUserById
);

// Logout (delete jti)
usersRouter.delete("/logout", authentication, userController.logout);

// Delete User by id
usersRouter.delete(
  "/:userId",
  authentication,
  authorization,
  userController.deleteUserById
);

module.exports = usersRouter;
