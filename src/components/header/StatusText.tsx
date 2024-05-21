import {Box, Text, Group, Indicator} from "@mantine/core";
import classes from "@/assets/stylesheets/StatusText.module.css";
import {Quality, Status} from "components/components";
import {QUALITY_MAP, STATUS_TEXT} from "@/utils/constants";
import {StatusIndicator} from "@/utils/helpers";

interface StatusTextProps {
  status: Status;
  quality: Quality;
  withBorder?: boolean;
}

const StatusText = ({status, quality, withBorder=false}: StatusTextProps) => {
  if(!status) { return null; }

  const statusText = STATUS_TEXT[status];

  if(quality === QUALITY_MAP.GOOD || !quality) {
    return (
      <Box className={withBorder ? classes.box : ""} title={statusText}>
        <Indicator color={StatusIndicator(status)} position="middle-start" size={8} offset={8}>
          <Text fz="sm" ml="xl">
            {statusText}
          </Text>
        </Indicator>
      </Box>
    );
  } else {
    return (
      <Box className={withBorder ? classes.box : ""}>
        <Group gap={0}>
          {/*<IconAlertCircle color="var(--mantine-color-elv-orange-3)" width={15} />*/}
          <Text fz="sm" ml="md">
            {statusText}
          </Text>
        </Group>
      </Box>
    );
  }
};

export default StatusText;
