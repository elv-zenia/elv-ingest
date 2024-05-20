import {makeAutoObservable, runInAction} from "mobx";
import {RootStore} from "@/stores/index";

interface ContentProps {
  title: string;
  liveStream: string;
  titleMaster: string;
}

interface SiteObjectProps {
  liveStream: string;
  ingest: string;
}

// Stores main app constants
class DataStore {
  rootStore!: RootStore;
  tenantId = "";
  siteId = "";
  contentTypes: ContentProps | Record<string,never> = {};
  siteObjects: SiteObjectProps | Record<string,never> = {};
  jobs: JobsProps | null = {};

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    runInAction(() => {
      this.rootStore = rootStore;
    });
  }

  get client() {
    return this.rootStore.client;
  }

  *LoadTenantData(): unknown {
    try {
      this.tenantId = yield this.client.userProfileClient.TenantContractId();

      const response = yield this.client.ContentObjectMetadata({
        libraryId: this.tenantId.replace("iten", "ilib"),
        objectId: this.tenantId.replace("iten", "iq__"),
        metadataSubtree: "public",
        select: [
          "sites/live_streams",
          "sites/ingest",
          "content_types/live_stream",
          "content_types/title",
          "content_types/title_master"
        ]
      });

      const {sites, content_types} = response;

      // Store content types
      [{key: "liveStream", value: content_types?.live_stream}, {key: "title", value: content_types?.title}, {key: "titleMaster", value: content_types?.title_master}]
        .forEach(({key, value}) => this.contentTypes[key as keyof ContentProps] = value);

      // Store site object IDs
      [{key: "liveStream", value: sites?.live_streams}, {key: "ingest", value: sites?.ingest}]
        .forEach(({key, value}) => this.siteObjects[key as keyof SiteObjectProps] = value);
    } catch(error) {
      // this.rootStore.SetErrorMessage("Error: Unable to load tenant sites");
      console.error(error);
      throw Error("Unable to load sites for current tenant.");
    }
  }

  *LoadSiteData(): unknown {
    const response = yield this.client.ContentObjectMetadata({
      libraryId: this.tenantId.replace("iten", "ilib"),
      objectId: this.tenantId.replace("iten", "iq__"),
      metadataSubtree: "public",
      select: [
        "sites/live_streams",
        "content_types/live_stream",
        "content_types/title"
      ]
    });
    this.siteId = response?.sites?.live_streams;
  }

  LoadJobs() {
    const localStorageJobs = localStorage.getItem("elv-jobs");
    if(localStorageJobs) {
      const parsedJobs = JSON.parse(
        this.rootStore.Decode({text: localStorageJobs})
      );

      this.UpdateJobs({jobs: parsedJobs});
    } else {
      this.UpdateJobs({jobs: {}});
    }
  }

  UpdateJobs({jobs}: {jobs: JobsProps | null}) {
    this.jobs = jobs;
  }
}

export default DataStore;
