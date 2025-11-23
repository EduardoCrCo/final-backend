import { ERROR_MESSAGES, HTTP_STATUS } from "../utils/constants.js";
import {
  handleValidationError,
  handleDuplicateError,
  handleCastError,
} from "../utils/handleErrors.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Errores personalizados con statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }

  // Error de cast de MongoDB (ID inválido)
  if (err.name === "CastError") {
    const castError = handleCastError(err);
    return res.status(castError.statusCode).json({
      success: false,
      message: castError.message,
    });
  }

  // Error de validación de MongoDB
  if (err.name === "ValidationError") {
    const validationError = handleValidationError(err);
    return res.status(validationError.statusCode).json({
      success: false,
      message: validationError.message,
      errors: validationError.errors,
    });
  }

  // Error de duplicado de MongoDB (email único)
  if (err.code === 11000) {
    const duplicateError = handleDuplicateError(err);
    return res.status(duplicateError.statusCode).json({
      success: false,
      message: duplicateError.message,
    });
  }

  // Errores de JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.TOKEN_INVALID,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.TOKEN_EXPIRED,
    });
  }

  // Error de conexión a MongoDB
  if (err.name === "MongoNetworkError") {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.DATABASE_ERROR,
    });
  }

  // Error de rate limiting
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: "Demasiadas solicitudes, intente más tarde",
    });
  }

  // Error interno del servidor
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

export default errorHandler;
