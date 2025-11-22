import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  // Permitir peticiones OPTIONS (preflight) sin autenticación
  if (req.method === "OPTIONS") {
    return next();
  }

  const { authorization } = req.headers;

  // Verificar si existe el header Authorization
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token de autorización requerido",
    });
  }

  // Verificar formato Bearer token
  // if (!authorization.startsWith("Bearer ")) {
  //   return res.status(401).json({
  //     message: "Formato de token inválido. Use: Bearer <token>",
  //   });
  // }

  try {
    // Extraer el token
    const token = authorization.replace("Bearer ", "");
    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tu-clave-secreta-muy-segura"
    );
    // Agregar información del usuario al request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expirado. Por favor, inicie sesión nuevamente",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    return res.status(401).json({
      message: "Error de autorización",
    });
  }
};

export default auth;
