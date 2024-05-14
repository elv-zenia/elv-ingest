import {RootStore} from "@/stores/index";

class UiStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
}

export default UiStore;
