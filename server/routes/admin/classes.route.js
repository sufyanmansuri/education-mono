const { Router } = require("express");
const {
  Types: { ObjectId },
} = require("mongoose");
const classSchema = require("../../controllers/class.schema");
const classController = require("../../controllers/class.controller");
const { authClass, authorization } = require("../../middleware/authorization");

// Path: /admin/classes/
const classesRouter = Router();

classesRouter.use(authorization("institute-admin", "teacher"));

// Get all classes
classesRouter.get(
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
  classController.getClasses
);

// Create new class
classesRouter.post("/", classSchema.createClass, classController.createClass);

// Get a single class by id
classesRouter.get("/:classId", authClass, classController.getClassById);

// Update a class
classesRouter.put(
  "/:classId",
  authClass,
  classSchema.updateClass,
  classController.updateClass
);

// Delete class by id
classesRouter.delete("/:classId", authClass, classController.deleteClassById);

module.exports = classesRouter;
