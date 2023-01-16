const { Institute } = require("../models/institute.model");
const instituteService = require("../services/institute.service");
const HTTP_STATUS = require("../utils/statusCodes");

/**
 * Creates a new institute
 */
const createInstitute = async (req, res, next) => {
  try {
    const exists = await instituteService.exists(req.body);
    if (exists) {
      return next({
        status: HTTP_STATUS.BAD_REQUEST,
        error: { message: "An institute with these details already exists." },
      });
    }

    const institute = await instituteService.create(req.body);

    return res.send(institute);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Get institutes filtered by query, selected columns & pagination
 */
const getInstitutes = async (req, res, next) => {
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
    const totalCount = await instituteService.getCount(query);
    fields = {
      _id: 1,
      ...fields.reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {}),
    };

    const institutes = await Institute.aggregate([
      { $match: query },
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
      data: institutes,
      page: page + 1,
      perPage,
      sortBy,
      fields: Object.keys(fields),
      order,
      query,
      allFields: [
        "name",
        "address",
        "level",
        "type",
        "homePage",
        "noOfStudents",
        "createdAt",
        "updatedAt",
      ],
    });
  } catch (error) {
    return next({ error, message: error.message });
  }
};

/**
 * Get institute by id
 */
const getInstituteById = async (req, res, next) => {
  const { instituteId } = req.params;

  try {
    const institute = await instituteService.getById(instituteId);

    if (!institute) {
      return next({
        status: HTTP_STATUS.BAD_REQUEST,
        error: { message: "Institute does not exist." },
      });
    }

    return res.send({ institute });
  } catch (error) {
    return next({ error });
  }
};

/**
 * Get institutes list
 */
const getInstituteList = async (req, res, next) => {
  try {
    const list = await instituteService.getList();

    return res.send(list);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Update institute by id
 */
const updateInstituteById = async (req, res, next) => {
  const { instituteId } = req.params;

  try {
    const institute = await instituteService.updateById(instituteId, req.body);
    console.log(institute);
    return res.send(institute);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Deletes institute by id
 */
const deleteInstituteById = async (req, res, next) => {
  const { instituteId } = req.params;

  try {
    const institute = await instituteService.deleteById(instituteId);

    if (!institute)
      return next({
        status: HTTP_STATUS.BAD_REQUEST,
        error: { message: "Invalid institute id." },
      });

    return res.send(institute);
  } catch (error) {
    return next({ error });
  }
};

module.exports = {
  createInstitute,
  getInstitutes,
  getInstituteById,
  getInstituteList,
  updateInstituteById,
  deleteInstituteById,
};
