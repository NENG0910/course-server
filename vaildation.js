const Joi = require("joi");

//Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
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

const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().min(6).max(50),
    description: Joi.string().required().min(6).max(50),
    price: Joi.number().required().min(10).max(9999),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
