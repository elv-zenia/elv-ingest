import {Flex} from "@mantine/core";
import Button from "@/components/Button.jsx";

const TopActions = ({actions=[]}) => {
  return (
    <Flex direction="row" gap="sm">
      {
        actions.map(({label, variant = "filled"}) => (
          <Button
            variant={variant}
            key={`top-action-${label}`} label={label}
          />
        ))
      }
    </Flex>
  );
};

export default TopActions;
