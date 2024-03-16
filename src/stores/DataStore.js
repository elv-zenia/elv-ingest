// Loading ingest job data
class DataStore {
  jobs;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  get client() {
    return this.rootStore.client;
  }

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
