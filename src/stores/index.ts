import {configure, makeAutoObservable, runInAction} from "mobx";
import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";
import StreamStore from "@/stores/StreamStore";
import UiStore from "@/stores/UiStore";
import IngestStore from "@/stores/IngestStore";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

export class RootStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
  loaded = false;
  streamStore!: StreamStore;
  ingestStore!: IngestStore;
  uiStore!: UiStore;
  tenantId = "";

  constructor() {
    makeAutoObservable(this);

    this.Initialize();

    runInAction(() => {
      this.streamStore = new StreamStore(this);
      this.ingestStore = new IngestStore(this);
      this.uiStore = new UiStore(this);
    });
  }

  Initialize = () => {
    try {
      this.client = new FrameClient({
        target: window.parent,
        timeout: 60
      });

      window.client = this.client;
    } catch(error) {
      console.error("Failed to initialize application");
      console.error(error);
    } finally {
      this.loaded = true;
    }
  };

  *LoadTenantData(): unknown {
    try {
      this.tenantId = yield this.client.userProfileClient.TenantContractId();

      if(!this.tenantId) {
        throw "Tenant ID not found";
      }
    } catch(error) {
      this.uiStore.SetErrorMessage({message: "Error: Unable to determine tenant info"});
      console.error(error);
      throw Error("No tenant contract ID found.");
    }
  }

  Decode({text}: {text: string}) {
    if(!text || typeof(text) !== "string") {
      throw Error("Invalid value provided. Must be a string.");
    }

    return this.client.utils.FromB64(text);
  }
}

export const rootStore = new RootStore();
export const streamStore = rootStore.streamStore;
export const ingestStore = rootStore.ingestStore;
export const uiStore = rootStore.uiStore;

window.rootStore = rootStore;
