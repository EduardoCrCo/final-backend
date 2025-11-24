import { ERROR_MESSAGES, HTTP_STATUS } from "./constants.js";

// Funciones para crear errores específicos
export const createNotFoundError = (
  message = ERROR_MESSAGES.RESOURCE_NOT_FOUND
) => {
  const error = new Error(message);
  error.statusCode = HTTP_STATUS.NOT_FOUND;
  error.name = "NotFoundError";
  return error;
};

export const createValidationError = (
  message = ERROR_MESSAGES.VALIDATION_ERROR,
  errors = []
) => {
  const error = new Error(message);
  error.statusCode = HTTP_STATUS.BAD_REQUEST;
  error.name = "ValidationError";
  error.errors = errors;
  return error;
};

export const createAuthError = (message = ERROR_MESSAGES.UNAUTHORIZED) => {
  const error = new Error(message);
  error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  error.name = "AuthError";
  return error;
};

export const createConflictError = (message = ERROR_MESSAGES.USER_EXISTS) => {
  const error = new Error(message);
  error.statusCode = HTTP_STATUS.CONFLICT;
  error.name = "ConflictError";
  return error;
};

export const createExternalAPIError = (
  message = ERROR_MESSAGES.EXTERNAL_API_ERROR
) => {
  const error = new Error(message);
  error.statusCode = HTTP_STATUS.BAD_GATEWAY;
  error.name = "ExternalAPIError";
  return error;
};

// Función principal para manejar errores de mongoose orFail
const handleFailError = () => {
  throw createNotFoundError();
};

// Función para crear errores específicos
export const createError = (type, message, statusCode) => {
  const error = new Error(message);
  error.name = type;
  error.statusCode = statusCode;
  return error;
};

// Función para manejar errores de validación de mongoose
export const handleValidationError = (mongooseError) => {
  const messages = Object.values(mongooseError.errors).map(
    (err) => err.message
  );
  return createValidationError(ERROR_MESSAGES.VALIDATION_ERROR, messages);
};

// Función para manejar errores de duplicación de mongoose
export const handleDuplicateError = (mongooseError) => {
  const field = Object.keys(mongooseError.keyValue)[0];
  const message = `El ${field} ya está en uso`;
  return createConflictError(message);
};

// Función para manejar errores de cast de mongoose
export const handleCastError = (mongooseError) => {
  const message = `ID inválido: ${mongooseError.value}`;
  return createValidationError(message);
};

export default handleFailError;
