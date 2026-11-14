import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig([
  {
    configFile: false,
    publicDir: "public",
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: { input: resolve(process.cwd(), "popup.html") }
    }
  },
  {
    configFile: false,
    publicDir: false,
    build: {
      outDir: "dist",
      emptyOutDir: false,
      rollupOptions: {
        input: resolve(process.cwd(), "src/content.ts"),
        output: {
          format: "iife",
          inlineDynamicImports: true,
          entryFileNames: "content.js"
        }
      }
    }
  }
]);