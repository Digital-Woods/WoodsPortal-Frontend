import React from 'react';
import classNames from 'classnames';

export const Table = React.forwardRef(
  ({ className, ...props }: any, ref) => (
    <div className="">
      <table
        ref={ref}
        className={classNames("caption-bottom dark:bg-[#2a2a2a] text-sm", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef(
  ({ className, ...props }: any, ref) => (
    <thead ref={ref} className={classNames("[&_tr]:border-b", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef(
  ({ className, ...props }: any, ref) => (
    <tbody
      ref={ref}
      className={classNames("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef(
  ({ className, ...props }: any, ref) => (
    <tfoot
      ref={ref}
      className={classNames(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef(
  ({ className, ...props }: any, ref) => (
    <tr
      ref={ref}
      className={classNames(
        "border-b dark:border-gray-600 py-4 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef( 
  ({ className, ...props }: any, ref) => (
    <th
      ref={ref}
      className={classNames(
        " px-4 text-left align-middle font-[600] text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef(
  ({ className, ...props }: any, ref) => (
    <td
      ref={ref}
      className={classNames("px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 border-b", className)}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef(
  ({ className, ...props }: any, ref) => (
    <caption
      ref={ref}
      className={classNames("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
TableCaption.displayName = "TableCaption";

