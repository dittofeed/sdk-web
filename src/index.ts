import { DittofeedSdkBase, InitParamsBase } from "@dittofeed/sdk-js-base";
import { v4 as uuidv4 } from "uuid";

export * from "@dittofeed/sdk-js-base";

export type TimeoutHandle = ReturnType<typeof setTimeout>;

export class DittofeedSdk {
  private static instance: DittofeedSdk;
  private baseSdk: DittofeedSdkBase<TimeoutHandle>;

  static async init(initParams: InitParamsBase): Promise<DittofeedSdk> {
    const baseSdk = new DittofeedSdkBase({
      uuid: () => uuidv4(),
      issueRequest: async (data, params) => {
        return;
      },
      setTimeout,
      clearTimeout,
      ...initParams,
    });

    if (!DittofeedSdk.instance) {
      DittofeedSdk.instance = new DittofeedSdk(baseSdk);
    }
    return DittofeedSdk.instance;
  }

  constructor(baseSdk: DittofeedSdkBase<TimeoutHandle>) {
    this.baseSdk = baseSdk;
  }
}
