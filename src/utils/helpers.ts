import Fraction from "fraction.js";
import {LiveConfigProps, Status, StreamProps, StreamTableSortColumns} from "components/components";
import {STATUS_MAP} from "@/utils/constants";

export const ParseLiveConfigData = ({
  url,
  referenceUrl,
  encryption,
  retention,
  audioFormData
}: {url: string, referenceUrl: string, encryption: string, retention: string, audioFormData: object}): LiveConfigProps => {
  const config = {
    drm: encryption.includes("drm") ? "drm" : encryption.includes("clear") ? "clear" : undefined,
    drm_type: encryption,
    audio: audioFormData ? audioFormData : null,
    part_ttl: parseInt(retention),
    url,
    reference_url: referenceUrl
  };

  return config;
};

export const Slugify = (text: string): string => {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g,"")
    .replace(/-+/g, "-");
};

export const VideoBitrateReadable = (bitrate?: number): string => {
  if(!bitrate) { return ""; }
  const denominator = 1000000;
  const value = (bitrate / denominator).toFixed(1);

  return `${value}Mbps`;
};

export const AudioBitrateReadable = (bitrate: number): string => {
  if(!bitrate) { return ""; }
  const denominator = 1000;
  const value = (bitrate / denominator).toFixed(0);

  return `${value} Kbps`;
};

export const StreamIsActive = (state: Status): boolean => {
  let active = false;

  if([STATUS_MAP.STARTING, STATUS_MAP.RUNNING, STATUS_MAP.STALLED, STATUS_MAP.STOPPED].includes(state)) {
    active = true;
  }

  return active;
};

export const StatusIndicator = (status: Status): "elv-orange.6" | "elv-green.5" | "elv-red.4" | "elv-yellow.6" | "" => {
  if(status === STATUS_MAP.STOPPED) {
    return "elv-orange.6";
  } else if(status === STATUS_MAP.RUNNING) {
    return "elv-green.5";
  } else if([STATUS_MAP.INACTIVE, STATUS_MAP.UNINITIALIZED, STATUS_MAP.UNINITIALIZED, STATUS_MAP.STALLED].includes(status)) {
    return "elv-red.4";
  } else if(status === STATUS_MAP.DEGRADED) {
    return "elv-yellow.6";
  } else {
    return "";
  }
};

export const FormatTime = ({milliseconds, iso, format="hh,mm,ss"}: {milliseconds: number, iso: number, format: "hh,mm,ss" | "hh:mm:ss" | "hh,mm" | "hh,mm,ss"}): string => {
  if(iso) {
    milliseconds = new Date(iso).getTime();
  }

  if(!milliseconds) { return ""; }

  const hours = new Fraction(milliseconds, 1000)
    .div(3600)
    .mod(24)
    .floor(0)
    .toString();
  const minutes = new Fraction(milliseconds, 1000)
    .div(60)
    .mod(60)
    .floor(0)
    .toString();
  const seconds = new Fraction(milliseconds, 1000)
    .mod(60)
    .floor(0)
    .toString();

  let timeString = `${hours}h ${minutes}min`;

  if(format === "hh:mm:ss") {
    const arrayValue = [
      hours.padStart(2, "0"),
      minutes.padStart(2, "0"),
      seconds.padStart(2, "0")
    ];

    timeString = arrayValue.join(":");
    // timeString = `${hours}h ${minutes}min ${seconds}sec`
  } else if(format === "hh,mm") {
    timeString = `${hours}h ${minutes}min`;
  } else if(format === "hh,mm,ss") {
    timeString = `${hours}h ${minutes}min ${seconds}sec`;
  }

  return timeString;
};

// Convert a FileList to file info
export const FileInfo = async ({path, fileList}: {path: string, fileList: File[]}): Promise<{path: string, type: string, size: number, mime_type: string, data: object}[]> => {
  return Promise.all(
    Array.from(fileList).map(async file => {
      const data = file;
      const filePath = file.webkitRelativePath || file.name;
      return {
        path: `${path}${filePath}`.replace(/^\/+/g, ""),
        type: "file",
        size: file.size,
        mime_type: file.type,
        data
      };
    })
  );
};

export const Pluralize = ({base, suffix="s", count}: {base: string, suffix: string, count: number}): string => {
  return `${count} ${base}${count > 1 ? suffix : ""}`;
};

export const SortTable = ({sortStatus}: {sortStatus: {direction: string, columnAccessor: string}}) => {
  return (a: StreamProps, b: StreamProps) => {
    const column = sortStatus.columnAccessor as StreamTableSortColumns;

    const valA = typeof a[column] === "string" ? (a[column] as string).toString().toLowerCase() : a[column];

    const valB = typeof b[column] === "string" ? (b[column] || "").toString().toLowerCase() : b[column];

    if(!valA || !valB) { return 0; }

    if(sortStatus.direction === "asc") {
      if(valA < valB) return -1;
      if(valA > valB) return 1;
      return 0;
    } else {
      if(valA > valB) return -1;
      if(valA < valB) return 1;
      return 0;
    }
  };
};

export const DateFormat = ({time, format="sec"}: {time: number, format: "sec" | "iso" | "ms"}): string => {
  if(!["sec", "iso", "ms"].includes(format)) { throw Error("Invalid format type provided."); }

  if(format === "sec") {
    time = time * 1000;
  }

  return new Date(time).toLocaleString();
};

export const SanitizeUrl = ({url}: {url?: string}): string => {
  if(!url) { throw Error("No URL provided"); }

  const urlObject = new URL(url);
  urlObject.searchParams.delete("passphrase");

  return urlObject.toString();
};

export const AudioCodec = (value: string): string => {
  if(value === "aac") {
    return "aac";
  } else if(value === "mp3") {
    return "mp3";
  } else if(value === "mp2") {
    return "mp2";
  } else if(value?.includes("mp4a")) {
    return "mp4a";
  } else {
    return "--";
  }
};
