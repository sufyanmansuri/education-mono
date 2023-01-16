const { randomUUID } = require("node:crypto");
const { Token, getTokenExpiry } = require("../models/token.model");

const create = async (user) => {
  const token = randomUUID();
  const newDoc = new Token({
    token,
    user,
  });
  await newDoc.save();

  return newDoc;
};

const getByToken = async (token) => Token.findOne({ token });

const regenerate = async (token) => {
  const doc = await Token.findOne({ token });
  doc.token = randomUUID();
  doc.expiresAt = getTokenExpiry();

  await doc.save();
  return doc;
};

const deleteByToken = async (token) => Token.findOneAndDelete({ token });

module.exports = { create, regenerate, getByToken, deleteByToken };
