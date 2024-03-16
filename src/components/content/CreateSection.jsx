import {Flex, Menu, Text} from "@mantine/core";
import Button from "@/components/Button.jsx";
import classes from "@/assets/stylesheets/CreateSection.module.css";
import CubePlus from "@/assets/icons/CubePlus.jsx";

const CREATE_MENU_ITEMS = [
  {label: "New Video On Demand"},
  {label: "New Livestream"},
  {label: "New Channel"}
];

const CreateSection = () => {
  return (
    <Flex direction="row" gap="xs" align="center" mt="17px">
      <Menu position="bottom-start" classNames={{dropdown: classes.dropdown}}>
        <Menu.Target>
          <Button label="New Media Item" leftSection={<CubePlus />} />
        </Menu.Target>
        <Menu.Dropdown>
          {
            CREATE_MENU_ITEMS.map(item => (
              <Menu.Item key={`menu-item-${item.label}`} className={classes.item}>
                <Text size="sm">{item.label}</Text>
              </Menu.Item>
            ))
          }
        </Menu.Dropdown>
      </Menu>
      <Text size="xs">Below are your currently ingested raw assets. Sort and edit here or select individual items. Click the New Media Item button to ingest new items.</Text>
    </Flex>
  );
};

export default CreateSection;
