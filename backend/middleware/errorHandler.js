const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Error de cast de MongoDB (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'ID de recurso inválido',
    })
  }

  // Error de validación de MongoDB
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((error) => error.message)
    return res.status(400).json({
      message: 'Datos de entrada inválidos',
      errors: messages,
    })
  }

  // Error de duplicado de MongoDB (email único)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(409).json({
      message: `Ya existe un registro con este ${field}`,
    })
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido',
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado',
    })
  }

  // Error de conexión a MongoDB
  if (err.name === 'MongoNetworkError') {
    return res.status(503).json({
      message: 'Error de conexión a la base de datos',
    })
  }

  // Error personalizado con status
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message || 'Error en el servidor',
    })
  }

  // Error interno del servidor
  res.status(500).json({
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  })
}

export default errorHandler
