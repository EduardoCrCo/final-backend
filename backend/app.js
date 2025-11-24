import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import { errors } from "celebrate";
import { requestLogger, errorLogger } from "./middleware/logger.js";

// Importar rutas
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videosRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import publicReviewRoutes from "./routes/publicReviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Importar middleware
import auth from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

// Cargar variables de entorno
config();

const app = express();
const { PORT = 8080, NODE_ENV = "development" } = process.env;

// Middlewares de seguridad
app.use(helmet());

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: "Demasiadas peticiones desde esta IP, intente más tarde.",
});
app.use(limiter);

// Configurar CORS ANTES que todo
const corsOptions = {
  origin:
    NODE_ENV === "production"
      ? ["https://tu-dominio-frontend.com"]
      : [
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "http://localhost:3000",
          "http://127.0.0.1:3000",
        ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false, // Terminar preflight aquí
};

// CORS debe ir ANTES de cualquier middleware de autenticación
app.use(cors(corsOptions));

// Manejar preflight requests explícitamente
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Access-Control-Allow-Origin"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

app.use(requestLogger);
// Middleware para parsear JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/proyecto_final_db"
  )
  .then(() => {
    console.log("✅ Conectado a MongoDB");
  })
  .catch((error) => {
    console.error("❌ Error conectando a MongoDB:", error);
  });

// Rutas públicas (sin autenticación)
app.use("/", authRoutes);
app.use("/videos", videoRoutes);
app.use("/api/youtube", videoRoutes); // Ruta alternativa para compatibilidad
app.use("/reviews/public", publicReviewRoutes);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});

// Rutas protegidas (con middleware de autenticación específico)
app.use("/users", auth, userRoutes);
app.use("/playlists", auth, playlistRoutes);
app.use("/reviews", auth, reviewRoutes);
app.use("/dashboard", auth, dashboardRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API del Backend funcionando correctamente",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Middleware de manejo de errores de Celebrate
//app.use(errors());

// Middleware de manejo de errores personalizado
//app.use(errorHandler);

// Manejo de rutas no encontradas
app.all("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use(errorLogger);

// Middleware personalizado para errores de validación de Celebrate
app.use((err, req, res, next) => {
  if (err.joi) {
    // Es un error de validación de Joi (Celebrate)
    const validationErrors = {};
    err.joi.details.forEach((detail) => {
      const field = detail.path.join(".");
      validationErrors[field] = detail.message;
    });

    console.log("❌ Validation error:", validationErrors);

    return res.status(400).json({
      message: "Error de validación",
      errors: validationErrors,
      details: err.joi.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        value: detail.context.value,
      })),
    });
  }
  next(err);
});

// Middleware de manejo de errores de Celebrate
app.use(errors());
// Middleware de manejo de errores personalizado
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Modo: ${NODE_ENV}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
});

export default app;
