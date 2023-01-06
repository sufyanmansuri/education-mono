const { Router } = require("express");
const classesRouter = require("./instituteClasses.route");
const authentication = require("../middleware/authentication");
const { authorization, authInstitute } = require("../middleware/authorization");
const instituteController = require("../controllers/institute.controller");
const instituteValidations = require("../validations/institute.validation");
const usersRouter = require("./instituteUsers.route");

// Path: /institutes
const institutesRouter = Router();

// Get a list of institutes
institutesRouter.get("/list", instituteController.getInstituteList);

// Get Institutes
institutesRouter.get("/", instituteController.getInstitutes);

// Get institute by id
institutesRouter.get("/:instituteId", instituteController.getInstituteById);

// Authentication middleware
institutesRouter.use(authentication);

// Users routes
institutesRouter.use(
  "/:instituteId/users",
  authorization("super-admin", "institute-admin"),
  authInstitute,
  usersRouter
);

institutesRouter.use(
  authorization("super-admin", "institute-admin", "teacher")
);

// Creates institute
institutesRouter.post(
  "/",
  instituteValidations.createInstitute,
  instituteController.createInstitute
);

// Classes routes
institutesRouter.use("/:instituteId/classes", authInstitute, classesRouter);

// Update institute by id
institutesRouter.put(
  "/:instituteId",
  authInstitute,
  instituteValidations.updateInstitute,
  instituteController.updateInstituteById,
  (req, res) => res.send()
);

// Delete Institute by id
institutesRouter.delete(
  "/:instituteId",
  authInstitute,
  instituteController.deleteInstituteById,
  (req, res) => res.send()
);

module.exports = institutesRouter;
