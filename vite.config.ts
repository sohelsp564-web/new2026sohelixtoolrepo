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
            : {
                "vendor-react": ["react", "react-dom"],
                "vendor-router": ["react-router-dom"],
                "vendor-ui": [
                  "@radix-ui/react-accordion",
                  "@radix-ui/react-dialog",
                  "@radix-ui/react-dropdown-menu",
                  "@radix-ui/react-popover",
                  "@radix-ui/react-tabs",
                  "@radix-ui/react-tooltip",
                  "@radix-ui/react-select",
                ],
                "vendor-motion": ["framer-motion"],
                "vendor-pdf": ["pdf-lib", "jspdf"],
                "vendor-query": ["@tanstack/react-query"],
                "vendor-helmet": ["react-helmet-async"],
              },
        },
      },
      target: "esnext",
      minify: "esbuild",
    },
  } as any;
});
