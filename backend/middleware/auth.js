import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token de autorización requerido",
    });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tu-clave-secreta-muy-segura"
    );
    req.user = decoded;

    return next();
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
