import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import { errors } from "celebrate";

// Importar rutas
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videosRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import publicReviewRoutes from "./routes/publicReviewRoutes.js";

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

// Configurar CORS
const corsOptions = {
  origin:
    NODE_ENV === "production"
      ? ["https://tu-dominio-frontend.com"]
      : [
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "http://localhost:3000",
        ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

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
// app.use("/signup", authRoutes);
// app.use("/signin", authRoutes);
app.use("/", authRoutes);
app.use("/videos", videoRoutes);
app.use("/api/youtube", videoRoutes); // Ruta alternativa para compatibilidad
app.use("/reviews/public", publicReviewRoutes);

// Middleware de autenticación para rutas protegidas
app.use(auth);

// Rutas protegidas
app.use("/users", userRoutes);
app.use("/playlists", playlistRoutes);
app.use("/reviews", reviewRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API del Backend funcionando correctamente",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Middleware de manejo de errores de Celebrate
app.use(errors());

// Middleware de manejo de errores personalizado
app.use(errorHandler);

// Manejo de rutas no encontradas
app.all("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Modo: ${NODE_ENV}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
});

export default app;
