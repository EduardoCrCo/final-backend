import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

// Middlewares básicos
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "Servidor de prueba funcionando",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Ruta de signup básica
app.post("/signup", (req, res) => {
  console.log("Datos recibidos:", req.body);
  res.json({
    message: "Registro exitoso (prueba)",
    user: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Ruta de signin básica
app.post("/signin", (req, res) => {
  console.log("Login datos:", req.body);
  res.json({
    message: "Login exitoso (prueba)",
    token: "test-token-123",
    user: { email: req.body.email },
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba corriendo en puerto ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
});
