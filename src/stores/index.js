import {configure, makeAutoObservable} from "mobx";
import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";
import DataStore from "@/stores/DataStore.js";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

class RootStore {
  client;
  loaded = false;

  constructor() {
    makeAutoObservable(this);

    this.Initialize();
    this.dataStore = new DataStore(this);
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

  Decode({string}) {
    if(!string || typeof(string) !== "string") {
      throw Error("Invalid value provided. Must be a string.");
    }

    return this.client.utils.FromB64(string);
  }
}

export const rootStore = new RootStore();
export const dataStore = rootStore.dataStore;

window.rootStore = rootStore;
