import IngestPanel from "@/pages/create/IngestPanel";
import PlayoutPanel from "@/pages/create/PlayoutPanel";
import PreviewPanel from "@/pages/create/PreviewPanel";
import ProgressPanel from "@/pages/create/ProgressPanel";
import Content from "@/pages/content/Content";
import ContentItemNew from "@/pages/content/ContentItemNew";
import Streams from "@/pages/streams/Streams";

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
    Component: Content,
    label: "Content"
  },
  {
    path: "/content/new",
    Component: ContentItemNew,
    label: "New"
  },
  // Live Stream routes
  {
    path: "/streams",
    Component: Streams,
    label: "Streams"
  }
];
