import {Flex} from "@mantine/core";
import Button from "@/components/Button.jsx";

const TopActions = ({actions=[]}) => {
  return (
    <Flex direction="row" gap="sm">
      {
        actions.map(({label, variant = "filled", uppercase, onClick}) => (
          <Button
            variant={variant}
            key={`top-action-${label}`}
            uppercase={uppercase}
            onClick={onClick}
          >
            { label }
          </Button>
        ))
      }
    </Flex>
  );
};

export default TopActions;
