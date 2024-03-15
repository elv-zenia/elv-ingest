import {Button} from "@mantine/core";
import Stopwatch from "@/assets/icons/Stopwatch.jsx";
import classes from "@/assets/stylesheets/JobsActivity.module.css";

const JobsButtonSection = ({show}) => {
  if(!show) { return null; }

  return (
    <Button
      variant="subtle"
      color="elv-gray.9"
      fw={400}
      leftSection={<Stopwatch />}
      // TODO: Get dynamic value of job count
      rightSection="(8)"
      classNames={{section: classes.section}}
    >
      Jobs In Progress
    </Button>
  );
};

export default JobsButtonSection;
