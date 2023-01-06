const { Router } = require("express");
const classValidation = require("../validations/class.validation");
// const {} = require("../middleware/authorization");
const classController = require("../controllers/class.controller");
const { authClass } = require("../middleware/authorization");

// Path: /institutes/:id/classes/
const instituteClassesRouter = Router({ mergeParams: true });

// Get all classes
instituteClassesRouter.get("/", classController.getClasses);

// Create new class
instituteClassesRouter.post(
  "/",
  classValidation.createClass,
  classController.createClass
);

instituteClassesRouter.use(authClass);

// Get a single class by id
instituteClassesRouter.get("/:classId", classController.getClassById);

// Update a class
instituteClassesRouter.put(
  "/:classId",
  classValidation.updateClass,
  classController.updateClass
);

// Delete class by id
instituteClassesRouter.delete("/:classId", classController.deleteClassById);

module.exports = instituteClassesRouter;
