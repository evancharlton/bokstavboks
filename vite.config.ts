import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      base: "/",
      manifest: {
        name: "Bokstavboks",
        short_name: "Bokstavboks",
        theme_color: "#ffffff",
        icons: [
          {
            src: "favicon.png",
            sizes: "64x64 32x32",
            type: "image/x-icon",
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: ".",
      },

      devOptions: { enabled: true, navigateFallback: "index.html" },
      workbox: {
        globPatterns: ["**/*.js", "**/*.css"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        cacheId: "bokstavboks",
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith(".json"),
            handler: "NetworkFirst",
          },
        ],
      },
    }),
  ],
});
