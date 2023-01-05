const { Class } = require("../models/class.model");

/**
 * Inserts a new class document into classes collection
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createClass = async (req, res, next) => {
  const value = req.body;

  try {
    const exists = await Class.exists({
      name: value.name,
      institute: value.institute,
    });
    if (exists) {
      return next({
        status: 400,
        error: [
          {
            message: "A class with this name already exists.",
            type: "any.invalid",
            context: {
              key: "class",
            },
          },
        ],
        message: "A class with this name already exists.",
      });
    }

    const doc = new Class(value);
    await doc.save();

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Updates a class document
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateClass = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const record = await Class.findByIdAndUpdate(classId, req.body);
    if (!record)
      return next({ status: 400, error: { message: "Invalid class id" } });
    return res.send();
  } catch (error) {
    return next({ error });
  }
};

/**
 * Delete a class document by id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteClassById = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const record = await Class.findById(classId);
    if (!record)
      return next({ status: 400, error: { message: "Invalid class id" } });

    await record.delete();

    return res.send(record);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Get list of class
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getClasses = async (req, res, next) => {
  const { sortBy = "updatedAt", query = {} } = req.query;
  let {
    fields = ["name", "createdAt", "updatedAt", "address"],
    page = 1,
    perPage = 5,
    order = -1,
  } = req.query;

  // Convert string to number
  page = parseInt(page, 10) - 1;
  perPage = parseInt(perPage, 10);
  order = parseInt(order, 10);
  try {
    const totalCount = await Class.count(query);
    fields = {
      ...fields.reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {}),
      _id: 1,
      institute: 1,
    };

    const classes = await Class.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "institutes",
          localField: "institute",
          foreignField: "_id",
          as: "institute",
          pipeline: [
            {
              $project: { name: 1 },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$institute",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: fields,
      },
      {
        $sort: { [sortBy]: order },
      },
      { $skip: perPage * page },
      { $limit: perPage },
    ]);

    return res.send({
      totalPages: Math.ceil(totalCount / perPage),
      totalCount,
      data: classes,
      page: page + 1,
      perPage,
      sortBy,
      fields,
      order,
      query,
    });
  } catch (error) {
    return next({ error });
  }
};

/**
 * Get a class by class id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getClassById = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const record = await Class.findById(classId).populate("institute", "name");

    // Check if class exists
    if (!record)
      return next({
        status: 400,
        error: { message: "Class does not exist." },
      });

    return res.send(record);
  } catch (error) {
    return next({ error });
  }
};

module.exports = {
  createClass,
  updateClass,
  deleteClassById,
  getClasses,
  getClassById,
};
