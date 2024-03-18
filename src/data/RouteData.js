import Content from "@/pages/Content.jsx";
import ContentItemNew from "@/pages/ContentItemNew.jsx";

export const ROUTES = [
  {
    path: "/content",
    Component: Content,
    label: "Content",
    icon: null,
    showNavbarLink: true
  },
  {
    path: "/content/new",
    Component: ContentItemNew,
    label: "New",
    icon: null,
    showNavbarLink: false
  },
  // Set default route
  {
    path: "/",
    Component: Content,
    label: "Content",
    icon: null,
    showNavbarLink: false
  }
];
