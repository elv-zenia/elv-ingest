import {makeAutoObservable, runInAction} from "mobx";
import {RootStore} from "@/stores/index";
import {
  AudioFormData,
  AudioStreamCustomSettingsPayload,
  // AudioStreamMap,
  AudioStream,
  LiveRecording,
  LiveRecordingCopies,
  ProbeInfo,
  Status,
  StreamMap,
  Stream,
  LiveRecordingConfig,
  // LiveRecordingConfigAudioStream
} from "components/stream";
import {ENCRYPTION_OPTIONS, RECORDING_BITRATE_OPTIONS} from "@/utils/constants";
import {CreateLink} from "@/utils/helpers";

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
class StreamStore {
  rootStore!: RootStore;
  tenantId = "";
  siteId = "";
  siteLibraryId = "";
  contentTypes: ContentProps | Record<string,never> = {};
  siteObjects: SiteObjectProps | Record<string,never> = {};
  streams: StreamMap = {};
  loadingStatus = false;
  streamSlugIdMap: {[key: string]: string} = {};

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    runInAction(() => {
      this.rootStore = rootStore;
    });
  }

  get client() {
    return this.rootStore.client;
  }

  StreamIdToSlug({objectId}: {objectId: string}): string {
    if(!Object.hasOwn(this.streamSlugIdMap, objectId)) {
      const slug = Object.keys(this.streams || {}).find(streamSlug => (
        this.streams[streamSlug].objectId === objectId
      ));

      if(slug) {
        this.streamSlugIdMap[objectId] = slug;
      } else {
        console.error(`Unable to find slug for ${objectId}`);
        return "";
      }
    }

    return this.streamSlugIdMap[objectId];
  }

  // *LoadSiteData(): unknown {
  //   // try {
  //   //   this.tenantId = yield this.client.userProfileClient.TenantContractId();
  //   //
  //   //   if(!this.tenantId) {
  //   //     throw "Tenant ID not found";
  //   //   }
  //   // } catch(error) {
  //   //   this.rootStore.uiStore.SetErrorMessage({message: "Error: Unable to determine tenant info"});
  //   //   console.error(error);
  //   //   throw Error("No tenant contract ID found.");
  //   // }
  //
  //   try {
  //     const response = yield this.client.ContentObjectMetadata({
  //       libraryId: this.tenantId.replace("iten", "ilib"),
  //       objectId: this.tenantId.replace("iten", "iq__"),
  //       metadataSubtree: "public",
  //       select: [
  //         "sites/live_streams",
  //         "sites/ingest",
  //         "content_types/live_stream",
  //         "content_types/title",
  //         "content_types/title_master"
  //       ]
  //     });
  //
  //     const {sites, content_types} = response;
  //
  //     // Store content types
  //     [{key: "liveStream", value: content_types?.live_stream}, {key: "title", value: content_types?.title}, {key: "titleMaster", value: content_types?.title_master}]
  //       .forEach(({key, value}) => this.contentTypes[key as keyof ContentProps] = value);
  //
  //     // Store site object IDs
  //     [{key: "liveStream", value: sites?.live_streams}, {key: "ingest", value: sites?.ingest}]
  //       .forEach(({key, value}) => this.siteObjects[key as keyof SiteObjectProps] = value);
  //   } catch(error) {
  //     this.rootStore.uiStore.SetErrorMessage({message: "Error: Unable to load tenant sites"});
  //     console.error(error);
  //     throw Error("Unable to load sites for current tenant.");
  //   }
  // }

  *LoadSiteData(): unknown {
    if(!this.rootStore.tenantId) { yield this.rootStore.LoadTenantData(); }

    const response = yield this.client.ContentObjectMetadata({
      libraryId: this.rootStore.tenantId.replace("iten", "ilib"),
      objectId: this.rootStore.tenantId.replace("iten", "iq__"),
      metadataSubtree: "public",
      select: [
        "sites/live_streams",
        "content_types/live_stream",
        "content_types/title"
      ]
    });

    this.siteId = response?.sites?.live_streams;

    if(!this.siteLibraryId) {
      this.siteLibraryId = yield this.client.ContentObjectLibraryId({objectId: this.siteId});
    }
  }

  *LoadAllStreamData(): unknown {
    let streamMetadata: StreamMap;
    try {
      if(!this.siteId) { yield this.LoadSiteData(); }

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
      this.rootStore.uiStore.SetErrorMessage({message: "Error: Unable to load tenant sites"});
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

          const streamDetails = await this.LoadStreamData({
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

    this.UpdateStreams({streams: streamMetadata});
  }

  *LoadAllStreamStatus(): unknown {
    if(this.loadingStatus) { return; }

    try {
      this.loadingStatus = true;

      yield this.client.utils.LimitedMap(
        15,
        Object.keys(this.streams || {}),
        async (slug: string) => {
          try {
            const streamMeta = this.streams?.[slug];
            await this.LoadStreamStatus({
              objectId: streamMeta.objectId as string,
              slug,
              update: true
            });
          } catch(error) {
            console.error(`Skipping status for ${this.streams?.[slug].objectId || slug}.`, error);
          }
        }
      );
    } catch(error) {
      console.error(error);
    } finally {
      this.loadingStatus = false;
    }
  }

  *LoadStreamStatus({
    objectId,
    slug,
    stopLro=false,
    showParams=false,
    update=false
  }: {objectId: string, slug?: string, stopLro?: boolean, showParams?: boolean, update?: boolean}): Promise<Status> | Generator<Status> {
    try {
      const response = (yield this.client.StreamStatus({
        name: objectId,
        stopLro,
        showParams
      })) as Status;

      if(update) {
        if(!slug) {
          slug = Object.keys(this.streams || {}).find(slug => (
            this.streams[slug].objectId === objectId
          ));
        }

        this.UpdateStream({
          key: slug,
          value: {
            status: response.state,
            warnings: response.warnings,
            quality: response.quality,
            embedUrl: response?.playout_urls?.embed_url
          }
        });
      }

      return response;
    } catch(error) {
      console.error(`Failed to load status for ${objectId || "object"}`, error);
      return {};
    }
  }

  *LoadStreamData({objectId, libraryId}: {objectId: string, libraryId?: string}): Generator<Stream> | Promise<Stream> {
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

  *LoadEdgeWriteTokenData({objectId, libraryId}: {objectId: string, libraryId?: string}): Generator<LiveRecordingCopies> | Promise<LiveRecordingCopies> {
    try {
      if(!libraryId) {
        libraryId = yield this.client.ContentObjectLibraryId({objectId});
      }

      const edgeWriteToken = yield this.client.ContentObjectMetadata({
        objectId,
        libraryId,
        metadataSubtree: "/live_recording/fabric_config/edge_write_token"
      });

      if(!edgeWriteToken) { return {}; }

      const metadata = yield this.client.ContentObjectMetadata({
        libraryId,
        objectId,
        writeToken: edgeWriteToken,
        metadataSubtree: "live_recording",
        select: ["recordings", "recording_config"]
      }) as LiveRecording;

      return {
        // First stream recording start time
        _recordingStartTime: metadata?.recording_config?.recording_start_time,
        ...metadata?.recordings
      };
    } catch(error) {
      console.error("Unable to load metadata with edge write token", error);
      return {};
    }
  }

  *LoadStreamProbeData({
    objectId,
    libraryId
  }: {objectId?: string, libraryId?: string}): Generator<{ audioData: AudioFormData, audioStreams: object[]}> | Promise<{ audioData: AudioFormData, audioStreams: object[]}> {
    try {
      if(!libraryId) {
        libraryId = yield this.client.ContentObjectLibraryId({objectId});
      }

      let probeMetadata = yield this.client.ContentObjectMetadata({
        libraryId,
        objectId,
        metadataSubtree: "live_recording_config/probe_info",
      });

      // Phase out as new streams will have live_recording_config/probe_info
      if(!probeMetadata) {
        probeMetadata = yield this.client.ContentObjectMetadata({
          libraryId,
          objectId,
          metadataSubtree: "live_recording/probe_info",
        });
      }

      if(!probeMetadata) {
        return {audioStreams: [], audioData: {}};
      }

      const audioConfig = yield this.client.ContentObjectMetadata({
        libraryId,
        objectId,
        metadataSubtree: "live_recording_config/audio"
      });

      const audioStreams: AudioStream[] = (probeMetadata.streams || []).filter((stream: AudioStream) => stream.codec_type === "audio");

      // Map used for form data
      const audioData: AudioFormData = {};
      audioStreams.forEach(spec => {
        const audioConfigForIndex = audioConfig && audioConfig[spec.stream_index] ? audioConfig[spec.stream_index] : {};

        const initBitrate = RECORDING_BITRATE_OPTIONS.map(option => option.value).includes(spec.bit_rate) ? spec.bit_rate : 192000;

        audioData[spec.stream_index] = {
          bitrate: spec.bit_rate,
          codec: spec.codec_name,
          record: Object.hasOwn(audioConfigForIndex, "record") ? audioConfigForIndex.record : true,
          recording_bitrate: initBitrate,
          recording_channels: spec.channels,
          playout: Object.hasOwn(audioConfigForIndex, "playout") ? audioConfigForIndex.playout : true,
          playout_label: audioConfigForIndex.playout_label || `Audio ${spec.stream_index}`
        };
      });

      return {
        audioStreams,
        audioData
      };
    } catch(error) {
      console.error("Unable to load live_recording metadata", error);
    }
  }

  *ConfigureStream({
    objectId,
    slug,
    probeMetadata
  }: {objectId: string, slug: string, probeMetadata: ProbeInfo}): Generator<unknown> {
    try {
      const libraryId = yield this.client.ContentObjectLibraryId({objectId});
      const liveRecordingConfig = (yield this.client.ContentObjectMetadata({
        libraryId,
        objectId,
        metadataSubtree: "live_recording_config",
        select: [
          "input/audio/stream_index",
          "input/audio/stream",
          "output/audio/bitrate",
          "output/audio/channel_layout",
          "part_ttl",
          "drm",
          "drm_type",
          "audio"
        ]
      })) as LiveRecordingConfig;
      const customSettings: Partial<AudioStreamCustomSettingsPayload> = {};

      const edgeWriteToken = (yield this.client.ContentObjectMetadata({
        libraryId,
        objectId,
        metadataSubtree: "live_recording/fabric_config/edge_write_token"
      })) as string;

      // Config api will override meta containing edge write token
      if(edgeWriteToken) {
        customSettings["edge_write_token"] = edgeWriteToken;
      }

      if(liveRecordingConfig.part_ttl) {
        customSettings["part_ttl"] = liveRecordingConfig.part_ttl;
      }

      if(liveRecordingConfig.audio) {
        // Remove audio tracks with a falsey record property
        Object.keys(liveRecordingConfig.audio).forEach((audioIndex) => {
          if(!liveRecordingConfig.audio?.[audioIndex].record) {
            delete liveRecordingConfig.audio?.[audioIndex];
          }
        });
      }

      customSettings["audio"] = liveRecordingConfig.audio ? liveRecordingConfig.audio : undefined;

      yield this.client.StreamConfig({name: objectId, customSettings, probeMetadata});

      if(liveRecordingConfig?.drm) {
        const drmOption = liveRecordingConfig?.drm_type ? ENCRYPTION_OPTIONS.find(option => option.value === liveRecordingConfig.drm_type) : null;

        yield this.client.StreamInitialize({
          name: objectId,
          drm: liveRecordingConfig?.drm === "clear" ? false : true,
          format: drmOption?.format.join(",")
        });
      }

      // // Update stream link in site after stream configuration
      yield this.UpdateStreamLink({objectId, slug});

      const response = (yield this.LoadStreamStatus({
        objectId
      })) as Status;

      const streamDetails = (yield this.LoadStreamData({
        objectId
      })) as Stream;

      this.UpdateStream({
        key: slug,
        value: {
          status: response.state,
          warnings: response.warnings,
          quality: response.quality,
          ...streamDetails
        }
      });
    } catch(error) {
      console.error("Unable to configure stream", error);
      return {};
    }
  }

  UpdateStreams({streams}: {streams: StreamMap}) {
    this.streams = streams;
  }

  UpdateStream({key, value={}}: {key?: string, value: object}) {
    if(!key) { return; }

    this.streams[key] = {
      ...(this.streams[key] || {}),
      ...value,
      slug: key
    };
  }

  *UpdateStreamLink({objectId, slug}: {objectId: string, slug: string}): Generator<void> {
    try {
      const originalLink = (yield this.client.ContentObjectMetadata({
        libraryId: this.siteLibraryId,
        objectId: this.siteId,
        metadataSubtree: `public/asset_metadata/live_streams/${slug}`,
      })) as Link;

      const link = CreateLink({
        targetHash: (yield this.client.LatestVersionHash({objectId})) as string,
        options: originalLink
      });

      const {writeToken} = (yield this.client.EditContentObject({
        libraryId: this.siteLibraryId,
        objectId: this.siteId
      })) as EditContentObjectProps;

      yield this.client.ReplaceMetadata({
        libraryId: this.siteLibraryId,
        objectId: this.siteId,
        writeToken,
        metadataSubtree: `public/asset_metadata/live_streams/${slug}`,
        metadata: link
      });

      yield this.client.FinalizeContentObject({
        libraryId: this.siteLibraryId,
        objectId: this.siteId,
        writeToken,
        commitMessage: "Update stream link",
        awaitCommitConfirmation: true
      });
    } catch(error) {
      console.error("Unable to update stream link", error);
    }
  }

  *UpdateStreamAudioSettings({objectId, slug, audioData}: {objectId: string, slug: string, audioData: AudioFormData}): Generator<unknown> {
    const libraryId = yield this.client.ContentObjectLibraryId({objectId});
    const {writeToken} = (yield this.client.EditContentObject({
      libraryId,
      objectId
    })) as EditContentObjectProps;

    yield this.client.ReplaceMetadata({
      libraryId,
      objectId,
      writeToken,
      metadataSubtree: "live_recording_config/audio",
      metadata: audioData
    });

    yield this.client.FinalizeContentObject({
      libraryId,
      objectId,
      writeToken,
      commitMessage: "Update metadata",
      awaitCommitConfirmation: true
    });

    const probeMetadata = (yield this.client.ContentObjectMetadata({
      libraryId,
      objectId,
      metadataSubtree: "live_recording_config/probe_info"
    })) as ProbeInfo;

    yield this.ConfigureStream({
      objectId,
      slug,
      probeMetadata
    });
  }

  *ListenForUpdate({libraryId, objectId}: {libraryId?: string, objectId: string}): Generator<EventSource> | Promise<EventSource> {
    if(!libraryId) {
      libraryId = (yield this.client.ContentObjectLibraryId({objectId})) as string;
    }

    // const token = yield this.client.CreateSignedToken({
    //   objectId,
    //   duration: 24 * 60 * 60 * 1000,
    // });

    // TODO: Update watch routes
    const rep = yield this.client.FabricUrl({
      libraryId,
      objectId,
      rep: "/watch/meta/public",
      noAuth: true
    });

    const url = rep.replace("/rep/", "/");

    // const headers = { Authorization: "Bearer " + token };
    const eventSource = new EventSource(url);

    eventSource.onmessage = event => {
      console.log("onmessage - event", event);
      console.log("new data", JSON.parse(event.data));
    };

    eventSource.onerror = function(event) {
      console.error("EventSource failed:", event);
    };

    return eventSource;
  }
}

export default StreamStore;
