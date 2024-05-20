import {Menu, NavLink} from "@mantine/core";
import Button from "@/components/common/Button";
import classes from "@/assets/stylesheets/CreateMenu.module.css";
import CubePlusIcon from "@/assets/icons/CubePlusIcon";
import {Link} from "react-router-dom";

const CREATE_MENU_ITEMS = [
  {label: "New Video on Demand", path: "/content/new"},
  // TODO: Add livestream and channel paths
  {label: "New Livestream", path: "/"},
  {label: "New Channel", path: "/"}
];

const CreateMenu = () => {
  return (
    <Menu position="bottom-start" classNames={{dropdown: classes.dropdown}}>
      <Menu.Target>
        <Button leftSection={<CubePlusIcon />}>New Media Item</Button>
      </Menu.Target>
      <Menu.Dropdown>
        {
          CREATE_MENU_ITEMS.map(item => (
            <Menu.Item key={`menu-item-${item.label}`} classNames={{item: classes.item}}>
              <NavLink
                component={Link}
                to={item.path}
                label={item.label}
                className={classes.navLink}
              />
            </Menu.Item>
          ))
        }
      </Menu.Dropdown>
    </Menu>
  );
};

export default CreateMenu;
