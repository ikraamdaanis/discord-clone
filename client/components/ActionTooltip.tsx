import { TooltipProviderProps } from "@radix-ui/react-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "components/ui/tooltip";
import React, { ReactNode } from "react";

interface ActionTooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  toolTipProps?: Omit<TooltipProviderProps, "children">;
}

/** Generic tooltip. */
export const ActionTooltip = ({
  label,
  children,
  side,
  align,
  toolTipProps
}: ActionTooltipProps) => {
  return (
    <TooltipProvider {...toolTipProps}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} className="max-sm:hidden">
          <p className="text-sm font-semibold">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
