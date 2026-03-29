import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App.jsx";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

// Importar optimizador de rendimiento para dashboard
import "./utils/dashboardOptimizer.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
