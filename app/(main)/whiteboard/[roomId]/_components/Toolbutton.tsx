"use client";

import { LucideIcon } from "lucide-react";
import { Button, Tooltip } from "@nextui-org/react";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
}: ToolButtonProps) => {
  return (
    <Tooltip content={label} placement="right">
      <Button
        isIconOnly
        disabled={isDisabled}
        onClick={onClick}
        color={isActive ? "primary" : "default"}
      >
        <Icon />
      </Button>
    </Tooltip>
  );
};
