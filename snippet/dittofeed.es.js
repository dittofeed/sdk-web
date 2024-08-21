var y = globalThis && globalThis.__awaiter || function(i, t, n, e) {
  function s(u) {
    return u instanceof n ? u : new n(function(a) {
      a(u);
    });
  }
  return new (n || (n = Promise))(function(u, a) {
    function h(o) {
      try {
        r(e.next(o));
      } catch (l) {
        a(l);
      }
    }
    function d(o) {
      try {
        r(e.throw(o));
      } catch (l) {
        a(l);
      }
    }
    function r(o) {
      o.done ? u(o.value) : s(o.value).then(h, d);
    }
    r((e = e.apply(i, t || [])).next());
  });
};
class T {
  constructor({
    batchSize: t,
    timeout: n,
    // default timeout is 500ms
    executeBatch: e,
    setTimeout: s,
    clearTimeout: u,
    baseDelay: a,
    retries: h
  }) {
    this.queue = [], this.batchSize = t, this.timeout = n, this.timeoutHandle = null, this.executeBatch = e, this.setTimeout = s, this.clearTimeout = u, this.pending = null, this.baseDelay = a ?? 500, this.retries = h ?? 5;
  }
  // Method to add a task to the queue
  submit(t) {
    this.queue.push(t), this.queue.length >= this.batchSize ? this.flush() : this.queue.length === 1 && this.startTimer();
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
        } catch (t) {
          throw t;
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
        const t = this.queue.slice(0, this.batchSize);
        this.queue = this.queue.slice(this.batchSize), yield this.executeBatchWithRetry(t);
      }
    });
  }
  executeBatchWithRetry(t) {
    return y(this, void 0, void 0, function* () {
      yield this.retryWithExponentialBackoff(() => y(this, void 0, void 0, function* () {
        yield this.executeBatch(t);
      }));
    });
  }
  retryWithExponentialBackoff(t) {
    return y(this, void 0, void 0, function* () {
      const n = Math.max(0, this.retries);
      for (let e = 0; e <= n; e++)
        try {
          return yield t();
        } catch (s) {
          if (e === n)
            throw s;
          const u = this.baseDelay * Math.pow(2, e);
          yield new Promise((a) => setTimeout(a, u));
        }
      throw new Error("This line should never be reached");
    });
  }
}
var b = globalThis && globalThis.__awaiter || function(i, t, n, e) {
  function s(u) {
    return u instanceof n ? u : new n(function(a) {
      a(u);
    });
  }
  return new (n || (n = Promise))(function(u, a) {
    function h(o) {
      try {
        r(e.next(o));
      } catch (l) {
        a(l);
      }
    }
    function d(o) {
      try {
        r(e.throw(o));
      } catch (l) {
        a(l);
      }
    }
    function r(o) {
      o.done ? u(o.value) : s(o.value).then(h, d);
    }
    r((e = e.apply(i, t || [])).next());
  });
}, f;
(function(i) {
  i.Identify = "identify", i.Track = "track", i.Page = "page", i.Screen = "screen";
})(f || (f = {}));
class S {
  constructor({ issueRequest: t, writeKey: n, host: e = "https://dittofeed.com", uuid: s, setTimeout: u, clearTimeout: a, baseDelay: h, retries: d }) {
    this.batchQueue = new T({
      timeout: 500,
      batchSize: 5,
      setTimeout: u,
      clearTimeout: a,
      baseDelay: h,
      retries: d,
      executeBatch: (r) => b(this, void 0, void 0, function* () {
        yield t({
          batch: r
        }, { writeKey: n, host: e });
      })
    }), this.uuid = s;
  }
  identify(t) {
    var n;
    const e = Object.assign({ messageId: (n = t.messageId) !== null && n !== void 0 ? n : this.uuid(), type: f.Identify }, t);
    this.batchQueue.submit(e);
  }
  track(t) {
    var n;
    const e = Object.assign({ messageId: (n = t.messageId) !== null && n !== void 0 ? n : this.uuid(), type: f.Track }, t);
    this.batchQueue.submit(e);
  }
  page(t) {
    var n;
    const e = Object.assign({ messageId: (n = t.messageId) !== null && n !== void 0 ? n : this.uuid(), type: f.Page }, t);
    this.batchQueue.submit(e);
  }
  screen(t) {
    var n;
    const e = Object.assign({ messageId: (n = t.messageId) !== null && n !== void 0 ? n : this.uuid(), type: f.Screen }, t);
    this.batchQueue.submit(e);
  }
  flush() {
    return b(this, void 0, void 0, function* () {
      yield this.batchQueue.flush();
    });
  }
}
let p;
const k = new Uint8Array(16);
function x() {
  if (!p && (p = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !p))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return p(k);
}
const c = [];
for (let i = 0; i < 256; ++i)
  c.push((i + 256).toString(16).slice(1));
