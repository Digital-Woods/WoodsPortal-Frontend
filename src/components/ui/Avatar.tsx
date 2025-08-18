import React, { forwardRef } from "react";
import classNames from "classnames";

interface AvatarProps {
  src: string;
  type?: "rounded-full" | "red" | "bordered";
  className?: string;
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ src, type = "rounded-full", className }, ref) => {
    const avatarType = () => {
      switch (type) {
        case "red":
          return "rounded";
        case "bordered":
          return "rounded-full ring-2 ring-gray-300 dark:ring-gray-500";
        default:
          return "rounded-full";
      }
    };

    return (
      <img
        ref={ref}
        className={classNames("w-15", className, avatarType())}
        src={src}
        alt=""
      />
    );
  }
);

Avatar.displayName = "Avatar";
