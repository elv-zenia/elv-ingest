import {IconProps} from "components/components";

const CircleFilled = ({className, color}: IconProps) => {
  return (
    <svg className={className} color={color} width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="0.5" width="7" height="7" rx="3.5" fill="currentColor"/>
    </svg>

  );
};

export default CircleFilled;
