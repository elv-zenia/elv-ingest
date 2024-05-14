import {NavLink} from "react-router-dom";
import {AppShell, Flex, Text} from "@mantine/core";
import {ROUTES} from "@/utils/constants";

const SideNavigation = () => {
  return (
    <AppShell.Navbar p="md">
      {
        ROUTES.filter(route => route.showNavbarLink).map(({path, label, icon}) => (
          <NavLink to={path} key={path} className="side-navigation__link">
            <Flex align="center" gap="xs">
              {icon ? icon : null}
              <Text>{label}</Text>
            </Flex>
          </NavLink>
        ))
      }
    </AppShell.Navbar>
  );
};

export default SideNavigation;
