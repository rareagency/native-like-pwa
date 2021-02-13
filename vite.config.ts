import { defineConfig } from "vite";
// vite.config.js
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/my-element.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: /^lit-element/,
    },
  },
  plugins: [VitePWA()],
});
