const { Schema, model } = require("mongoose");

const jtiSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const JTI = model("JTI", jtiSchema);
module.exports = { JTI };
