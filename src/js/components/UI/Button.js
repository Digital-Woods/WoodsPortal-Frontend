const classes = {
  root: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  normal: "",
};

const variantClasses = {
  default:
    "bg-primary text-white dark:bg-dark-400 shadow hover:bg-primary/90",
  create: `!bg-[${moduleStylesOptions.creatButtonStyles.backgroundColor}] hover:!bg-[${moduleStylesOptions.creatButtonStyles.backgroundColor}]/80 !text-[${moduleStylesOptions.creatButtonStyles.textColor}]`,
  destructive:
    "bg-red-500 text-destructive-foreground shadow-sm hover:bg-red-200",
  outline:
    "border border-input dark:text-white bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline dark:text-white",
  hubSpot:
    "text-primary dark:text-cleanWhite bg-none dark:bg-none rounded-none underline-offset-4 hover:underline flex items-center justify-center",
};

const sizeClasses = {
  default: "h-10 px-6 py-3",
  xsm: "h-6 rounded-md px-2 text-xs",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
  link: "p-0",
  hubSpot: "p-1",
};

const Button = React.forwardRef((props, ref) => {
  const {
    className,
    variant = "default",
    size = "default",
    asChild = false,
    isLoading = false,
    children,
    ...rest
  } = props;

  const classesName = classNames(
    classes.root, // Base classes
    variantClasses[variant], // Dynamic variant classes
    sizeClasses[size], // Dynamic size classes
    className // User-defined classes (last for priority)
  );

  delete rest.className;
  const Comp = asChild ? "span" : "button";

  return (
    <div>
      <Comp
        className={classNames(classesName)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...rest}
      >
        {isLoading ? (
          <div className="flex items-center">
            {" "}
            <span className="">
              {" "}
              <AnimatedCircles />{" "}
            </span>
          </div>
        ) : (
          children
        )}
      </Comp>
    </div>
  );
});

