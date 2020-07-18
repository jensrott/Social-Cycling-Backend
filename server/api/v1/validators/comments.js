const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateCommentInput(data) {
    let errors = {};

    data.description = !isEmpty(data.description) ? data.description : "";

    if (Validator.isEmpty(data.description)) {
        errors.description = "Description field is required";
    }

    if (Validator.isURL(data.description)) {
        errors.description = "Don't add any unknown links";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
