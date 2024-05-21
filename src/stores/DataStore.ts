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

  *LoadAllStreamData(): unknown {
    let streamMetadata: StreamMapProps;
    try {
      const siteMetadata = yield this.client.ContentObjectMetadata({
        libraryId: yield this.client.ContentObjectLibraryId({objectId: this.siteId}),
        objectId: this.siteId,
        select: [
          "public/asset_metadata/live_streams"
        ],
        resolveLinks: true,
        resolveIgnoreErrors: true,
        resolveIncludeSource: true
      });

      streamMetadata = siteMetadata?.public?.asset_metadata?.live_streams;
    } catch(error) {
      throw Error(`Unable to load live streams for site ${this.siteId}.`);
    }

    yield this.client.utils.LimitedMap(
      10,
      Object.keys(streamMetadata),
      async (slug: string) => {
        const stream = streamMetadata[slug];

        const versionHash = stream?.["."]?.source;

        if(versionHash) {
          const objectId = this.client.utils.DecodeVersionHash(versionHash).objectId;
          const libraryId = await this.client.ContentObjectLibraryId({objectId});

          const streamDetails = await this.LoadStreamMetadata({
            objectId,
            libraryId
          }) || {};

          streamMetadata[slug] = {
            ...streamMetadata[slug],
            ...streamDetails
          };

          streamMetadata[slug].slug = slug;
          streamMetadata[slug].objectId = objectId;
          streamMetadata[slug].versionHash = versionHash;
          streamMetadata[slug].libraryId = libraryId;
          streamMetadata[slug].title = stream.display_title || stream.title;
          streamMetadata[slug].embedUrl = await this.client.EmbedUrl({objectId, mediaType: "live_video"});
        } else {
          console.error(`No version hash for ${slug}`);
        }
      }
    );
  }


  *LoadStreamMetadata({objectId, libraryId}: {objectId: string, libraryId: string}): Generator<StreamProps> | Promise<StreamProps> {
    try {
      if(!libraryId) {
        libraryId = (yield this.client.ContentObjectLibraryId({objectId})) as string;
      }

      type ProbeMetaProps = {
        format: {
          filename: string;
        },
        streams: {
          codec_type: "video" | "audio";
          bit_rate: number;
          codec_name: string;
        }[]
      };

      type StreamMetadataProps = {
        live_recording: {
          recording_config: {
            recording_params: {
              origin_url: string;
              simple_watermark: string;
              image_watermark: string;
            }
          }
        },
        live_recording_config: {
          probe_info: ProbeMetaProps,
          reference_url: string;
          url: string;
          drm_type: string;
        }
      }

      const streamMeta = (yield this.client.ContentObjectMetadata({
        objectId,
        libraryId,
        select: [
          "live_recording_config/probe_info/format/filename",
          "live_recording_config/probe_info/streams",
          "live_recording/recording_config/recording_params/origin_url",
          "live_recording/recording_config/recording_params/simple_watermark",
          "live_recording/recording_config/recording_params/image_watermark",
          "live_recording_config/reference_url",
          "live_recording_config/url",
          "live_recording_config/drm_type"
        ]
      })) as StreamMetadataProps;
      let probeMeta = streamMeta?.live_recording_config?.probe_info;

      // Phase out as new streams will have live_recording_config/probe_info
      if(!probeMeta) {
        probeMeta = (yield this.client.ContentObjectMetadata({
          objectId,
          libraryId,
          metadataSubtree: "/live_recording/probe_info",
          select: [
            "format/filename",
            "streams"
          ]
        })) as ProbeMetaProps;
      }

      let probeType = (probeMeta?.format?.filename)?.split("://")[0];
      if(probeType === "srt" && !probeMeta.format?.filename?.includes("listener")) {
        probeType = "srt-caller";
      }

      const videoStream = (probeMeta?.streams || []).find(stream => stream.codec_type === "video");
      const audioStreamCount = probeMeta?.streams ? (probeMeta?.streams || []).filter(stream => stream.codec_type === "audio").length : undefined;

      return {
        originUrl: streamMeta?.live_recording?.recording_config?.recording_params?.origin_url || streamMeta?.live_recording_config?.url,
        format: probeType,
        videoBitrate: videoStream?.bit_rate,
        codecName: videoStream?.codec_name,
        audioStreamCount,
        referenceUrl: streamMeta?.live_recording_config?.reference_url,
        drm: streamMeta?.live_recording_config?.drm_type,
        simpleWatermark: streamMeta?.live_recording?.recording_config?.recording_params?.simple_watermark,
        imageWatermark: streamMeta?.live_recording?.recording_config?.recording_params?.image_watermark
      };
    } catch(error) {
      console.error("Unable to load stream metadata", error);
    }
  }

  LoadJobs(): void {
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
