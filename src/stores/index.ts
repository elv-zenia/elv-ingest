import {configure, makeAutoObservable} from "mobx";
import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";
import DataStore from "@/stores/DataStore";
import UiStore from "@/stores/UiStore";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

export class RootStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
  loaded = false;
  dataStore: DataStore;
  uiStore: UiStore;

  constructor() {
    makeAutoObservable(this);

    this.Initialize();
    this.dataStore = new DataStore(this);
    this.uiStore = new UiStore(this);
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

  Decode({text}: {text: string}) {
    if(!text || typeof(text) !== "string") {
      throw Error("Invalid value provided. Must be a string.");
    }

    return this.client.utils.FromB64(text);
  }
}

export const rootStore = new RootStore();
export const dataStore = rootStore.dataStore;
export const uiStore = rootStore.uiStore;

window.rootStore = rootStore;
