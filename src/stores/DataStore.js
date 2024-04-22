import {flow} from "mobx";

// Stores main app data
class DataStore {
  tenantId;
  siteId;
  contentTypes = {};
  siteObjects = {};
  jobs;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  get client() {
    return this.rootStore.client;
  }

  LoadTenantData = flow(function * () {
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
        .forEach(({key, value}) => this.contentTypes[key] = value);

      // Store site object IDs
      [{key: "liveStream", value: sites?.live_streams}, {key: "ingest", value: sites?.ingest}]
        .forEach(({key, value}) => this.siteObjects[key] = value);
    } catch(error) {
      // this.rootStore.SetErrorMessage("Error: Unable to load tenant sites");
      console.error(error);
      throw Error("Unable to load sites for current tenant.");
    }
  });

  LoadSiteData = flow(function * () {
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
  });

  LoadJobs() {
    const localStorageJobs = localStorage.getItem("elv-jobs");
    if(localStorageJobs) {
      const parsedJobs = JSON.parse(
        this.rootStore.Decode({string: localStorageJobs})
      );

      this.UpdateJobs({jobs: parsedJobs});
    } else {
      this.UpdateJobs({jobs: {}});
    }
  }

  UpdateJobs({jobs}) {
    this.jobs = jobs;
  }
}

export default DataStore;
