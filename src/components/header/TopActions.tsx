import {Flex} from "@mantine/core";
import Button, {ButtonProps} from "@/components/common/Button";

export interface ActionProps extends ButtonProps {
  label: string;
}

interface TopActionsProps {
  actions: ActionProps[];
}

const TopActions = ({actions}: TopActionsProps) => {
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
