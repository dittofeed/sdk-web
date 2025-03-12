// This file is processed by Vite and environment variables are injected
export const config = {
  // Try to get from environment, or use a development placeholder
  DITTOFEED_WRITE_KEY:
    import.meta.env.VITE_DITTOFEED_WRITE_KEY || "YOUR_DITTOFEED_WRITE_KEY_HERE",
  API_HOST: "http://localhost:3001",
};

console.log("config:", config);

// Expose config values to global scope for use in non-module scripts
window.DITTOFEED_CONFIG = config;
