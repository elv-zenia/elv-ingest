import {STATUS_MAP, QUALITY_MAP, FORMAT_TEXT, CODEC_TEXT} from "@/utils/constants";

type StreamMap = { [key: string]: StreamProps };
type Status = typeof STATUS_MAP[keyof typeof STATUS_MAP];
type StreamTableSortColumns = "title" | "status";
type Quality = typeof QUALITY_MAP[keyof typeof QUALITY_MAP];
type Format = keyof FORMAT_TEXT;
type Codec = keyof CODEC_TEXT;

interface IconProps {
  className?: string;
  color?: string;
  size?: string;
}

// TODO: Create jobs type
interface IngestJobProps {
  objectId?: string;
}

interface StreamProps {
  objectId?: string;
  slug?: string;
  "."?: {source: string} | undefined;
  versionHash?:string;
  libraryId?: string;
  title?: string;
  display_title?: string;
  embedUrl?: string;
  originUrl?: string;
  format?: Format;
  videoBitrate?: number;
  codecName?: Codec;
  audioStreamCount?: number;
  referenceUrl?: string;
  drm?: string;
  simpleWatermark?: string;
  imageWatermark?: string;
  status?: Status;
  quality: Quality;
}


interface LiveConfigProps {
  drm?: string;
  drm_type: string;
  audio: object | null;
  part_ttl: number;
  reference_url: string;
}

interface StatusProps {
  name: string;
  library_id: string;
  object_id: string;
  fabric_api: string;
  url: string;
  edge_write_token: string;
  stream_id: string;
  edge_meta_size: number;
  recording_period_sequence: number;
  tlro: string;
  recording_period: {
    start_time_epoch_sec: number;
    start_time_text: string;
    end_time_epoch_sec: number;
    end_time_text: string;
    video_parts: number;
    video_last_part_finalized_epoch_sec: number;
    video_since_last_finalize_sec: number;
  },
  lro_status_url: string;
  insertions: {
    insertion_time: number;
    playout: string;
  }[];
  playout_urls: {
    embed_url: string;
  }
  warnings: string[];
  quality: Quality;
  state: Status;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ElvError extends Error {
  kind: string;

  constructor(message: string, kind: string) {
    super(message);
    this.name = "CustomError";
    this.kind = kind;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toString() {
    return `${this.name} [${this.kind}]: ${this.message}`;
  }
}
