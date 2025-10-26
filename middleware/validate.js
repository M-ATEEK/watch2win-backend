// Modules
const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  let validate = validationResult(req);
  if (!validate.isEmpty()) {
    res.status(400).send({
      message: "Please fill all the fields",
      errors: validate.errors
    });
  } else {
    next();
  }
};
