var S = globalThis && globalThis.__awaiter || function(e, t, n, i) {
  function s(u) {
    return u instanceof n ? u : new n(function(o) {
      o(u);
    });
  }
  return new (n || (n = Promise))(function(u, o) {
    function l(c) {
      try {
        r(i.next(c));
      } catch (h) {
        o(h);
      }
    }
    function d(c) {
      try {
        r(i.throw(c));
      } catch (h) {
        o(h);
      }
    }
    function r(c) {
      c.done ? u(c.value) : s(c.value).then(l, d);
    }
    r((i = i.apply(e, t || [])).next());
  });
};
class T {
  constructor({
    batchSize: t,
    timeout: n,
    // default timeout is 500ms
    executeBatch: i,
    setTimeout: s,
    clearTimeout: u
  }) {
    this.queue = [], this.batchSize = t, this.timeout = n, this.timeoutHandle = null, this.executeBatch = i, this.setTimeout = s, this.clearTimeout = u;
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
    return S(this, void 0, void 0, function* () {
      if (this.clearTimer(), this.queue.length === 0)
        return;
      const t = this.queue.slice(0, this.batchSize);
      this.queue = this.queue.slice(this.batchSize), yield this.executeBatch(t);
    });
  }
}
var g = globalThis && globalThis.__awaiter || function(e, t, n, i) {
  function s(u) {
    return u instanceof n ? u : new n(function(o) {
      o(u);
    });
  }
  return new (n || (n = Promise))(function(u, o) {
    function l(c) {
      try {
        r(i.next(c));
      } catch (h) {
        o(h);
      }
    }
    function d(c) {
      try {
        r(i.throw(c));
      } catch (h) {
        o(h);
      }
    }
    function r(c) {
      c.done ? u(c.value) : s(c.value).then(l, d);
    }
    r((i = i.apply(e, t || [])).next());
  });
}, m;
(function(e) {
  e.Identify = "identify", e.Track = "track", e.Page = "page", e.Screen = "screen";
})(m || (m = {}));
class k {
  constructor({ issueRequest: t, writeKey: n, host: i = "https://dittofeed.com", uuid: s, setTimeout: u, clearTimeout: o }) {
    this.batchQueue = new T({
      timeout: 500,
      batchSize: 5,
      setTimeout: u,
      clearTimeout: o,
      executeBatch: (l) => g(this, void 0, void 0, function* () {
        yield t({
          batch: l
        }, { writeKey: n, host: i });
      })
    }), this.uuid = s;
  }
  identify(t) {
    var n;
    const i = Object.assign({ messageId: (n = t.messageId) !== null && n !== void 0 ? n : this.uuid(), type: m.Identify }, t);
    this.batchQueue.submit(i);
  }
  track(t) {
    var n;
    const i = Object.assign({ messageId: (n = t.messageId) !== null && n !== void 0 ? n : this.uuid(), type: m.Track }, t);
    this.batchQueue.submit(i);
  }
  page(t) {
    var n;
    const i = Object.assign({ messageId: (n = t.messageId) !== null && n !== void 0 ? n : this.uuid(), type: m.Page }, t);
    this.batchQueue.submit(i);
  }
  screen(t) {
    var n;
    const i = Object.assign({ messageId: (n = t.messageId) !== null && n !== void 0 ? n : this.uuid(), type: m.Screen }, t);
    this.batchQueue.submit(i);
  }
  flush() {
    return g(this, void 0, void 0, function* () {
      yield this.batchQueue.flush();
    });
  }
}
let y;
const v = new Uint8Array(16);
function I() {
  if (!y && (y = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !y))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return y(v);
}
const a = [];
for (let e = 0; e < 256; ++e)
  a.push((e + 256).toString(16).slice(1));
function x(e, t = 0) {
  return (a[e[t + 0]] + a[e[t + 1]] + a[e[t + 2]] + a[e[t + 3]] + "-" + a[e[t + 4]] + a[e[t + 5]] + "-" + a[e[t + 6]] + a[e[t + 7]] + "-" + a[e[t + 8]] + a[e[t + 9]] + "-" + a[e[t + 10]] + a[e[t + 11]] + a[e[t + 12]] + a[e[t + 13]] + a[e[t + 14]] + a[e[t + 15]]).toLowerCase();
}
const _ = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), p = {
  randomUUID: _
};
function U(e, t, n) {
  if (p.randomUUID && !t && !e)
    return p.randomUUID();
  e = e || {};
  const i = e.random || (e.rng || I)();
  if (i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, t) {
    n = n || 0;
    for (let s = 0; s < 16; ++s)
      t[n + s] = i[s];
    return t;
  }
  return x(i);
}
const w = class f {
  static async init(t) {
    if (!f.instance) {
      const n = new k({
        uuid: () => U(),
        issueRequest: async (i, { host: s = "https://dittofeed.com", writeKey: u }) => {
          const o = `${s}/api/public/apps/batch`, d = await fetch(o, {
            method: "POST",
            headers: {
              authorization: u,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(i)
          });
          if (!d.ok)
            throw new Error(`HTTP error! status: ${d.status}`);
        },
        setTimeout: (i, s) => window.setTimeout(i, s),
        clearTimeout: (i) => window.clearTimeout(i),
        ...t
      });
      f.instance = new f(n);
    }
    return f.instance;
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
w.instance = null;
let b = w;
function q() {
  const e = document.getElementById("df-tracker");
  if (!e)
    return null;
  const t = e.getAttribute("data-write-key");
  return t ? {
    writeKey: t,
    host: e.getAttribute("data-host") ?? void 0
  } : null;
}
(async function() {
  const t = q();
  if (t) {
    const n = window_.df;
    await b.init(t), Array.isArray(n) && n.forEach((i) => {
      if (Array.isArray(i) && i.length > 0) {
        const s = i[0];
        b[s].apply(b, i.slice(1));
      }
    }), window._df = b;
  }
})();
export {
  b as default
};
