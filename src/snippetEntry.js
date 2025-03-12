import { DittofeedSdk } from "./index";
import { config } from "./config";

function getConfig() {
  const scriptTag = document.getElementById("df-tracker");
  let writeKey = null;
  let host = config.API_HOST;

  // First try to get the key from the script tag attribute
  if (scriptTag) {
    writeKey = scriptTag.getAttribute("data-write-key");
    const hostAttr = scriptTag.getAttribute("data-host");
    if (hostAttr) {
      host = hostAttr;
    }
  }

  // If not found in the script tag, use the environment variable
  if (!writeKey && config.DITTOFEED_WRITE_KEY) {
    writeKey = config.DITTOFEED_WRITE_KEY;
  }

  // If we still don't have a key, log an error
  if (!writeKey) {
    console.error(
      "No write key found! Please set it in your .env file as DITTOFEED_WRITE_KEY or provide it as a data-write-key attribute on the script tag."
    );
    return null;
  }

  return {
    writeKey,
    host,
  };
}

(async function load() {
  const sdkConfig = getConfig();

  if (!sdkConfig) {
    console.error("Failed to initialize SDK: missing configuration.");
    return;
  }

  console.log("Initializing SDK with config:", {
    writeKey: "Key present (masked for security)",
    host: sdkConfig.host,
  });

  try {
    const init = window._df;
    const sdkInstance = await DittofeedSdk.init(sdkConfig);

    // Process any queued calls
    if (Array.isArray(init)) {
      init.forEach((call) => {
        if (Array.isArray(call) && call.length > 0) {
          const methodName = call[0];
          const method = sdkInstance[methodName];
          if (typeof method === "function") {
            method.apply(sdkInstance, call.slice(1));
          } else {
            console.warn(`Method ${methodName} not found on DittofeedSdk`);
          }
        }
      });
    }

    // Replace the queue with the actual SDK instance
    window._df = sdkInstance;

    console.log(
      "DittofeedSdk initialized successfully with methods:",
      Object.keys(sdkInstance)
    );
  } catch (error) {
    console.error("Failed to initialize DittofeedSdk:", error);
  }
})();

export default DittofeedSdk;
