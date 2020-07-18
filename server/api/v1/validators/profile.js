const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data) {

    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : "";
    data.level = !isEmpty(data.level) ? data.level : "";

    if (Validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    }

    if (Validator.isEmail(data.username)) {
        errors.username = "Username cannot be an email";
    }

    if (Validator.isEmpty(data.level)) {
        errors.level = "Skill level field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
