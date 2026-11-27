import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "core/index": "src/core/index.ts",
    "react/index": "src/react/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  minify: true,
  sourcemap: false,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
  outDir: "dist",
  esbuildOptions(options) {
    options.banner = {
      js: "// nepali-date-utility — Nepali Bikram Sambat date library & React components",
    };
  },
});
