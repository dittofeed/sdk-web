import {
  DittofeedSdkBase,
  IdentifyData,
  InitParamsDataBase,
  TrackData,
  ScreenData,
  PageData,
  BaseIdentifyData,
  AnonymousIdentifyData,
} from "@dittofeed/sdk-js-base";
import { v4 as uuidv4 } from "uuid";

export * from "@dittofeed/sdk-js-base";

export type Logger = {
  log: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
};

export type TimeoutHandle = ReturnType<typeof setTimeout>;

export interface InitParamsData extends InitParamsDataBase {
  logger?: Logger;
}

/**
 * Dittofeed web SDK, used to send events to Dittofeed from the browser, an open source
 * customer engagement platform.
 *
 * @class
 * @example
 * import { DittofeedSdk } from '@dittofeed/sdk-web';
 *
 * // Initialize the sdk with a writeKey, which is used to identify your
 * // workspace. This key can be found at
 * // https://dittofeed.com/dashboard/settings
 * await DittofeedSdk.init({
 *   writeKey: "Basic abcdefg...",
 * });
 *
 * // Lets you tie a user to their actions and record traits about them. It
 * // includes a unique User ID and any optional traits you know about the
 * // user, like their email, name, and more.
 * DittofeedSdk.identify({
 *   userId: "123",
 *   traits: {
 *     email: "john@email.com",
 *     firstName: "John"
 *   },
 * });
 *
 * // The track call is how you record any actions your users perform, along
 * // with any properties that describe the action.
 * DittofeedSdk.track({
 *   userId: "123",
 *   event: "Made Purchase",
 *   properties: {
 *     itemId: "abc",
 *   },
 * });
 *
 * // Lets you record whenever a user sees a screen, the mobile equivalent of
 * // page, in your mobile app, along with any properties about the screen.
 * DittofeedSdk.screen({
 *   userId: "123",
 *   name: "Recipe Screen",
 *   properties: {
 *     recipeType: "Soup",
 *   },
 * });
 *
 * // Ensures that asynchronously submitted events are flushed synchronously
 * // to Dittofeed's API.
 * await DittofeedSdk.flush();
 */
export class DittofeedSdk {
  private static instance: DittofeedSdk | null = null;
  private baseSdk: DittofeedSdkBase<TimeoutHandle>;
  private anonymousId: string | null = null;
  private logger: Logger | null = null;

  // Storage key constants
  private static readonly ANONYMOUS_ID = "DfAnonymousId";

