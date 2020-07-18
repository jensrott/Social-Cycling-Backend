const Validator = require("validator");
const isEmpty = require("is-empty");

const validateRegisterInput = input => {
  let errors = {};

  console.log(input);


  // Convert empty fields to an empty string so we can use validator functions
  input.registerName = !isEmpty(input.registerName) ? input.registerName : "";
  input.registerEmail = !isEmpty(input.registerEmail) ? input.registerEmail : "";
  input.registerPassword = !isEmpty(input.registerPassword) ? input.registerPassword : "";
  input.registerRepeatPassword = !isEmpty(input.registerRepeatPassword) ? input.registerRepeatPassword : "";

  // registerName checks
  if (Validator.isEmpty(input.registerName)) {
    errors.registerName = "Name field is required";
  } else if (!Validator.isLength(input.registerName, { min: 4, max: 30 })) {
    errors.registerName = "Name must be between 4 and 30 characters";
  }

  // registerEmail checks
  if (Validator.isEmpty(input.registerEmail)) {
    errors.registerEmail = "Email field is required";
  } else if (!Validator.isEmail(input.registerEmail)) {
    errors.registerEmail = "Email is invalid";
  }

  // registerPassword checks
  if (Validator.isEmpty(input.registerPassword)) {
    errors.registerPassword = "Password field is required";
  }

  if (!Validator.isLength(input.registerPassword, { min: 6, max: 30 })) {
    errors.registerPassword = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(input.registerRepeatPassword)) {
    errors.registerRepeatPassword = "You have to confirm your password";
  }

  console.log(input.registerPassword);
  console.log(input.registerRepeatPassword);

  if (!Validator.equals(input.registerPassword, input.registerRepeatPassword)) {
    errors.registerRepeatPassword = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateRegisterInput;
