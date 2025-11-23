import { ERROR_MESSAGES, HTTP_STATUS } from "./constants.js";

// Error personalizado para recursos no encontrados
export class NotFoundError extends Error {
  constructor(message = ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
    super(message);
    this.statusCode = HTTP_STATUS.NOT_FOUND;
    this.name = "NotFoundError";
  }
}

// Error personalizado para validación
export class ValidationError extends Error {
  constructor(message = ERROR_MESSAGES.VALIDATION_ERROR, errors = []) {
    super(message);
    this.statusCode = HTTP_STATUS.BAD_REQUEST;
    this.name = "ValidationError";
    this.errors = errors;
  }
}

// Error personalizado para autenticación
export class AuthError extends Error {
  constructor(message = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message);
    this.statusCode = HTTP_STATUS.UNAUTHORIZED;
    this.name = "AuthError";
  }
}

// Error personalizado para conflictos
export class ConflictError extends Error {
  constructor(message = ERROR_MESSAGES.USER_EXISTS) {
    super(message);
    this.statusCode = HTTP_STATUS.CONFLICT;
    this.name = "ConflictError";
  }
}

// Error personalizado para APIs externas
export class ExternalAPIError extends Error {
  constructor(message = ERROR_MESSAGES.EXTERNAL_API_ERROR) {
    super(message);
    this.statusCode = HTTP_STATUS.BAD_GATEWAY;
    this.name = "ExternalAPIError";
  }
}

// Función principal para manejar errores de mongoose orFail
const handleFailError = () => {
  const error = new NotFoundError();
  throw error;
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
  return new ValidationError(ERROR_MESSAGES.VALIDATION_ERROR, messages);
};

// Función para manejar errores de duplicación de mongoose
export const handleDuplicateError = (mongooseError) => {
  const field = Object.keys(mongooseError.keyValue)[0];
  const message = `El ${field} ya está en uso`;
  return new ConflictError(message);
};

// Función para manejar errores de cast de mongoose
export const handleCastError = (mongooseError) => {
  const message = `ID inválido: ${mongooseError.value}`;
  return new ValidationError(message);
};

export default handleFailError;
