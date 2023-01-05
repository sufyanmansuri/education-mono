const { Router } = require("express");
const { keyStages, examBoards } = require("../models/class.model");
const {
  instituteLevels,
  instituteTypes,
  territories,
} = require("../models/institute.model");
const { roles, titles } = require("../models/user.model");

const rootRouter = Router();

rootRouter.get("/roles", (req, res) => res.send(roles));
rootRouter.get("/titles", (req, res) => res.send(titles));
rootRouter.get("/levels", (req, res) => res.send(instituteLevels));
rootRouter.get("/types", (req, res) => res.send(instituteTypes));
rootRouter.get("/territories", (req, res) => res.send(territories));
rootRouter.get("/key-stages", (req, res) => res.send(keyStages));
rootRouter.get("/exam-boards", (req, res) => res.send(examBoards));

module.exports = rootRouter;
