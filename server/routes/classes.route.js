const { Router } = require("express");
const classValidation = require("../validations/class.validation");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const classController = require("../controllers/class.controller");

// Path: /institutes/classes/
const classesRouter = Router({ mergeParams: true });

// Protected Routes
classesRouter.use(authenticate);

// Get all classes
classesRouter.get(
  "/",
  (req, res, next) => {
    authorize(["super-admin", "institute-admin", "teacher"], req, res, next);
  },
  classController.getClasses
);

// Get a single class by name
classesRouter.get(
  "/:classId",
  (req, res, next) => {
    authorize(["super-admin", "institute-admin", "teacher"], req, res, next);
  },
  classController.getClassById
);

// Protected routes
classesRouter.use((req, res, next) => {
  authorize(["super-admin", "institute-admin"], req, res, next);
});

// Create new class
classesRouter.post(
  "/",
  classValidation.createClass,
  classController.createClass
);

// Update a class
classesRouter.put(
  "/:classId",
  classValidation.updateClass,
  classController.updateClass
);

// Delete class by id
classesRouter.delete("/:classId", classController.deleteClassById);

module.exports = classesRouter;
