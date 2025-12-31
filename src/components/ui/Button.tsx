import { forwardRef } from 'react';
import classNames from 'classnames';
import { AnimatedCircles } from '@/assets/icons/animateCircles'

const classesDynamicClassName = {
  root: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  normal: "",
};

const variantDynamicClassName: any = {
  default:
    "bg-primary text-[var(--button-text-color)] dark:border dark:bg-dark-400 dark:hover:bg-dark-400 shadow hover:bg-primary/90",
  create:
   "CUSTOM-create-button-background-color CUSTOM-create-button-text-color",
  destructive:
    "bg-red-500 text-destructive-foreground shadow hover:bg-red-200",
  outline:
    "border border-input text-foreground dark:text-white bg-transparent shadow hover:bg-accent hover:text-accent-foreground dark:bg-dark-400 dark:hover:bg-dark-400",
  secondary:
    "bg-secondary text-[var(--button-text-color)] shadow hover:bg-secondary/80 dark:border dark:bg-dark-400 dark:hover:bg-dark-400",
  ghost:
    "hover:bg-accent hover:text-accent-foreground",
  link:
    "text-secondary underline-offset-4 hover:underline dark:text-white bg-transparent dark:bg-transparent rounded-none hover:bg-transparent dark:hover:bg-transparent",
  hubSpot:
    "text-primary dark:text-cleanWhite bg-transparent dark:bg-transparent rounded-none underline-offset-4 hover:underline flex items-center justify-center",
};

const sizeDynamicClassName : any = {
  default: "h-10 px-6 py-3",
  xsm: "h-6 rounded-md px-2 text-xs",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
  link: "p-0 hover:p-0",
  hubSpot: "p-1",
};

export const Button = forwardRef((props: any, ref: any) => {
  const {
    className,
    variant = "default",
    size = "default",
    asChild = false,
    isLoading = false,
    disabled = false,
    children,
    ...rest
  } : any = props;

  const classesName = classNames(
    classesDynamicClassName.root, // Base classes
    variantDynamicClassName[variant], // Dynamic variant classes
    sizeDynamicClassName[size], // Dynamic size classes
    className // User-defined classes (last for priority)
  );

  delete rest.className;
  const Comp = asChild ? "span" : "button";

  return (
    <div>
      <Comp
        className={classNames(classesName)}
        ref={ref}
        disabled={isLoading || props?.disabled}
        {...rest}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <AnimatedCircles />
            {children}
          </div>
        ) : (
          children
        )}
      </Comp>
    </div>
  );
});

