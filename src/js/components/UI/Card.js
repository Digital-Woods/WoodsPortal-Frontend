const Card = ({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={classNames(
        "max-w-sm bg-cleanWhite border border-gray-200 rounded-lg shadow dark:bg-dark-200 dark:border-gray-700",
        className
      )}
      {...props}
    />
  );
};
