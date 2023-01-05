const { Router } = require("express");
const classValidation = require("../validations/class.validation");
const {
  authorization,
  authInstituteClass,
} = require("../middleware/authorization");
const classController = require("../controllers/class.controller");

// Path: /institutes/:id/classes/
const instituteClassesRouter = Router({ mergeParams: true });
instituteClassesRouter.use((req, res, next) => {
  res.locals.resource = "class";
  return next();
});

instituteClassesRouter.use(authorization);

// Get all classes
instituteClassesRouter.get("/", classController.getClasses);

// Create new class
instituteClassesRouter.post(
  "/",
  classValidation.createClass,
  classController.createClass
);

// Get a single class by name
instituteClassesRouter.get(
  "/:classId",
  authInstituteClass,
  classController.getClassById
);

// Update a class
instituteClassesRouter.put(
  "/:classId",
  authInstituteClass,
  classValidation.updateClass,
  classController.updateClass
);

// Delete class by id
instituteClassesRouter.delete(
  "/:classId",
  authInstituteClass,
  classController.deleteClassById
);

module.exports = instituteClassesRouter;
