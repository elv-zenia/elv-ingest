import {Text, Button as MantineButton} from "@mantine/core";
import classes from "@/assets/stylesheets/Button.module.css";

const Button = ({variant, label}) => {
  return (
    <MantineButton variant={variant} classNames={{root: classes.root}}>
      <Text tt="uppercase" size="xs" fw="600">{label}</Text>
    </MantineButton>
  );
};

export default Button;
