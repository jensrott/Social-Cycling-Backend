const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.level = !isEmpty(data.level) ? data.level : "";
  data.youtube = !isEmpty(data.youtube) ? data.youtube : "";
  data.instagram = !isEmpty(data.instagram) ? data.instagram : "";
  data.twitter = !isEmpty(data.twitter) ? data.twitter : "";

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }

  if (Validator.isEmail(data.username)) {
    errors.username = "Username cannot be an email";
  }

  if (Validator.isEmpty(data.level)) {
    errors.level = "Skill level field is required";
  }

  if (Validator.isEmail(data.youtube)) {
    errors.youtube = "Youtube cannot be an email";
  }

  if (Validator.isEmail(data.instagram)) {
    errors.instagram = "Instagram cannot be an email";
  }

  if (Validator.isEmail(data.twitter)) {
    errors.twitter = "Twitter cannot be an email";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
