import {
  DittofeedSdkBase,
  IdentifyData,
  InitParamsDataBase,
  TrackData,
  ScreenData,
  PageData,
} from "@dittofeed/sdk-js-base";
import { v4 as uuidv4 } from "uuid";

export * from "@dittofeed/sdk-js-base";

export type TimeoutHandle = ReturnType<typeof setTimeout>;

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

  static async init(initParams: InitParamsDataBase): Promise<DittofeedSdk> {
    if (!DittofeedSdk.instance) {
      const baseSdk = new DittofeedSdkBase({
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
      DittofeedSdk.instance = new DittofeedSdk(baseSdk);
    }
    return DittofeedSdk.instance;
  }

  constructor(baseSdk: DittofeedSdkBase<TimeoutHandle>) {
    this.baseSdk = baseSdk;
  }

  /**
   * The Identify call lets you tie a user to their actions and record traits
   * about them. It includes a unique User ID and any optional traits you know
   * about the user, like their email, name, and more.
   * @param params
   * @returns
   */
  public static identify(params: IdentifyData) {
    if (!this.instance) {
      return;
    }
    return this.instance.baseSdk.identify(params);
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
    return this.instance.baseSdk.track(params);
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
    return this.instance.baseSdk.page(params);
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
    return this.instance.baseSdk.screen(params);
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
    return this.instance.baseSdk.flush();
  }
}
