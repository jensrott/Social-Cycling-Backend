const Validator = require("validator");
const isEmpty = require("is-empty");

const validateLoginInput = input => {
  let errors = {};

  input.loginEmail = !isEmpty(input.loginEmail) ? input.loginEmail : "";
  input.loginPassword = !isEmpty(input.loginPassword) ? input.loginPassword : "";

  if (Validator.isEmpty(input.loginEmail)) {
    errors.loginEmail = "Email field is required";
  } else if (!Validator.isEmail(input.loginEmail)) {
    errors.loginEmail = "Email is invalid";
  }

  if (Validator.isEmpty(input.loginPassword)) {
    errors.loginPassword = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateLoginInput;
