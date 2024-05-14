import {Button} from "@mantine/core";
import StopwatchIcon from "@/assets/icons/StopwatchIcon";
import classes from "@/assets/stylesheets/JobsActivity.module.css";

const JobsActivity = () => {
  return (
    <Button
      variant="subtle"
      color="elv-gray.8"
      fw={400}
      leftSection={<StopwatchIcon className={classes.icon} />}
      // TODO: Get dynamic value of job count
      rightSection="(8)"
      classNames={{section: classes.section, label: classes.label}}
    >
      Jobs In Progress
    </Button>
  );
};

export default JobsActivity;