function I(i, t = 0) {
  return (c[i[t + 0]] + c[i[t + 1]] + c[i[t + 2]] + c[i[t + 3]] + "-" + c[i[t + 4]] + c[i[t + 5]] + "-" + c[i[t + 6]] + c[i[t + 7]] + "-" + c[i[t + 8]] + c[i[t + 9]] + "-" + c[i[t + 10]] + c[i[t + 11]] + c[i[t + 12]] + c[i[t + 13]] + c[i[t + 14]] + c[i[t + 15]]).toLowerCase();
}
const _ = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), w = {
  randomUUID: _
};
function U(i, t, n) {
  if (w.randomUUID && !t && !i)
    return w.randomUUID();
  i = i || {};
  const e = i.random || (i.rng || x)();
  if (e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128, t) {
    n = n || 0;
    for (let s = 0; s < 16; ++s)
      t[n + s] = e[s];
    return t;
  }
  return I(e);
}
const v = class m {
  static async init(t) {
    if (!m.instance) {
      const n = new S({
        uuid: () => U(),
        issueRequest: async (e, { host: s = "https://dittofeed.com", writeKey: u }) => {
          const a = `${s}/api/public/apps/batch`, d = await fetch(a, {
            method: "POST",
            headers: {
              authorization: u,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(e)
          });
          if (!d.ok)
            throw new Error(`HTTP error! status: ${d.status}`);
        },
        setTimeout: (e, s) => window.setTimeout(e, s),
        clearTimeout: (e) => window.clearTimeout(e),
        ...t
      });
      m.instance = new m(n);
    }
    return m.instance;
  }
  constructor(t) {
    this.baseSdk = t;
  }
  /**
   * The Identify call lets you tie a user to their actions and record traits
   * about them. It includes a unique User ID and any optional traits you know
   * about the user, like their email, name, and more.
   * @param params
   * @returns
   */
  static identify(t) {
    if (this.instance)
      return this.instance.baseSdk.identify(t);
  }
  /**
   * The Track call is how you record any actions your users perform, along with
   * any properties that describe the action.
   * @param params
   * @returns
   */
  static track(t) {
    if (this.instance)
      return this.instance.baseSdk.track(t);
  }
  /**
   * The page call lets you record whenever a user sees a page of your website,
   * along with any optional properties about the page.
   * @param params
   * @returns
   */
  static page(t) {
    if (this.instance)
      return this.instance.baseSdk.page(t);
  }
  /**
   * The screen call lets you record whenever a user sees a screen, the mobile
   * equivalent of page, in your mobile app, along with any properties about the
   * screen
   * @param params
   * @returns
   */
  static screen(t) {
    if (this.instance)
      return this.instance.baseSdk.screen(t);
  }
  /**
   * Dittofeed events are submitted asynchronously. This method "flushes" the
   * remaining events synchronously to the API.
   * @returns
   */
  static flush() {
    if (this.instance)
      return this.instance.baseSdk.flush();
  }
};
v.instance = null;
let g = v;
function q() {
  const i = document.getElementById("df-tracker");
  if (!i)
    return null;
  const t = i.getAttribute("data-write-key");
  return t ? {
    writeKey: t,
    host: i.getAttribute("data-host") ?? void 0
  } : null;
}
(async function() {
  const t = q();
  if (t) {
    const n = window._df;
    await g.init(t), Array.isArray(n) && n.forEach((e) => {
      if (Array.isArray(e) && e.length > 0) {
        const s = e[0];
        g[s].apply(g, e.slice(1));
      }
    }), window._df = g;
  }
})();
export {
  g as default
};
