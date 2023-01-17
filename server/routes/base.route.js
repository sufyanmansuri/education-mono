const { Router } = require("express");
const instituteController = require("../controllers/institute.controller");
const enums = require("../utils/enums");

const baseRouter = Router();

baseRouter.get("/institutes", instituteController.getInstituteList);
baseRouter.get("/search-institutes", instituteController.searchInstitutes);
baseRouter.get("/roles", (req, res) => res.send(enums.roles));
baseRouter.get("/titles", (req, res) => res.send(enums.titles));
baseRouter.get("/levels", (req, res) => res.send(enums.instituteLevels));
baseRouter.get("/types", (req, res) => res.send(enums.instituteTypes));
baseRouter.get("/territories", (req, res) => res.send(enums.territories));
baseRouter.get("/key-stages", (req, res) => res.send(enums.keyStages));
baseRouter.get("/exam-boards", (req, res) => res.send(enums.examBoards));

module.exports = baseRouter;
