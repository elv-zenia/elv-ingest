import {observer} from "mobx-react-lite";
import {ActionIcon, Flex} from "@mantine/core";
import {uiStore} from "@/stores";
import {IconX} from "@tabler/icons-react";

const ErrorBanner = observer(() => {
  if(!uiStore.errorMessage) { return null; }

  return (
    <Flex bg="elv-gray.9" c="elv-gray.0" justify="space-between" p="12px 24px" mb={16}>
      { uiStore.errorMessage }
      <ActionIcon onClick={() => uiStore.SetErrorMessage({message: undefined})}>
        <IconX />
      </ActionIcon>
    </Flex>
  );
});

export default ErrorBanner;
