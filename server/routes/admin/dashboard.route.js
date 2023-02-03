const { Router } = require("express");
const { authorization } = require("../../middleware/authorization");
const { Class } = require("../../models/class.model");
const { Institute } = require("../../models/institute.model");
const { User } = require("../../models/user.model");

const dashboardRouter = Router();

dashboardRouter.use(authorization("institute-admin", "teacher"));

dashboardRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.aggregate().facet({
      total: [{ $count: "count" }],
      approved: [{ $match: { approved: true } }, { $count: "count" }],
      verified: [{ $match: { approved: true } }, { $count: "count" }],
      "super-admin": [{ $match: { role: "super-admin" } }, { $count: "count" }],
      "institute-admin": [
        { $match: { role: "institute-admin" } },
        { $count: "count" },
      ],
      teacher: [{ $match: { role: "teacher" } }, { $count: "count" }],
    });

    const institutes = await Institute.aggregate().facet({
      total: [{ $count: "count" }],
    });

    const classes = await Class.aggregate().facet({
      total: [{ $count: "count" }],
    });
    return res.send({ users, institutes, classes });
  } catch (error) {
    return next({ error });
  }
});

module.exports = dashboardRouter;
