const { User } = require("../models/user.model");

const get = async (query) => User.findOne(query);
const getById = async (id) => User.findById(id);
const exists = async (query) => User.exists(query);
const create = async (data) => {
  const user = new User(data);
  await user.save();
  return user;
};
const updateById = async (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true });
const deleteById = async (id) => User.findByIdAndDelete(id);

module.exports = { get, getById, exists, create, updateById, deleteById };
