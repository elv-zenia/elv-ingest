import {createTheme} from "@mantine/core";

const theme = createTheme({
  fontFamily: "Inter, Montserrat, Helvetica Neue, Helvetica, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: {
    fontFamily: "Greycliff CF, sans-serif"
  },
  primaryColor: "elv-violet",
  primaryShade: 3,
  colors: {
    "elv-violet": [
      "#f9e9ff",
      "#ebcfff",
      "#d29cff",
      "#b964ff", // eluvio color
      "#a437fe",
      "#971afe",
      "#9009ff",
      "#7c00e4",
      "#8f5aff", // eluvio color
      "#5f00b3"
    ],
    "elv-gray": [
      "#f5f5f5",
      "#e7e7e7",
      "#cdcdcd",
      "#b2b2b2",
      "#9a9a9a",
      "#A9A0B2",
      "#8b8b8b",
      "#848484",
      "#717171",
      "#656565",
      "#3C3C3C" // eluvio color
    ],
    "elv-neutral": [
      "#f8f2fe",
      "#e8e4ed",
      "#cdc8d3",
      "#b2aaba", // eluvio color
      "#9a90a4",
      "#8b7f97",
      "#847791",
      "#71667e",
      "#665972",
      "#594c66"
    ]
  }
});

export default theme;
