import {STATUS_MAP, QUALITY_MAP, FORMAT_TEXT, CODEC_TEXT} from "@/utils/constants";
import {Dispatch, SetStateAction} from "react";

type StreamMap = { [key: string]: StreamProps };
type Status = typeof STATUS_MAP[keyof typeof STATUS_MAP];
type StreamTableSortColumns = "title" | "status";
type Quality = typeof QUALITY_MAP[keyof typeof QUALITY_MAP];
type Format = keyof FORMAT_TEXT;
type Codec = keyof CODEC_TEXT;

/**
 * Represents the properties of an Icon component.
 */
interface IconProps {
  className?: string;
  color?: string;
  size?: string;
}

// TODO: Create jobs type
interface IngestJobProps {
  objectId?: string;
}

/**
 * Represents an individual stream cached as streams in DataStore.
 */
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

/**
 * Represents live_recording/recording_config/recording_params/ladder_specs.
 */
interface LadderSpecProps {
  bit_rate: number,
  codecs: string,
  height: number,
  media_type: number,
  representation: string,
  stream_index: number,
  stream_label: string,
  stream_name: string,
  width: number
}

/**
 * Represents metdata parsed and saved to /live_recording_config.
 */
interface LiveConfigProps {
  drm?: string;
  drm_type: string;
  audio: object | null;
  part_ttl: number;
  reference_url: string;
}

/**
 * Represents live_offerings when retrieving live_recording/recordings using the edge write token.
 */
interface LiveOfferingRecordingProps {
  audio_mez_duration_ts: number;
  current_parts: {
    [key: string]: {
      qlhash: string;
      qlhash_next: string;
      qpwt: string;
      qpwt_next: string;
    }
  },
  end_time: string;
  end_time_epoch_sec: number;
  finalized_parts_info: {
    [key: string]: {
      last_finalization_time: number;
      n_parts: number;
    }
  },
  last_update_time: string;
  last_update_time_epoch_sec: number;
  live_recording_handle: string;
  sources: {
    [key: string]: {
      name: string;
      parts: unknown[];
      trimmed: number;
      type: number;
    }
  },
  start_time: string;
  start_time_epoch_sec: number;
  video_mez_duration_ts: number;
}

/**
 * Represents the status of a stream from Client.StreamStatus.
 */
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

/**
 * Used to represent recording data for stream details.
 */
interface LiveRecordingCopiesProps {
  _recordingStartTime: number;
  live_offering: LiveOfferingRecordingProps[],
  recording_sequence: number;
}

/**
 * Represents live_recording_config metadata.
 */
interface LiveRecordingConfigProps {
  recording_config: {
    recording_params: {
      description: string;
      ladder_specs: LadderSpecProps[],
      listen: boolean;
      live_delay_nano: number;
      max_duration_sec: number;
      name: string;
      origin_url: string;
      part_ttl: number;
      playout_type: string;
      simple_watermark: {
        font_color: string;
        font_relative_height: number;
        shadow: boolean;
        template: string;
        timecode: string;
        timecode_rate: number;
        x: string;
        y: string;
      },
      source_timescale: number;
      xc_params: {
        audio_bitrate: number;
        audio_index: number[];
        audio_seg_duration_ts: number;
        channel_layout: number;
        connection_timeout: number;
        debug_frame_level: boolean;
        duration_ts: number;
        ecodec: string;
        ecodec2: string;
        enc_height: number;
        enc_width: number;
        filter_descriptor: string;
        force_keyint: number;
        format: string;
        listen: boolean;
        n_audio: number;
        preset: string;
        sample_rate: number;
        seg_duration: string;
        skip_decoding: boolean;
        start_segment_str: string;
        stream_id: number;
        sync_audio_to_stream_id: number;
        url: string;
        video_bitrate: number;
        video_frame_duration_ts: number;
        video_seg_duration_ts: number;
        video_time_base: number;
        xc_type: number;
      }
    },
    recording_start_time: number;
    recording_stop_time: number;
  },
  recordings: {
    live_offering: LiveOfferingRecordingProps[],
    recording_sequence: number;
  }
}

/**
 * Represents form elements (checkboxes and inputs) for audio tracks table.
 */
interface AudioFormDataProps {
  [key: number]: {
    playout: boolean;
    bitrate: string;
    codec: "aac" | "mp3" | "mp2" | "mp4a";
    recording_bitrate: string;
    recording_channels: number;
    record: boolean;
    playout_label: string;
  }
}

/**
 * Represents metadata of an individual stream, as specified in the AudioStreamMap Props.
 */
interface AudioStreamProps {
  avg_frame_rate: string;
  bit_rate: string;
  channel_layout: number;
  channels: number;
  codec_id: number;
  codec_name: "aac" | "mp3" | "mp2" | "mp4a";
  codec_type: "audio" | "video";
  display_aspect_ratio: string;
  duration_ts: number;
  frame_rate: string;
  has_b_frame: false
  level: number;
  pix_fmt: number;
  profile: number;
  sample_aspect_ratio: string;
  sample_rate: number;
  start_time: number;
  stream_id: number;
  stream_index: number;
  ticks_per_frame: number;
  time_base: string;
}

/**
 * Represents metadata at the specified path live_recording_config/probe_info/streams.
 */
type AudioStreamMapProps = {
  [key: number]: AudioStreamProps
}

/**
 * Represents the properties of the AudioTracksTable component.
 */
interface AudioTracksTableProps {
  records: {
    stream_index: number;
    codec_name: string;
    bit_rate: number;
  }[];
  audioFormData?: AudioFormDataProps;
  setAudioFormData: Dispatch<SetStateAction<AudioFormDataProps | undefined>>;
  disabled?: boolean;
}

interface WatchMetadataProps {
  latest: string;
  meta: object;
  qid: string;
  target: string;
  error?: object;
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
