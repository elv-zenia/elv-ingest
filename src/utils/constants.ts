import IngestPanel from "@/pages/create/IngestPanel";
import PlayoutPanel from "@/pages/create/PlayoutPanel";
import PreviewPanel from "@/pages/create/PreviewPanel";
import ProgressPanel from "@/pages/create/ProgressPanel";
import Content from "@/pages/content/Content";
import ContentItemNew from "@/pages/content/new/ContentItemNew";
import Streams from "@/pages/streams/Streams";
import {Codec, Format, Quality, Status} from "components/components";
import StreamDetails from "@/pages/stream-details/StreamDetails";

export const CONTENT_COLUMNS = [
  {title: "Name"},
  {title: "Type"},
  {title: "Owner"},
  {title: "Last Updated"},
  {title: "Permissions"},
  {title: "Content Fabric ID"}
];

export const CREATE_TABS = [
  {label: "Ingest Details", value: "ingest-details", Component: IngestPanel},
  {label: "Playout", value: "playout", Component: PlayoutPanel},
  {label: "View Stream", value: "view-stream", Component: PreviewPanel},
  {label: "Job Progress", value: "job-progress", Component: ProgressPanel}
];

export const UPLOAD_TYPES = [
  {label: "Local file(s)", value: "local-files"},
  {label: "S3 Bucket", value: "s3-bucket"}
];

export const ROUTES = [
  // Ingest routes
  {
    path: "/content",
    Component: Content
  },
  {
    path: "/content/new",
    Component: ContentItemNew
  },
  // Live Stream routes
  {
    path: "/streams",
    Component: Streams
  },
  {
    path: "/streams/:id",
    Component: StreamDetails
  }
];

// Maps of variables

export const STATUS_MAP = {
  UNCONFIGURED: "unconfigured",
  UNINITIALIZED: "uninitialized",
  INITIALIZED: "initialized",
  INACTIVE: "inactive",
  STOPPED: "stopped",
  STARTING: "starting",
  RUNNING: "running",
  STALLED: "stalled",
  DEGRADED: "degraded"
};

export const QUALITY_MAP = {
  DEGRADED: "degraded",
  SEVERE: "severe",
  GOOD: "good"
};

// Maps of human-readable text

export const FORMAT_TEXT: Record<Format, string> = {
  udp: "MPEGTS",
  srt: "SRT",
  "srt-caller": "SRT Caller",
  rtmp: "RTMP"
};

export const CODEC_TEXT: Record<Codec, string> = {
  h264: "H.264",
  h265: "H.265",
  mpeg2video: "MPEG-2"
};

export const RECORDING_STATUS_TEXT = {
  NOT_AVAILABLE: "Not Available",
  PARTIALLY_AVAILABLE: "Partially Available",
  AVAILABLE: "Available"
};

export const QUALITY_TEXT: Record<Quality, string> = {
  "good": "Good",
  "severe": "Severe",
  "degraded": "Degraded"
};

export const STATUS_TEXT: Record<Status, string> = {
  unconfigured: "Not Configured",
  uninitialized: "Uninitialized",
  initialized: "Initialized",
  inactive: "Inactive",
  stopped: "Stopped",
  starting: "Starting",
  running: "Running",
  stalled: "Stalled",
  terminating: "Terminating"
};
