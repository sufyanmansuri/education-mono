const { Schema, model } = require("mongoose");

const tokenValidity = 2 * 24 * 60 * 60 * 1000; // Two days

const getNewTokenExpiry = () => new Date(new Date().getTime() + tokenValidity);

const tokenSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    expiresAt: {
      type: Date,
      required: true,
      default: getNewTokenExpiry(),
    },
  },
  { timestamps: true }
);

const Token = model("Token", tokenSchema);

module.exports = { Token, getNewTokenExpiry };
