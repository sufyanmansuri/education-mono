const { randomBytes } = require("node:crypto");

/**
 * Generates unique string
 * @returns 36 characters long unique string
 */
const generateUniqueString = async (model, fieldName, length) => {
  const string = randomBytes(length / 2).toString("hex");

  // If token is not unique then generate again
  if (await model.exists({ [fieldName]: string })) {
    return generateUniqueString(model, fieldName, length);
  }

  return string;
};

module.exports = generateUniqueString;
