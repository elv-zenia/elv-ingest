import {AppShell, NavLink, Text} from "@mantine/core";
import CubeIcon from "@/assets/icons/CubeIcon";
import StreamIcon from "@/assets/icons/StreamIcon";
import MonitorIcon from "@/assets/icons/MonitorIcon";
import {useLocation, useNavigate} from "react-router-dom";

const SideNavigation = () => {
  const NAV_SECTIONS = [
    {
      sectionTitle: "Content Management",
      links: [
        {path: "/content", label: "Content", icon: <CubeIcon />},
        {path: "/streams", label: "Streams", icon: <StreamIcon />},
        {path: "/monitor", label: "Monitor", icon: <MonitorIcon />}
      ]
    }
  ];
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppShell.Navbar p="sm">
      {
        NAV_SECTIONS.map(({sectionTitle, links}) => (
          <AppShell.Section key={`navigation-section-${sectionTitle}`}>
            <Text size="sm" c="elv-gray.9" fw={600} mb="9">
              { sectionTitle }
            </Text>
            {
              links.map(({path, label, icon}) => (
                <NavLink
                  href="#"
                  onClick={() => navigate(path)}
                  key={`navigation-link-${path}`}
                  label={label}
                  leftSection={icon}
                  active={path === location.pathname}
                />
              ))
            }
          </AppShell.Section>
        ))
      }
    </AppShell.Navbar>
  );
};

export default SideNavigation;
