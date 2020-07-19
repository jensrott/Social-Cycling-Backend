const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.level = !isEmpty(data.level) ? data.level : "";
  data.social.youtube = !isEmpty(data.social.youtube)
    ? data.social.youtube
    : "";
  data.social.instagram = !isEmpty(data.social.instagram)
    ? data.social.instagram
    : "";
  data.social.twitter = !isEmpty(data.social.twitter)
    ? data.social.twitter
    : "";

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }

  if (Validator.isEmail(data.username)) {
    errors.username = "Username cannot be an email";
  }

  if (Validator.isEmpty(data.level)) {
    errors.level = "Skill level field is required";
  }

  if (Validator.isEmail(data.social.youtube)) {
    errors.youtube = "Youtube cannot be an email";
  }

  if (Validator.isEmail(data.social.instagram)) {
    errors.instagram = "Instagram cannot be an email";
  }

  if (Validator.isEmail(data.social.twitter)) {
    errors.twitter = "Twitter cannot be an email";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
