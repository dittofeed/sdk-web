import { DittofeedSdk } from "./index";

function getConfig() {
  const scriptTag = document.getElementById("df-tracker");
  if (!scriptTag) {
    return null;
  }
  const writeKey = scriptTag.getAttribute("data-write-key");
  if (!writeKey) {
    return null;
  }
  return {
    writeKey,
    host: scriptTag.getAttribute("data-host") ?? undefined,
  };
}

(async function load() {
  const config = getConfig();
  if (config) {
    const init = window_.df;
    await DittofeedSdk.init(config);

    // Process any queued calls
    if (Array.isArray(init)) {
      init.forEach((call) => {
        if (Array.isArray(call) && call.length > 0) {
          const methodName = call[0];
          const method = DittofeedSdk[methodName];
          method.apply(DittofeedSdk, call.slice(1));
        }
      });
    }

    // Replace the stubs with actual methods from the instance
    window._df = DittofeedSdk;
  }
})();

export default DittofeedSdk;
