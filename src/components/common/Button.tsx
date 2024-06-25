import {Text, Button as MantineButton, ButtonProps as MantineButtonProps} from "@mantine/core";
import classes from "@/assets/stylesheets/Button.module.css";
import React, {forwardRef} from "react";

export interface ButtonProps extends MantineButtonProps {
  uppercase?: boolean;
  onClick?: () => null | void;
  type?: "submit" | "button" | "reset";
}

const Button = forwardRef(function Button({
    variant,
    uppercase=false,
    leftSection,
    rightSection,
    onClick,
    children,
    size="md",
    type="button",
    ...rest
  }: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) {
  return (
    <MantineButton
      variant={variant}
      classNames={{root: classes.root}}
      ref={ref}
      size={size}
      leftSection={leftSection}
      rightSection={rightSection}
      onClick={onClick}
      type={type}
      {...rest}
    >
      <Text tt={uppercase ? "uppercase" : "unset"} size="xs" fw="600">
        { children }
      </Text>
    </MantineButton>
  );
});

export default Button;
