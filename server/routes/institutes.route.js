const { Router } = require("express");
const instituteClassesRouter = require("./instituteClasses.route");
const authentication = require("../middleware/authentication");
const { authorization } = require("../middleware/authorization");
const instituteController = require("../controllers/institute.controller");
const instituteValidations = require("../validations/institute.validation");
const instituteUsersRouter = require("./instituteUsers.route");

// Path: /institutes
const institutesRouter = Router();
institutesRouter.use((req, res, next) => {
  res.locals.resource = "institute";
  return next();
});

// Users routes
institutesRouter.use("/:id/users", instituteUsersRouter);

// Get a list of institutes
institutesRouter.get("/list", instituteController.getInstituteList);

// Get institute by id
institutesRouter.get("/:id", instituteController.getInstituteById);

institutesRouter.use(authentication);

// Classes routes
institutesRouter.use("/:id/classes", instituteClassesRouter);

// Creates institute
institutesRouter.post(
  "/",
  authorization,
  instituteValidations.createInstitute,
  instituteController.createInstitute
);

// Get Institutes
institutesRouter.get("/", authorization, instituteController.getInstitutes);

// Update institute by id
institutesRouter.put(
  "/:id",
  authorization,
  instituteValidations.updateInstitute,
  instituteController.updateInstituteById,
  (req, res) => res.send()
);

// Delete Institute by id
institutesRouter.delete(
  "/:id",
  authorization,
  instituteController.deleteInstituteById,
  (req, res) => res.send()
);

module.exports = institutesRouter;
