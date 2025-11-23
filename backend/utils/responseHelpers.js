import { HTTP_STATUS, SUCCESS_MESSAGES } from "./constants.js";

// Utilidades para respuestas HTTP consistentes

// Respuesta de éxito genérica
export const sendSuccess = (
  res,
  data = null,
  message = SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
  statusCode = HTTP_STATUS.OK
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Respuesta de éxito para datos obtenidos
export const sendDataSuccess = (
  res,
  data,
  message = SUCCESS_MESSAGES.DATA_RETRIEVED,
  count = null
) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (count !== null) {
    response.count = count;
  }

  return res.status(HTTP_STATUS.OK).json(response);
};

// Respuesta de éxito para creación
export const sendCreatedSuccess = (
  res,
  data,
  message = SUCCESS_MESSAGES.OPERATION_SUCCESSFUL
) => {
  return res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message,
    data,
  });
};

// Respuesta de error genérica
export const sendError = (
  res,
  message,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Respuesta de error de validación
export const sendValidationError = (
  res,
  errors,
  message = "Datos de entrada inválidos"
) => {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message,
    errors,
  });
};

// Respuesta de error de autenticación
export const sendAuthError = (res, message = "No autorizado") => {
  return res.status(HTTP_STATUS.UNAUTHORIZED).json({
    success: false,
    message,
  });
};

// Respuesta de error de recurso no encontrado
export const sendNotFoundError = (res, message = "Recurso no encontrado") => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message,
  });
};

// Respuesta de error de conflicto
export const sendConflictError = (res, message = "Conflicto de recursos") => {
  return res.status(HTTP_STATUS.CONFLICT).json({
    success: false,
    message,
  });
};

// Wrapper para paginación
export const sendPaginatedSuccess = (
  res,
  data,
  total,
  page = 1,
  limit = 20,
  message = SUCCESS_MESSAGES.DATA_RETRIEVED
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNext,
      hasPrev,
    },
  });
};

// Wrapper para búsquedas
export const sendSearchSuccess = (
  res,
  results,
  query,
  count = null,
  message = "Búsqueda completada exitosamente"
) => {
  const response = {
    success: true,
    message,
    query,
    results,
  };

  if (count !== null) {
    response.count = count;
  }

  return res.status(HTTP_STATUS.OK).json(response);
};

export default {
  sendSuccess,
  sendDataSuccess,
  sendCreatedSuccess,
  sendError,
  sendValidationError,
  sendAuthError,
  sendNotFoundError,
  sendConflictError,
  sendPaginatedSuccess,
  sendSearchSuccess,
};
