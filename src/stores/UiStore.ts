import {RootStore} from "@/stores/index";
import {makeAutoObservable} from "mobx";

class UiStore {
  rootStore: RootStore;
  errorMessage?: string;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  SetErrorMessage = ({message}: {message: string | undefined}) => {
    this.errorMessage = message;
    console.log("Message", this.errorMessage);
  };
}

export default UiStore;
