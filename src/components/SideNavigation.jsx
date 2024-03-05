import {NavLink} from "react-router-dom";
import {AppShell, Flex, Text} from "@mantine/core";

const LINKS = [
  {title: "Content", icon: null, path: "/"}
];

const SideNavigation = () => {
  return (
    <AppShell.Navbar p="md">
      {
        LINKS.map(({path, title, icon}) => (
          <NavLink to={path} key={path} className="side-navigation__link">
            <Flex align="center" gap="xs">
              {icon ? icon : null}
              <Text>{title}</Text>
            </Flex>
          </NavLink>
        ))
      }
    </AppShell.Navbar>
  );
};

export default SideNavigation;
