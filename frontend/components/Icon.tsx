import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface IconProps {
  icon: IconDefinition;
  className?: string;
  size?: "xs" | "sm" | "lg" | "xl" | "2xl";
}

export function Icon({ icon, className = "", size = "sm" }: IconProps) {
  return <FontAwesomeIcon icon={icon} size={size} className={className} />;
}
