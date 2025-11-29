import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import { errors } from "celebrate";
import { requestLogger, errorLogger } from "./middleware/logger.js";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videosRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import publicReviewRoutes from "./routes/publicReviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import auth from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

config();

const app = express();
const { PORT = 8080, MONGODB_URI, NODE_ENV = "development" } = process.env;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    if (NODE_ENV !== "test") console.log("✅ Conectado a MongoDB", MONGODB_URI);
  })
  .catch((error) => {
    console.error(" Error conectando a MongoDB:", error);
    process.exit(1);
  });

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Demasiadas peticiones desde esta IP, intente más tarde.",
});
app.use(limiter);

const corsOptions = {
  origin:
    NODE_ENV === "production"
      ? ["https://final-backend-page.onrender.com"]
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
  preflightContinue: false,
};

app.use(cors(corsOptions));

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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/videos", videoRoutes);
app.use("/api/youtube", videoRoutes);
app.use("/reviews/public", publicReviewRoutes);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});

app.use("/users", auth, userRoutes);
app.use("/playlists", auth, playlistRoutes);
app.use("/reviews", auth, reviewRoutes);
app.use("/dashboard", auth, dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API del Backend funcionando correctamente",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  if (err.joi) {
    const validationErrors = {};
    err.joi.details.forEach((detail) => {
      const field = detail.path.join(".");
      validationErrors[field] = detail.message;
    });

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
  return next(err);
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Servidor corriendo en puerto ${PORT}`);
});

export default app;
