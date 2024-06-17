import {createTheme, MantineTheme, NavLinkProps} from "@mantine/core";
import {PartialObjectDeep} from "type-fest/source/partial-deep";

const theme: PartialObjectDeep<MantineTheme, object> = createTheme({
  fontFamily: "Inter, Montserrat, Helvetica Neue, Helvetica, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: {
    fontFamily: "Greycliff CF, sans-serif"
  },
  primaryColor: "elv-violet",
  primaryShade: 3,
  cursorType: "pointer",
  colors: {
    "elv-violet": [
      "#f9e9ff",
      "#ebcfff",
      "#d29cff",
      "#bd6dff", // eluvio color
      "#b964ff", // eluvio color
      "#a437fe",
      "#971afe",
      "#9009ff",
      "#7c00e4",
      "#8f5aff", // eluvio color
      "#5f00b3",
      "#380C61", // eluvio color
    ],
    "elv-gray": [
      "#f5f5f5",
      "#e7e7e7",
      "#cdcdcd",
      "#b2b2b2",
      "#9a9a9a",
      "#8b8b8b",
      "#848484",
      "#808080", // eluvio color
      "#656565",
      "#3C3C3C" // eluvio color
    ],
    "elv-neutral": [
      "#f8f2fe",
      "rgba(169, 160, 178, 0.20)", // eluvio color
      "#cdc8d3",
      "#b2aaba", // eluvio color
      "#a9a0b2", // eluvio color
      "#8b7f97",
      "#847791",
      "#71667e",
      "#665972",
      "#594c66"
    ],
    "elv-orange": [
      "#fff6e1",
      "#ffeccc",
      "#ffd79b",
      "#ffc164",
      "#ffae38",
      "#ffa31b",
      "#f90", // eluvio color
      "#e38800",
      "#ca7800",
      "#b06700"
    ],
    "elv-red": [
      "#ffe9e6",
      "#ffd3cd",
      "#ffa69b",
      "#ff7663",
      "#ff4723", // eluvio color
      "#ff3418",
      "#ff2507",
      "#e41600",
      "#cc0e00",
      "#b20000"
    ],
    "elv-yellow": [
      "#fffde2",
      "#fffacc",
      "#fff59b",
      "#ffef64",
      "#ffeb39",
      "#ffe81d",
      "#ffe607", // eluvio color
      "#e3cc00",
      "#c9b500",
      "#ad9c00"
    ],
    "elv-green": [
      "#e4fdf4",
      "#d6f6e8",
      "#b0e8d1",
      "#88dab8",
      "#66cfa3",
      "#57ca9a", // eluvio color
      "#41c48f",
      "#30ad7a",
      "#249a6b",
      "#0b865a"
    ]
  },
  // Default styles for components that need styles across components
  components: {
    Tabs: {
      styles: () => ({
        list: {
          "--tab-border-color": "var(--mantine-color-elv-neutral-4)",
          "--tabs-list-border-size": "1px",
          "--tabs-color": "var(--mantine-color-elv-violet-11)"
        }
      })
    },
    Anchor: {
      styles: () => ({
        root: {
          "textDecoration": "underline",
          "fontWeight": "700",
          "fontSize": "0.75rem"
        }
      })
    },
    Radio: {
      styles: () => ({
        root: {
          "--radio-icon-size": "0.5rem"
        }
      })
    },
    NavLink: {
      styles: (_theme: MantineTheme, props: NavLinkProps) => ({
        root: {
          "--nl-bg": "var(--mantine-color-elv-gray-0)",
          "borderRadius": "4px"
        },
        body: {
          "lineHeight": 1.2
        },
        label: {
          "fontWeight": 600,
          "color": props.active ? "var(--mantine-color-elv-violet-3)" : "var(--mantine-color-elv-gray-9)"
        },
        section: {
          color: "var(--mantine-color-elv-neutral-4)"
        }
      })
    },
    Table: {
      styles: () => ({
        tr: {
          "--mantine-datatable-highlight-on-hover-color": "var(--mantine-color-elv-neutral-1)"
        }
      })
    }
  }
});

export default theme;
