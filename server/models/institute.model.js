const { Schema, model } = require("mongoose");

// options/enums
const territories = [
  "England",
  "Guernsey",
  "Jersey",
  "Isle of Man",
  "Northern Ireland",
  "Scotland",
  "Wales",
];
const instituteLevels = [
  "Nursery",
  "First",
  "Primary",
  "Infant",
  "Junior",
  "Middle",
  "Secondary",
  "High",
  "All-through",
  "Post-16",
  "Other",
];
const instituteTypes = [
  "Academy",
  "College",
  "Free School",
  "Independent",
  "LA Maintained",
  "Special School",
  "Welsh School",
  "State FE",
  "Independent Fe",
  "6th Form",
  "General FE",
  "Land College",
  "Adult Learning / Council-run Services",
  "Art, Design and Performing Arts College",
  "Other",
];

const instituteSchema = new Schema(
  {
    name: { type: String, required: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      town: { type: String, required: true },
      postCode: { type: String, required: true },
      territory: { type: String, required: true, enum: territories },
      county: { type: String },
      localAuthority: { type: String, required: true },
    },
    level: { type: String, required: true, enum: instituteLevels },
    type: { type: String, enum: instituteTypes },
    homePage: { type: String },
    noOfStudents: { type: Number },
  },
  { timestamps: true }
);

const Institute = model("Institute", instituteSchema);

module.exports = { Institute, instituteLevels, instituteTypes, territories };
