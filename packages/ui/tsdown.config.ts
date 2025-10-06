import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "./src/components/index.ts",
    "./src/hooks/index.ts",
    "./src/contexts/index.ts",
  ],
  clean: true,
  format: ["esm"],
  dts: true,
  unbundle: true,
  outDir: "dist",
  external: ["react", "react-dom", "react/jsx-runtime"],
});
