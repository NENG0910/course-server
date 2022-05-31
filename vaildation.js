const Joi = require("joi");

//Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(6).max(100).email(),
    password: Joi.string().required().min(6).max(1024),
    role: Joi.string().required().valid("student", "instructor"),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().min(6).max(100).email(),
    password: Joi.string().required().min(6).max(1024),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
