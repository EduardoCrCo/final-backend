// Constantes de la aplicación

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Email o contraseña incorrectos",
  USER_EXISTS: "El usuario con este email ya existe",
  USER_NOT_FOUND: "Usuario no encontrado",
  USER_INACTIVE: "Usuario no encontrado o inactivo",
  UNAUTHORIZED: "Usuario no autorizado",
  TOKEN_EXPIRED: "Token expirado",
  TOKEN_INVALID: "Token inválido",

  VALIDATION_ERROR: "Datos de entrada inválidos",
  REQUIRED_FIELDS: "Campos requeridos faltantes",
  INVALID_ID: "ID inválido",
  INVALID_URL: "URL inválida",

  RESOURCE_NOT_FOUND: "Recurso no encontrado",
  PLAYLIST_NOT_FOUND: "Playlist no encontrada",
  VIDEO_NOT_FOUND: "Video no encontrado",
  REVIEW_NOT_FOUND: "Review no encontrada",

  VIDEO_ALREADY_EXISTS: "El video ya está en la playlist",
  VIDEO_NOT_IN_PLAYLIST: "Video no encontrado en la playlist",
  DUPLICATE_LIKE: "Ya has dado like a este video",

  INTERNAL_SERVER_ERROR: "Error interno del servidor",
  DATABASE_ERROR: "Error de base de datos",
  YOUTUBE_API_ERROR: "Error al conectar con YouTube API",
  EXTERNAL_API_ERROR: "Error al conectar con servicio externo",
};

export const SUCCESS_MESSAGES = {
  USER_CREATED: "Usuario creado exitosamente",
  LOGIN_SUCCESS: "Inicio de sesión exitoso",
  LOGOUT_SUCCESS: "Sesión cerrada exitosamente",

  PROFILE_UPDATED: "Perfil actualizado exitosamente",
  AVATAR_UPDATED: "Avatar actualizado exitosamente",
  ACCOUNT_DEACTIVATED: "Cuenta desactivada exitosamente",

  PLAYLIST_CREATED: "Playlist creada exitosamente",
  PLAYLIST_UPDATED: "Playlist actualizada exitosamente",
  PLAYLIST_DELETED: "Playlist eliminada correctamente",
  VIDEO_ADDED: "Video agregado correctamente",
  VIDEO_REMOVED: "Video eliminado correctamente",

  REVIEW_CREATED: "Review creada exitosamente",
  REVIEW_UPDATED: "Review actualizada exitosamente",
  REVIEW_DELETED: "Review eliminada exitosamente",

  SEARCH_COMPLETED: "Búsqueda completada exitosamente",
  VIDEO_FOUND: "Video encontrado exitosamente",
  LIKE_ADDED: "Like agregado exitosamente",
  LIKE_REMOVED: "Like removido exitosamente",

  OPERATION_SUCCESSFUL: "Operación completada exitosamente",
  DATA_RETRIEVED: "Datos obtenidos exitosamente",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
};

export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 30,
  ABOUT_MAX_LENGTH: 200,
  PLAYLIST_NAME_MAX_LENGTH: 100,
  PLAYLIST_DESCRIPTION_MAX_LENGTH: 500,
  REVIEW_TITLE_MIN_LENGTH: 5,
  REVIEW_TITLE_MAX_LENGTH: 200,
  REVIEW_CONTENT_MIN_LENGTH: 10,
  REVIEW_CONTENT_MAX_LENGTH: 2000,
  RATING_MIN: 1,
  RATING_MAX: 5,
  MONGODB_ID_LENGTH: 24,
};

export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_SKIP: 0,
};

export const SECURITY_CONFIG = {
  JWT_EXPIRES_IN: "7d",
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutos
  RATE_LIMIT_MAX_REQUESTS: 100,
};

export const FILE_CONFIG = {
  MAX_FILE_SIZE: "10mb",
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

export const RESOURCE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DELETED: "deleted",
  PENDING: "pending",
};

export default {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_STATUS,
  VALIDATION_CONFIG,
  PAGINATION_CONFIG,
  SECURITY_CONFIG,
  FILE_CONFIG,
  USER_ROLES,
  RESOURCE_STATUS,
};
