// Extend or declare global variables, objects, or properties

import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";

declare global {
  interface Window {
    client: FrameClient;
    rootStore: RootStore;
  }
}

export {};
