import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
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
});