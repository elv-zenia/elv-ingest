import {RootStore} from "@/stores/index";
import {makeAutoObservable} from "mobx";
import {IngestJobProps} from "components/stream";

class IngestStore {
  rootStore: RootStore;
  siteId = "";
  jobs: IngestJobProps | null = {};

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  get client() {
    return this.rootStore.client;
  }

  *LoadSiteData(): unknown {
    if(!this.rootStore.tenantId) { yield this.rootStore.LoadTenantData(); }

    const response = yield this.client.ContentObjectMetadata({
      libraryId: this.rootStore.tenantId.replace("iten", "ilib"),
      objectId: this.rootStore.tenantId.replace("iten", "iq__"),
      metadataSubtree: "public",
      select: [
        "sites/ingest",
        "content_types/title"
      ]
    });

    this.siteId = response?.sites?.ingest;
  }

  LoadIngestJobs(): void {
    const localStorageJobs = localStorage.getItem("elv-jobs");
    if(localStorageJobs) {
      const parsedJobs = JSON.parse(
        this.rootStore.Decode({text: localStorageJobs})
      );

      this.UpdateIngestJobs({jobs: parsedJobs});
    } else {
      this.UpdateIngestJobs({jobs: {}});
    }
  }

  UpdateIngestJobs({jobs}: {jobs: IngestJobProps | null}) {
    this.jobs = jobs;
  }
}

export default IngestStore;
