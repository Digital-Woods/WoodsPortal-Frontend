const variantClasses = {
  default: "bg-secondary text-white dark:bg-dark-400 shadow hover:bg-secondary/90",
  create: `!bg-[${moduleStylesOptions.creatButtonStyles.backgroundColor}] hover:!bg-[${moduleStylesOptions.creatButtonStyles.backgroundColor}]/80 !text-[${moduleStylesOptions.creatButtonStyles.textColor}]`,
  destructive:
    "bg-red-500 text-destructive-foreground shadow-sm hover:bg-red-200",
  outline:
    "border border-input dark:text-white bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-secondary underline-offset-4 hover:underline",
  hubSpot: "text-secondary dark:text-cleanWhite bg-none dark:bg-none rounded-none underline-offset-4 hover:underline flex items-center justify-center",
};

const sizeClasses = {
  default: "h-10 px-6 py-3",
  xsm: "h-6 rounded-md px-2 text-xs",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
  hubSpot: "p-1",
};

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? "span" : "button";

    return (
      <Comp
        className={classNames(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center">
            {" "}
            <span className="">
              {" "}
              <AnimatedCircles />
              {" "}
            </span>
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";
