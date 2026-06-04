import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static, zero-backend SPA. Keep the build dependency-light so the Navigator
// component tree can later be embedded into the production Organon site (or
// lifted to a standalone /hcp/nexplanon-navigator route) without a rewrite.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
