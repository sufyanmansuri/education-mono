const { Institute } = require("../models/institute.model");

const exists = async (data) => Institute.exists(data);
const create = async (data) => {
  const institute = new Institute(data);
  await institute.save();

  return institute;
};
const getById = async (id) => Institute.findById(id);
const getList = async () => Institute.find({}, "_id name", { sort: "name" });
const getCount = async (query) => Institute.count(query);
const updateById = async (id, data) =>
  Institute.findByIdAndUpdate(id, data, { new: true });
const deleteById = async (id) => Institute.findByIdAndDelete(id);

module.exports = {
  exists,
  create,
  getById,
  getList,
  getCount,
  updateById,
  deleteById,
};
