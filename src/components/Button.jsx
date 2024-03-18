import {Text, Button as MantineButton} from "@mantine/core";
import classes from "@/assets/stylesheets/Button.module.css";
import {forwardRef} from "react";

const Button = forwardRef(function Button({
    variant,
    label,
    uppercase=false,
    leftSection,
    rightSection,
    onClick,
    ...rest
  }, ref) {
  return (
    <MantineButton
      variant={variant}
      classNames={{root: classes.root}}
      ref={ref}
      leftSection={leftSection}
      rightSection={rightSection}
      onClick={onClick}
      {...rest}
    >
      <Text tt={uppercase ? "uppercase" : "unset"} size="xs" fw="600">{label}</Text>
    </MantineButton>
  );
});

export default Button;
