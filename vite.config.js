import { defineConfig } from "vite";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      outDir: "snippet",
      lib: {
        entry: "src/snippetEntry.js", // Entry file for your library
        name: "_df", // Global variable when module is included via a script tag
        fileName: (format) => `dittofeed.${format}.js`,
      },
    },
    define: {
      "process.env.DITTOFEED_WRITE_KEY": JSON.stringify(
        env.DITTOFEED_WRITE_KEY
      ),
    },
  };
});
