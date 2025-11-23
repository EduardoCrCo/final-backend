import { celebrate, Joi } from "celebrate";
import validator from "validator";

// validacion personalizada de URLs
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};
