const { Schema, model } = require("mongoose");

const keyStages = ["Foundation Stage", "KS1", "KS2", "KS3", "KS4", "KS5"];
const examBoards = [
  "EdExcel",
  "AQA",
  "CCEA",
  "CIE",
  "ICAAE",
  "OCR",
  "WJEC",
  "SQA",
];

const classSchema = new Schema(
  {
    institute: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    name: { type: String, required: true },
    keyStage: { type: String, enum: keyStages },
    yearGroup: { type: Number },
    noOfStudents: { type: Number },
    examBoard: { type: String, enum: examBoards },
  },
  { timestamps: true }
);

const Class = model("Class", classSchema);

module.exports = { Class, keyStages, examBoards };
