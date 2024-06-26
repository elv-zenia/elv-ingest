import {defineConfig, splitVendorChunkPlugin} from "vite";
import react from "@vitejs/plugin-react-swc";
import {viteStaticCopy} from "vite-plugin-static-copy";
import {fileURLToPath, URL} from "url";

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "configuration.js",
          dest: ""
        }
      ]
    })
  ],
  build: {
    outDir: "dist",
    manifest: true
  },
  server: {
    port: 9001,
    host: true
  },
  resolve: {
    alias: {
      "@/assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@/components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@/pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@/stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
      "@/helpers": fileURLToPath(new URL("./src/helpers", import.meta.url)),
      "@/utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
      "@/types": fileURLToPath(new URL("./types", import.meta.url))
    }
  }
});