  private static createBaseSdk(
    initParams: InitParamsDataBase
  ): DittofeedSdkBase<TimeoutHandle> {
    return new DittofeedSdkBase({
      uuid: () => uuidv4(),
      issueRequest: async (
        data,
        { host = "https://dittofeed.com", writeKey }
      ) => {
        const url = `${host}/api/public/apps/batch`;
        const headers = {
          authorization: writeKey,
          "Content-Type": "application/json",
        };

        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      },
      setTimeout: (callback, timeout) => window.setTimeout(callback, timeout),
      clearTimeout: (timeoutHandle) => window.clearTimeout(timeoutHandle),
      ...initParams,
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
  static async init(initParams: InitParamsData): Promise<DittofeedSdk> {
    if (!DittofeedSdk.instance) {
      const baseSdk = this.createBaseSdk(initParams);
      DittofeedSdk.instance = new DittofeedSdk(baseSdk, initParams.logger);
    }
    return DittofeedSdk.instance;
  }

  /**
   * Initializes a new instance of the Dittofeed SDK with the provided initialization parameters.
   * Unlike the `init` method, this method always creates a new instance of the SDK, regardless
   * of whether an instance already exists.
   *
   * @param initParams - The initialization parameters required to set up the SDK.
   * @returns A promise that resolves to the newly initialized Dittofeed SDK instance.
   */
  static async initNew(initParams: InitParamsData): Promise<DittofeedSdk> {
    const baseSdk = this.createBaseSdk(initParams);
    return new DittofeedSdk(baseSdk, initParams.logger);
  }

  constructor(baseSdk: DittofeedSdkBase<TimeoutHandle>, logger?: Logger) {
    this.baseSdk = baseSdk;
    this.logger = logger ?? null;
  }

  /**
   * The Identify call lets you tie a user to their actions and record traits
   * about them. It includes a unique User ID and any optional traits you know
   * about the user, like their email, name, and more.
   * @param params
   * @returns
   */
  public static identify(params: IdentifyData | BaseIdentifyData) {
    if (!this.instance) {
      return;
    }

    return this.instance.identify(params);
  }

  public identify(params: IdentifyData | BaseIdentifyData) {
    let data: IdentifyData;
    if (!("userId" in params) && !("anonymousId" in params)) {
      const anonymousData: AnonymousIdentifyData = {
        ...params,
        anonymousId: this.getAnonymousId(),
      };
      data = anonymousData;
    } else {
      data = params;
    }
    return this.baseSdk.identify(data);
  }

  /**
   * The Track call is how you record any actions your users perform, along with
   * any properties that describe the action.
   * @param params
   * @returns
   */
  public static track(params: TrackData) {
    if (!this.instance) {
      return;
    }
    return this.instance.track(params);
  }

  public track(params: TrackData) {
    return this.baseSdk.track(params);
  }

  /**
   * The page call lets you record whenever a user sees a page of your website,
   * along with any optional properties about the page.
   * @param params
   * @returns
   */
  public static page(params: PageData) {
    if (!this.instance) {
      return;
    }
    return this.instance.page(params);
  }

  public page(params: PageData) {
    return this.baseSdk.page(params);
  }

  /**
   * The screen call lets you record whenever a user sees a screen, the mobile
   * equivalent of page, in your mobile app, along with any properties about the
   * screen
   * @param params
   * @returns
   */
  public static screen(params: ScreenData) {
    if (!this.instance) {
      return;
    }
    return this.instance.screen(params);
  }

  public screen(params: ScreenData) {
    return this.baseSdk.screen(params);
  }

  /**
   * Dittofeed events are submitted asynchronously. This method "flushes" the
   * remaining events synchronously to the API.
   * @returns
   */
  public static flush() {
    if (!this.instance) {
      return;
    }
    return this.instance.flush();
  }

  public flush() {
    return this.baseSdk.flush();
  }

  public static getAnonymousId(): string {
    if (!this.instance) {
      throw new Error("DittofeedSdk not initialized");
    }
    return this.instance.getAnonymousId();
  }

  /**
   * Initializes the anonymous ID if it is not already set and returns it.
   * @returns The anonymous ID.
   */
  public getAnonymousId(): string {
    if (!this.anonymousId) {
      const storedAnonymousId = this.retrieveStoredAnonymousId();
      let anonymousId: string;
      if (storedAnonymousId) {
        anonymousId = storedAnonymousId;
      } else {
        anonymousId = uuidv4();
        this.storeAnonymousId(anonymousId);
      }
      this.anonymousId = anonymousId;
    }
    return this.anonymousId;
  }

  /**
   * Resets the anonymous ID and returns the new one.
   * @returns The new anonymous ID.
   */
  public resetAnonymousId(): string {
    if (!this.anonymousId) {
      return this.getAnonymousId();
    }
    this.deleteAnonymousId();
    return this.getAnonymousId();
  }

  /**
   * Retrieves the anonymous ID from the storage.
   * It uses the following priority:
   * cookies → localStorage → sessionStorage
   * Cookies expire after 2 years.
   * @returns The anonymous ID or null if it is not stored.
   */
  private retrieveStoredAnonymousId(): string | null {
    // Early return if not in browser environment
    if (!DittofeedSdk.isBrowserEnvironment()) {
      return null;
    }

    // Try to get from cookie first
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const parts = cookie.trim().split("=");
      if (
        parts.length >= 2 &&
        parts[0] === DittofeedSdk.ANONYMOUS_ID &&
        parts[1] !== undefined
      ) {
        return decodeURIComponent(parts[1]);
      }
    }

    // Try localStorage second
    try {
      const localStorageValue = localStorage.getItem(DittofeedSdk.ANONYMOUS_ID);
      if (localStorageValue) {
        return localStorageValue;
      }
    } catch (error) {
      // localStorage might be disabled or unavailable
      this.logger?.warn("Failed to access localStorage:", error);
    }

    // Try sessionStorage last
    try {
      const sessionStorageValue = sessionStorage.getItem(
        DittofeedSdk.ANONYMOUS_ID
      );
      if (sessionStorageValue) {
        return sessionStorageValue;
      }
    } catch (error) {
      // sessionStorage might be disabled or unavailable
      this.logger?.warn("Failed to access sessionStorage:", error);
    }

    return null;
  }

  /**
   * Stores the anonymous ID.
   * @param anonymousId - The anonymous ID to store.
   */
  private storeAnonymousId(anonymousId: string) {
    // Early return if not in browser environment
    if (!DittofeedSdk.isBrowserEnvironment()) {
      return;
    }

    // Store in cookie with 2-year expiration
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    const encodedAnonymousId = encodeURIComponent(anonymousId);
    const cookieValue = `${
      DittofeedSdk.ANONYMOUS_ID
    }=${encodedAnonymousId};expires=${twoYearsFromNow.toUTCString()};path=/;SameSite=Lax`;

    try {
      document.cookie = cookieValue;
    } catch (error) {
      this.logger?.warn("Failed to set cookie:", error);
    }

    // Store in localStorage as fallback
    try {
      localStorage.setItem(DittofeedSdk.ANONYMOUS_ID, anonymousId);
    } catch (error) {
      this.logger?.warn("Failed to access localStorage:", error);
    }

    // Store in sessionStorage as another fallback
    try {
      sessionStorage.setItem(DittofeedSdk.ANONYMOUS_ID, anonymousId);
    } catch (error) {
      this.logger?.warn("Failed to access sessionStorage:", error);
    }
  }

  private deleteAnonymousId() {
    this.anonymousId = null;

    // Early return if not in browser environment
    if (!DittofeedSdk.isBrowserEnvironment()) {
      return;
    }

    // Delete from cookie
    try {
      document.cookie = `${DittofeedSdk.ANONYMOUS_ID}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
    } catch (error) {
      this.logger?.warn("Failed to delete cookie:", error);
    }

    // Delete from localStorage
    try {
      localStorage.removeItem(DittofeedSdk.ANONYMOUS_ID);
    } catch (error) {
      this.logger?.warn("Failed to access localStorage:", error);
    }

    // Delete from sessionStorage
    try {
      sessionStorage.removeItem(DittofeedSdk.ANONYMOUS_ID);
    } catch (error) {
      this.logger?.warn("Failed to access sessionStorage:", error);
    }
  }

  /**
   * Determines if the code is running in a browser environment
   * where DOM APIs like document, localStorage, etc. are available.
   *
   * @returns {boolean} True if running in a browser environment, false otherwise.
   */
  private static isBrowserEnvironment(): boolean {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }
}
