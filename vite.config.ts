import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const isSSGBuild = process.env.VITE_SSG === "true";

  return {
    server: {
      host: "0.0.0.0",
      port: 5000,
      allowedHosts: true,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    ssgOptions: {
      entry: "src/main.tsx",
      formatting: "minify",
      script: "async",
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: isSSGBuild
            ? undefined
            : (id) => {
                // React core — always eagerly needed
                if (
                  id.includes("/node_modules/react/") ||
                  id.includes("/node_modules/react-dom/") ||
                  id.includes("/node_modules/scheduler/")
                ) {
                  return "vendor-react";
                }
                // React Router — eagerly needed
                if (id.includes("/node_modules/react-router")) {
                  return "vendor-router";
                }
                // Radix UI — eagerly needed (Header uses dropdowns)
                if (id.includes("/node_modules/@radix-ui/")) {
                  return "vendor-radix";
                }
                // lucide-react — eagerly needed (Header icons)
                if (id.includes("/node_modules/lucide-react/")) {
                  return "vendor-icons";
                }
                // framer-motion — eagerly needed (Index hero animations)
                if (id.includes("/node_modules/framer-motion/")) {
                  return "vendor-motion";
                }
                // react-helmet-async — eagerly needed (SSG meta tags)
                if (id.includes("/node_modules/react-helmet-async/")) {
                  return "vendor-helmet";
                }
                // Heavy PDF libs — only loaded by PDF tools (lazy)
                if (
                  id.includes("/node_modules/pdf-lib/") ||
                  id.includes("/node_modules/jspdf/")
                ) {
                  return "vendor-pdf";
                }
                // pdfjs-dist is enormous — isolate it (lazy PDF tools only)
                if (id.includes("/node_modules/pdfjs-dist/")) {
                  return "vendor-pdfjs";
                }
                // All other deps: let Rollup decide — tool-specific libs
                // will co-locate with their lazy tool chunk automatically
              },
        },
      },
      target: "esnext",
      minify: "esbuild",
    },
  } as any;
});
