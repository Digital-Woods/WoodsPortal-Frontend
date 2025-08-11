import classNames from "classnames";

export const Card = ({ className, ...props }: any, ref: any) => {
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
