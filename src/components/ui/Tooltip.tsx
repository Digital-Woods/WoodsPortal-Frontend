import { FC, ReactNode } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

type TooltipProps = {
  children: ReactNode;
  content: string | ReactNode;
  id: string;
  place?: "top" | "right" | "bottom" | "left";
  className?: string;
  variant?: "dark" | "light" | "success" | "warning" | "error" | "info";
  clickable?: boolean;
};

export const Tooltip: FC<TooltipProps> = ({ 
  children="text-xs", 
  content, 
  id, 
  place,
  className = "",
  variant = "dark",
  clickable = false
}) => {
  return (
    <div className="text-xs">
      <div 
        data-tooltip-id={id} 
        data-tooltip-content={typeof content === "string" ? content : undefined}
        className={className}
      >
        {children}
      </div>
      <ReactTooltip 
        id={id} 
        place={place}
        variant={variant}
        clickable={clickable}
      >
        {typeof content !== "string" && content}
      </ReactTooltip>
    </div>
  );
};