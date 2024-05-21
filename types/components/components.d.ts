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
