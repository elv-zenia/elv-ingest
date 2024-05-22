import {Flex, TextInput} from "@mantine/core";
import MagnifyingGlassIcon from "@/assets/icons/MagnifyingGlassIcon";
import classes from "@/assets/stylesheets/SearchBar.module.css";

const SearchBar = ({
  value,
  setValue
}: {value: string, setValue: (arg: string) => void}) => {

  return (
    <Flex direction="row" align="center" className={classes.flexbox}>
      <TextInput
        classNames={{
          input: classes.input,
          root: classes.root,
          section: classes.section
      }}
        size="xs"
        placeholder="Search"
        leftSection={<MagnifyingGlassIcon className={classes.icon} />}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </Flex>
  );
};

export default SearchBar;
