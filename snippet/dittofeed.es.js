var y = globalThis && globalThis.__awaiter || function(s, e, t, n) {
  function i(o) {
    return o instanceof t ? o : new t(function(r) {
      r(o);
    });
  }
  return new (t || (t = Promise))(function(o, r) {
    function d(c) {
      try {
        l(n.next(c));
      } catch (g) {
        r(g);
      }
    }
    function h(c) {
      try {
        l(n.throw(c));
      } catch (g) {
        r(g);
      }
    }
    function l(c) {
      c.done ? o(c.value) : i(c.value).then(d, h);
    }
    l((n = n.apply(s, e || [])).next());
  });
};
class A {
  constructor({
    batchSize: e,
    timeout: t,
    // default timeout is 500ms
    executeBatch: n,
    setTimeout: i,
    clearTimeout: o,
    baseDelay: r,
    retries: d
  }) {
    this.queue = [], this.batchSize = e, this.timeout = t, this.timeoutHandle = null, this.executeBatch = n, this.setTimeout = i, this.clearTimeout = o, this.pending = null, this.baseDelay = r ?? 500, this.retries = d ?? 5;
  }
  // Method to add a task to the queue
  submit(e) {
    this.queue.push(e), this.queue.length >= this.batchSize ? this.flush() : this.queue.length === 1 && this.startTimer();
  }
  // Start a timeout that will process the queue when it triggers
  startTimer() {
    this.timeoutHandle = this.setTimeout(() => this.flush(), this.timeout);
  }
  // Clear the current timeout
  clearTimer() {
    this.timeoutHandle && (this.clearTimeout(this.timeoutHandle), this.timeoutHandle = null);
  }
  // Process the queue by executing the batch function with the current batch, then remove the batch from the queue
  flush() {
    return y(this, void 0, void 0, function* () {
      if (this.clearTimer(), this.queue.length !== 0) {
        if (this.pending)
          return this.pending;
        try {
          this.pending = this.flushInner(), yield this.pending;
        } catch (e) {
          throw e;
        } finally {
          this.pending = null;
        }
      }
    });
  }
  // The inner function that actually performs the flush
  flushInner() {
    return y(this, void 0, void 0, function* () {
      for (; this.queue.length > 0; ) {
        const e = this.queue.slice(0, this.batchSize);
        this.queue = this.queue.slice(this.batchSize), yield this.executeBatchWithRetry(e);
      }
    });
  }
  executeBatchWithRetry(e) {
    return y(this, void 0, void 0, function* () {
      yield this.retryWithExponentialBackoff(() => y(this, void 0, void 0, function* () {
        yield this.executeBatch(e);
      }));
    });
  }
  retryWithExponentialBackoff(e) {
    return y(this, void 0, void 0, function* () {
      const t = Math.max(0, this.retries);
      for (let n = 0; n <= t; n++)
        try {
          return yield e();
        } catch (i) {
          if (n === t)
            throw i;
          const o = this.baseDelay * Math.pow(2, n);
          yield new Promise((r) => setTimeout(r, o));
        }
      throw new Error("This line should never be reached");
    });
  }
}
var I = globalThis && globalThis.__awaiter || function(s, e, t, n) {
  function i(o) {
    return o instanceof t ? o : new t(function(r) {
      r(o);
    });
  }
  return new (t || (t = Promise))(function(o, r) {
    function d(c) {
      try {
        l(n.next(c));
      } catch (g) {
        r(g);
      }
    }
    function h(c) {
      try {
        l(n.throw(c));
      } catch (g) {
        r(g);
      }
    }
    function l(c) {
      c.done ? o(c.value) : i(c.value).then(d, h);
    }
    l((n = n.apply(s, e || [])).next());
  });
}, S = globalThis && globalThis.__rest || function(s, e) {
  var t = {};
  for (var n in s)
    Object.prototype.hasOwnProperty.call(s, n) && e.indexOf(n) < 0 && (t[n] = s[n]);
  if (s != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, n = Object.getOwnPropertySymbols(s); i < n.length; i++)
      e.indexOf(n[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, n[i]) && (t[n[i]] = s[n[i]]);
  return t;
};
const m = {
  Identify: "identify",
  Track: "track",
  Page: "page",
  Screen: "screen"
}, w = {
  Subscribe: "Subscribe",
  Unsubscribe: "Unsubscribe"
}, D = {
  MessageSent: "DFInternalMessageSent",
  BadWorkspaceConfiguration: "DFBadWorkspaceConfiguration",
  MessageFailure: "DFMessageFailure",
  MessageSkipped: "DFMessageSkipped",
  SegmentBroadcast: "DFSegmentBroadcast",
  SubscriptionChange: "DFSubscriptionChange",
  EmailDropped: "DFEmailDropped",
  EmailDelivered: "DFEmailDelivered",
  EmailOpened: "DFEmailOpened",
  EmailClicked: "DFEmailClicked",
  EmailBounced: "DFEmailBounced",
  EmailMarkedSpam: "DFEmailMarkedSpam",
  SmsDelivered: "DFSmsDelivered",
  SmsFailed: "DFSmsFailed",
  JourneyNodeProcessed: "DFJourneyNodeProcessed",
  ManualSegmentUpdate: "DFManualSegmentUpdate",
  AttachedFiles: "DFAttachedFiles",
  UserTrackSignal: "DFUserTrackSignal",
  GroupUserAssignment: "DFGroupUserAssignment",
  UserGroupAssignment: "DFUserGroupAssignment"
};
class O {
  constructor({ issueRequest: e, writeKey: t, host: n = "https://app.dittofeed.com", uuid: i, setTimeout: o, clearTimeout: r, baseDelay: d, retries: h }) {
    this.batchQueue = new A({
      timeout: 500,
      batchSize: 5,
      setTimeout: o,
      clearTimeout: r,
      baseDelay: d,
      retries: h,
      executeBatch: (l) => I(this, void 0, void 0, function* () {
        yield e({
          batch: l
        }, { writeKey: t, host: n });
      })
    }), this.uuid = i;
  }
  identify(e) {
    var t;
    const n = Object.assign(Object.assign({}, e), { messageId: (t = e.messageId) !== null && t !== void 0 ? t : this.uuid(), type: m.Identify });
    this.batchQueue.submit(n);
  }
  track(e) {
    var t;
    const n = Object.assign(Object.assign({}, e), { messageId: (t = e.messageId) !== null && t !== void 0 ? t : this.uuid(), type: m.Track });
    this.batchQueue.submit(n);
  }
  page(e) {
    var t;
    const n = Object.assign(Object.assign({}, e), { messageId: (t = e.messageId) !== null && t !== void 0 ? t : this.uuid(), type: m.Page });
    this.batchQueue.submit(n);
  }
  screen(e) {
    var t;
    const n = Object.assign(Object.assign({}, e), { messageId: (t = e.messageId) !== null && t !== void 0 ? t : this.uuid(), type: m.Screen });
    this.batchQueue.submit(n);
  }
  subscribe(e) {
    const { messageId: t, subscriptionGroupId: n } = e, i = S(e, ["messageId", "subscriptionGroupId"]), o = Object.assign(Object.assign({}, i), { messageId: t ?? this.uuid(), type: m.Track, event: D.SubscriptionChange, properties: {
      subscriptionId: n,
      change: w.Subscribe
    } });
    this.batchQueue.submit(o);
  }
  unsubscribe(e) {
    const { messageId: t, subscriptionGroupId: n } = e, i = S(e, ["messageId", "subscriptionGroupId"]), o = Object.assign(Object.assign({}, i), { messageId: t ?? this.uuid(), type: m.Track, event: D.SubscriptionChange, properties: {
      subscriptionId: n,
      change: w.Unsubscribe
    } });
    this.batchQueue.submit(o);
  }
  flush() {
    return I(this, void 0, void 0, function* () {
      yield this.batchQueue.flush();
    });
  }
}
let f;
const F = new Uint8Array(16);
function T() {
  if (!f && (f = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !f))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return f(F);
}
const u = [];
for (let s = 0; s < 256; ++s)
  u.push((s + 256).toString(16).slice(1));
function U(s, e = 0) {
  return (u[s[e + 0]] + u[s[e + 1]] + u[s[e + 2]] + u[s[e + 3]] + "-" + u[s[e + 4]] + u[s[e + 5]] + "-" + u[s[e + 6]] + u[s[e + 7]] + "-" + u[s[e + 8]] + u[s[e + 9]] + "-" + u[s[e + 10]] + u[s[e + 11]] + u[s[e + 12]] + u[s[e + 13]] + u[s[e + 14]] + u[s[e + 15]]).toLowerCase();
}
const E = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), v = {
  randomUUID: E
};
function k(s, e, t) {
  if (v.randomUUID && !e && !s)
    return v.randomUUID();
  s = s || {};
  const n = s.random || (s.rng || T)();
  if (n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, e) {
    t = t || 0;
    for (let i = 0; i < 16; ++i)
      e[t + i] = n[i];
    return e;
  }
  return U(n);
}
const p = class a {
  constructor(e, t) {
    this.anonymousId = null, this.logger = null, this.baseSdk = e, this.logger = t ?? null;
  }
  static createBaseSdk(e) {
    return new O({
      uuid: () => k(),
      issueRequest: async (t, { host: n = "https://dittofeed.com", writeKey: i }) => {
        const o = `${n}/api/public/apps/batch`, d = await fetch(o, {
          method: "POST",
          headers: {
            authorization: i,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(t)
        });
        if (!d.ok)
          throw new Error(`HTTP error! status: ${d.status}`);
      },
      setTimeout: (t, n) => window.setTimeout(t, n),
      clearTimeout: (t) => window.clearTimeout(t),
      ...e
    });
  }
  /**
   * Initializes the Dittofeed SDK with the provided initialization parameters.
   * If an instance of the SDK already exists, it returns the existing instance.
   * Otherwise, it creates a new instance using the provided parameters.
   *
   * @param initParams - The initialization parameters required to set up the SDK.
   * @returns A promise that resolves to the initialized Dittofeed SDK instance.
   */
  static async init(e) {
    if (!a.instance) {
      const t = this.createBaseSdk(e);
      a.instance = new a(t, e.logger);
    }
    return a.instance;
  }
  /**
   * Initializes a new instance of the Dittofeed SDK with the provided initialization parameters.
   * Unlike the `init` method, this method always creates a new instance of the SDK, regardless
   * of whether an instance already exists.
   *
   * @param initParams - The initialization parameters required to set up the SDK.
   * @returns A promise that resolves to the newly initialized Dittofeed SDK instance.
   */
  static async initNew(e) {
    const t = this.createBaseSdk(e);
    return new a(t, e.logger);
  }
  /**
   * The Identify call lets you tie a user to their actions and record traits
   * about them. It includes a unique User ID and any optional traits you know
   * about the user, like their email, name, and more.
   * @param params
   * @returns
   */
  static identify(e) {
    if (this.instance)
      return this.instance.identify(e);
  }
  identify(e) {
    let t;
    return !("userId" in e) && !("anonymousId" in e) ? t = {
      ...e,
      anonymousId: this.getAnonymousId()
    } : t = e, this.baseSdk.identify(t);
  }
  /**
   * The Track call is how you record any actions your users perform, along with
   * any properties that describe the action.
   * @param params
   * @returns
   */
  static track(e) {
    if (this.instance)
      return this.instance.track(e);
  }
  track(e) {
    let t;
    return !("anonymousId" in e) && !("userId" in e) ? t = {
      ...e,
      anonymousId: this.getAnonymousId()
    } : t = e, this.baseSdk.track(t);
  }
  /**
   * The page call lets you record whenever a user sees a page of your website,
   * along with any optional properties about the page.
   * @param params
   * @returns
   */
  static page(e) {
    if (this.instance)
      return this.instance.page(e);
  }
  page(e) {
    let t;
    return !("anonymousId" in e) && !("userId" in e) ? t = {
      ...e,
      anonymousId: this.getAnonymousId()
    } : t = e, this.baseSdk.page(t);
  }
  /**
   * The screen call lets you record whenever a user sees a screen, the mobile
   * equivalent of page, in your mobile app, along with any properties about the
   * screen
   * @param params
   * @returns
   */
  static screen(e) {
    if (this.instance)
      return this.instance.screen(e);
  }
  screen(e) {
    let t;
    return !("anonymousId" in e) && !("userId" in e) ? t = {
      ...e,
      anonymousId: this.getAnonymousId()
    } : t = e, this.baseSdk.screen(t);
  }
  /**
   * A convenience method for subscribing a user to a subscription group.
   * @param params
   * @returns
   */
  static subscribe(e) {
    if (this.instance)
      return this.instance.subscribe(e);
  }
  subscribe(e) {
    let t;
    return !("anonymousId" in e) && !("userId" in e) ? t = {
      ...e,
      anonymousId: this.getAnonymousId()
    } : t = e, this.baseSdk.subscribe(t);
  }
  /**
   * A convenience method for unsubscribing a user from a subscription group.
   * @param params
   * @returns
   */
  static unsubscribe(e) {
    if (this.instance)
      return this.instance.unsubscribe(e);
  }
  unsubscribe(e) {
    let t;
    return !("anonymousId" in e) && !("userId" in e) ? t = {
      ...e,
      anonymousId: this.getAnonymousId()
    } : t = e, this.baseSdk.unsubscribe(t);
  }
  /**
   * Dittofeed events are submitted asynchronously. This method "flushes" the
   * remaining events synchronously to the API.
   * @returns
   */
  static flush() {
    if (this.instance)
      return this.instance.flush();
  }
  flush() {
    return this.baseSdk.flush();
  }
  /**
   * Gets the current anonymous ID used for tracking when no user ID is provided.
   * @returns The anonymous ID
   */
  static getAnonymousId() {
    if (!this.instance)
      throw new Error("DittofeedSdk not initialized");
    return this.instance.getAnonymousId();
  }
  /**
   * Initializes the anonymous ID if it is not already set and returns it.
   * @returns The anonymous ID.
   */
  getAnonymousId() {
    if (!this.anonymousId) {
      const e = this.retrieveStoredAnonymousId();
      let t;
      e ? t = e : (t = k(), this.storeAnonymousId(t)), this.anonymousId = t;
    }
    return this.anonymousId;
  }
  /**
   * Resets the anonymous ID and returns the new one.
   * @returns The new anonymous ID.
   */
  static resetAnonymousId() {
    if (!this.instance)
      throw new Error("DittofeedSdk not initialized");
    return this.instance.resetAnonymousId();
  }
  /**
   * Resets the anonymous ID and returns the new one.
   * @returns The new anonymous ID.
   */
  resetAnonymousId() {
    return this.anonymousId ? (this.deleteAnonymousId(), this.getAnonymousId()) : this.getAnonymousId();
  }
  /**
   * Retrieves the anonymous ID from the storage.
   * It uses the following priority:
   * cookies → localStorage → sessionStorage
   * Cookies expire after 2 years.
   * @returns The anonymous ID or null if it is not stored.
   */
  retrieveStoredAnonymousId() {
    var t, n;
    if (!a.isBrowserEnvironment())
      return null;
    const e = document.cookie.split(";");
    for (const i of e) {
      const o = i.trim().split("=");
      if (o.length >= 2 && o[0] === a.ANONYMOUS_ID && o[1] !== void 0)
        return decodeURIComponent(o[1]);
    }
    try {
      const i = localStorage.getItem(a.ANONYMOUS_ID);
      if (i)
        return i;
    } catch (i) {
      (t = this.logger) == null || t.warn("Failed to access localStorage:", i);
    }
    try {
      const i = sessionStorage.getItem(
        a.ANONYMOUS_ID
      );
      if (i)
        return i;
    } catch (i) {
      (n = this.logger) == null || n.warn("Failed to access sessionStorage:", i);
    }
    return null;
  }
  /**
   * Stores the anonymous ID.
   * @param anonymousId - The anonymous ID to store.
   */
  storeAnonymousId(e) {
    var o, r, d;
    if (!a.isBrowserEnvironment())
      return;
    const t = /* @__PURE__ */ new Date();
    t.setFullYear(t.getFullYear() + 2);
    const n = encodeURIComponent(e), i = `${a.ANONYMOUS_ID}=${n};expires=${t.toUTCString()};path=/;SameSite=Lax`;
    try {
      document.cookie = i;
    } catch (h) {
      (o = this.logger) == null || o.warn("Failed to set cookie:", h);
    }
    try {
      localStorage.setItem(a.ANONYMOUS_ID, e);
    } catch (h) {
      (r = this.logger) == null || r.warn("Failed to access localStorage:", h);
    }
    try {
      sessionStorage.setItem(a.ANONYMOUS_ID, e);
    } catch (h) {
      (d = this.logger) == null || d.warn("Failed to access sessionStorage:", h);
    }
  }
  deleteAnonymousId() {
    var e, t, n;
    if (this.anonymousId = null, !!a.isBrowserEnvironment()) {
      try {
        document.cookie = `${a.ANONYMOUS_ID}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
      } catch (i) {
        (e = this.logger) == null || e.warn("Failed to delete cookie:", i);
      }
      try {
        localStorage.removeItem(a.ANONYMOUS_ID);
      } catch (i) {
        (t = this.logger) == null || t.warn("Failed to access localStorage:", i);
      }
      try {
        sessionStorage.removeItem(a.ANONYMOUS_ID);
      } catch (i) {
        (n = this.logger) == null || n.warn("Failed to access sessionStorage:", i);
      }
    }
  }
  /**
   * Determines if the code is running in a browser environment
   * where DOM APIs like document, localStorage, etc. are available.
   *
   * @returns {boolean} True if running in a browser environment, false otherwise.
   */
  static isBrowserEnvironment() {
    return typeof window < "u" && typeof document < "u";
  }
};
p.instance = null;
p.ANONYMOUS_ID = "DfAnonymousId";
let b = p;
function x() {
  const s = document.getElementById("df-tracker");
  if (!s)
    return null;
  const e = s.getAttribute("data-write-key");
  return e ? {
    writeKey: e,
    host: s.getAttribute("data-host") ?? void 0
  } : null;
}
(async function() {
  const e = x();
  if (console.log("snippetEntry config", e), e) {
    const t = window._df;
    await b.init(e), Array.isArray(t) && t.forEach((n) => {
      if (Array.isArray(n) && n.length > 0) {
        const i = n[0];
        b[i].apply(b, n.slice(1));
      }
    }), window._df = b;
  }
})();
export {
  b as default
};
