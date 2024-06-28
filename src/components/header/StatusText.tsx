import {Box, Text, Group} from "@mantine/core";
import classes from "@/assets/stylesheets/StatusText.module.css";
import {Quality, StatusType} from "components/stream";
import {QUALITY_MAP, STATUS_TEXT} from "@/utils/constants";
import {StatusIndicator} from "@/utils/helpers";
import CircleFilledIcon from "@/assets/icons/CircleFilledIcon";
import CircleAlertIcon from "@/assets/icons/CircleAlertIcon";

interface StatusTextProps {
  status: StatusType;
  quality?: Quality;
  withBorder?: boolean;
}

const StatusText = ({status, quality, withBorder=false}: StatusTextProps) => {
  if(!status) { return null; }

  const statusText = STATUS_TEXT[status];

    return (
      <Box className={withBorder ? classes.box : ""}>
        <Group gap={0}>
          {/* If quality is not good, show warning indicator */}
          {
            quality === QUALITY_MAP.GOOD || !quality ?
              <CircleFilledIcon color={StatusIndicator(status)} size="9" /> :
              <CircleAlertIcon color="var(--mantine-color-elv-orange-3)" />
          }
          <Text size={withBorder ? "xs" : "sm"} ml={withBorder ? "xs" : "md"}>
            {statusText}
          </Text>
        </Group>
      </Box>
    );
};

export default StatusText;
