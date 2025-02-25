import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
  server: {
    port: 4000, // Change if needed
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express", // Can also be 'fastify'
      appPath: "./src/app.js", // Entry point of your Express app
      exportName: "default", // For ES modules
    }),
  ],
  build: {
    outDir: "dist",
    target: "node18",
    minify: false,
    rollupOptions: {
      external: ["express", "cors", "mongoose", "dotenv"], // Avoid bundling these
    },
  },
});
