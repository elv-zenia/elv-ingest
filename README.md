# Eluvio IngestPanel

A web application for ingesting content onto the Eluvio fabric. This app runs with the Content Fabric Eluvio Core JS framework.

### Prerequisites

* Node.js version 16 or higher.
* NPM 8 or higher.
* ElvCore cloned, installed, and running. See the [documentation](https://github.com/eluv-io/elv-core-js) on getting started before proceeding.

NOTE: The pre-configured port of elv-studio is 9001. Make sure that elv-core-js configuration is pointing to the elv-studio server with the correct port.

Example elv-core-js configuration.js file.
```
const EluvioConfiguration = {
  "apps": {
    "Eluvio IngestPanel": "http://localhost:9001"
  }
};
```

### Installation and Initiation

Run the following to install module dependencies and run the server.
```
npm install
npm run serve
```
Access the app at [http://localhost:8082/#/apps/Eluvio%20Ingest](http://localhost:8082/#/apps/Eluvio%20Studio)
