import IngestPanel from "@/components/create/IngestPanel.jsx";
import PlayoutPanel from "@/components/create/PlayoutPanel.jsx";
import PreviewPanel from "@/components/create/PreviewPanel.jsx";
import ProgressPanel from "@/components/create/ProgressPanel.jsx";

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
