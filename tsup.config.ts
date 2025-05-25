import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react"],
  injectStyle: false,
  outDir: "dist",
  esbuildOptions(options) {
    options.banner = {
      js: "// Nepali Date Utility- Beautiful React component for Nepali Bikram Sambat calendar",
    };
  },
});
