import { HTTP_STATUS, SUCCESS_MESSAGES } from "./constants.js";

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

export const sendCreatedSuccess = (
  res,
  data,
  message = SUCCESS_MESSAGES.OPERATION_SUCCESSFUL
) =>
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message,
    data,
  });

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

export const sendValidationError = (
  res,
  errors,
  message = "Datos de entrada inválidos"
) =>
  res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message,
    errors,
  });

export const sendAuthError = (res, message = "No autorizado") =>
  res.status(HTTP_STATUS.UNAUTHORIZED).json({
    success: false,
    message,
  });

export const sendNotFoundError = (res, message = "Recurso no encontrado") =>
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message,
  });

export const sendConflictError = (res, message = "Conflicto de recursos") =>
  res.status(HTTP_STATUS.CONFLICT).json({
    success: false,
    message,
  });

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
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages,
      hasNext,
      hasPrev,
    },
  });
};

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
