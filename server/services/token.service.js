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

const getByToken = (token) => Token.findOne({ token });

const regenerate = async (token) => {
  const doc = await Token.findOne({ token });
  doc.token = randomUUID();
  doc.expiresAt = getTokenExpiry();

  await doc.save();
  return doc;
};

module.exports = { create, regenerate, getByToken };
