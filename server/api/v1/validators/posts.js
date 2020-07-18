const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.startLocation = !isEmpty(data.startLocation) ? data.startLocation : "";
  data.endLocation = !isEmpty(data.endLocation) ? data.endLocation : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (Validator.isEmpty(data.startLocation)) {
    errors.startLocation = "Start location is required";
  }

  if (Validator.isEmpty(data.endLocation)) {
    errors.endLocation = "End location is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
