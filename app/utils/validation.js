const Joi = require('joi');

const validateRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(data);
};

const validatePost = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  });

  return schema.validate(data);
};

module.exports = { validateRegister, validateLogin, validatePost };
