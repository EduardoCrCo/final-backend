import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import tailwindcss from "./tailwind.config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
