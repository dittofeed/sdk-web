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
          const method = DittofeedSdk[methodName];
          if (typeof method === "function") {
            method.apply(DittofeedSdk, call.slice(1));
          } else {
            console.warn(`Method ${methodName} not found on DittofeedSdk`);
          }
        }
      });
    }

    // Create a wrapper that combines static and instance methods
    const dfWrapper = {
      // Static methods
      identify: DittofeedSdk.identify.bind(DittofeedSdk),
      track: DittofeedSdk.track.bind(DittofeedSdk),
      page: DittofeedSdk.page.bind(DittofeedSdk),
      screen: DittofeedSdk.screen.bind(DittofeedSdk),
      flush: DittofeedSdk.flush.bind(DittofeedSdk),

      // Static methods for anonymous ID
      getAnonymousId: DittofeedSdk.getAnonymousId.bind(DittofeedSdk),
      resetAnonymousId: DittofeedSdk.resetAnonymousId.bind(DittofeedSdk),
    };

    // Replace the stubs with our wrapper
    window._df = dfWrapper;

    console.log(
      "DittofeedSdk initialized successfully with methods:",
      Object.keys(dfWrapper)
    );
  } catch (error) {
    console.error("Failed to initialize DittofeedSdk:", error);
  }
})();

export default DittofeedSdk;
