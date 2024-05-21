interface IconProps {
  className?: string;
  color?: string;
}

// TODO: Create jobs type
interface JobsProps {
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
  format?: string;
  videoBitrate?: number;
  codecName?: string;
  audioStreamCount?: number;
  referenceUrl?: string;
  drm?: string;
  simpleWatermark?: string;
  imageWatermark?: string;
}

type StreamMapProps = { [key: string]: StreamProps };
