import { celebrate, Joi } from "celebrate";
import validator from "validator";

// validacion personalizada de URLs
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// Validaciones para autenticación
export const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "El nombre debe tener al menos 2 caracteres",
      "string.max": "El nombre no puede tener más de 30 caracteres",
      "any.required": "El nombre es requerido",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Debe ser un email válido",
      "any.required": "El email es requerido",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "La contraseña debe tener al menos 8 caracteres",
      "any.required": "La contraseña es requerida",
    }),
    about: Joi.string().min(2).max(30).optional().allow("").messages({
      "string.min": "La descripción debe tener al menos 2 caracteres",
      "string.max": "La descripción no puede tener más de 30 caracteres",
    }),
  }),
});

export const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "Debe ser un email válido",
      "any.required": "El email es requerido",
    }),
    password: Joi.string().required().messages({
      "any.required": "La contraseña es requerida",
    }),
  }),
});

// Validaciones para usuarios
export const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "El nombre debe tener al menos 2 caracteres",
      "string.max": "El nombre no puede tener más de 30 caracteres",
    }),
    about: Joi.string().min(2).max(200).messages({
      "string.min": "La descripción debe tener al menos 2 caracteres",
      "string.max": "La descripción no puede tener más de 200 caracteres",
    }),
  }),
});

export const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateURL).required().messages({
      "any.required": "La URL del avatar es requerida",
      "string.uri": "Debe ser una URL válida",
    }),
  }),
});

// Validaciones para playlists
export const createPlaylistValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(1).max(100).required().messages({
      "string.min": "El nombre de la playlist no puede estar vacío",
      "string.max": "El nombre no puede tener más de 100 caracteres",
      "any.required": "El nombre de la playlist es requerido",
    }),
    description: Joi.string().max(500).messages({
      "string.max": "La descripción no puede tener más de 500 caracteres",
    }),
  }),
});

export const updatePlaylistValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(1).max(100).messages({
      "string.min": "El nombre de la playlist no puede estar vacío",
      "string.max": "El nombre no puede tener más de 100 caracteres",
    }),
    description: Joi.string().max(500).messages({
      "string.max": "La descripción no puede tener más de 500 caracteres",
    }),
  }),
});

// Validaciones para videos
export const addVideoToPlaylistValidation = celebrate({
  body: Joi.object().keys({
    youtubeId: Joi.string().required().messages({
      "any.required": "El ID del video de YouTube es requerido",
    }),
    title: Joi.string().required().messages({
      "any.required": "El título del video es requerido",
    }),
    thumbnail: Joi.string().custom(validateURL).required().messages({
      "any.required": "La URL del thumbnail es requerida",
      "string.uri": "Debe ser una URL válida",
    }),
    // Campos opcionales adicionales
    description: Joi.string().allow("").optional(),
    channelTitle: Joi.string().allow("").optional(),
    duration: Joi.string().allow("").optional(),
    publishedAt: Joi.date().optional(),
  }),
});

// Validaciones para reviews
export const createReviewValidation = celebrate({
  body: Joi.object().keys({
    title: Joi.string().min(5).max(200).required().messages({
      "string.min": "El título debe tener al menos 5 caracteres",
      "string.max": "El título no puede tener más de 200 caracteres",
      "any.required": "El título es requerido",
    }),
    content: Joi.string().min(10).max(2000).required().messages({
      "string.min": "El contenido debe tener al menos 10 caracteres",
      "string.max": "El contenido no puede tener más de 2000 caracteres",
      "any.required": "El contenido es requerido",
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.min": "La calificación debe ser entre 1 y 5",
      "number.max": "La calificación debe ser entre 1 y 5",
      "any.required": "La calificación es requerida",
    }),
  }),
});

export const updateReviewValidation = celebrate({
  body: Joi.object().keys({
    title: Joi.string().min(5).max(200).messages({
      "string.min": "El título debe tener al menos 5 caracteres",
      "string.max": "El título no puede tener más de 200 caracteres",
    }),
    content: Joi.string().min(10).max(2000).messages({
      "string.min": "El contenido debe tener al menos 10 caracteres",
      "string.max": "El contenido no puede tener más de 2000 caracteres",
    }),
    rating: Joi.number().integer().min(1).max(5).messages({
      "number.min": "La calificación debe ser entre 1 y 5",
      "number.max": "La calificación debe ser entre 1 y 5",
    }),
  }),
});

// Validaciones para parámetros comunes
export const validateObjectId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "ID inválido",
      "string.length": "ID debe tener 24 caracteres",
      "any.required": "ID es requerido",
    }),
  }),
});

export const validatePlaylistId = celebrate({
  params: Joi.object().keys({
    playlistId: Joi.string().hex().length(24).required().messages({
      "string.hex": "ID de playlist inválido",
      "string.length": "ID de playlist debe tener 24 caracteres",
      "any.required": "ID de playlist es requerido",
    }),
  }),
});

export const validateVideoId = celebrate({
  params: Joi.object().keys({
    videoId: Joi.string().hex().length(24).required().messages({
      "string.hex": "ID de video inválido",
      "string.length": "ID de video debe tener 24 caracteres",
      "any.required": "ID de video es requerido",
    }),
  }),
});

// Validación específica para remover video de playlist (acepta YouTube ID)
export const removeVideoFromPlaylistValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "ID de playlist inválido",
      "string.length": "ID de playlist debe tener 24 caracteres",
      "any.required": "ID de playlist es requerido",
    }),
    videoId: Joi.string().min(1).max(50).required().messages({
      "string.min": "Video ID es requerido",
      "string.max": "Video ID demasiado largo",
      "any.required": "Video ID es requerido",
    }),
  }),
});
