import { Controller, useForm } from 'react-hook-form';
import { useEffect, forwardRef, useState } from 'react';
import classNames from 'classnames';
import { NumericInput } from './NumericInput';

export const Form = ({
  onSubmit,
  children,
  useFormProps,
  validationSchema,
  serverError,
  resetFields,
  initialValues = {},
  formName = '',
  ...formProps
}: any) => {
  const zodResolver = (schema: any) => async (data: any) => {
    try {
      const values = schema.parse(data);
      return { values, errors: {} };
    } catch (e: any) {
      return {
        values: {},
        errors: e?.errors.reduce((acc: any, error: any) => {
          acc[error?.path[0]] = { type: error?.code, message: error?.message };
          return acc;
        }, {}),
      };
    }
  };

  const methods = useForm({
    ...useFormProps,
    ...(validationSchema && {
      resolver: zodResolver(validationSchema),
      defaultValues: initialValues
    }),
  });
  useEffect(() => {
    if (serverError) {
      Object.entries(serverError).forEach(([key, value]: any) => {
        methods.setError(key, {
          type: "manual",
          message: value,
        });
      });
    }
  }, [serverError, methods]);

  useEffect(() => {
    if (resetFields) {
      methods.reset(resetFields);
    }
  }, [resetFields, methods]);

  return (
    <form
      noValidate
      onSubmit={methods.handleSubmit(onSubmit)}
      // {...formProps}
      id={`${formName}`}
    >
      {children(methods)}
    </form>
  );
};

export const FormItem = ({ children, className }: any) => (
  <div className={`${className}`}>{children}</div>
);

export const FormLabel = ({ children, className }: any) => (
  <label
    className={`block mb-2 text-sm font-medium dark:text-white ${className}`}
  >
    {children}
  </label>
);

export const FormControl = ({ children, className }: any) => (
  <div className={` ${className}`}>{children}</div>
);

export const FormMessage = ({ children, className }: any) => (
  <p className="mt-2 text-sm text-red-600 dark:text-red-500">{children}</p>
);

export const Input = forwardRef(
  (
    {
      className,
      type = "text",
      defaultValue = "",
      placeholder = "Search",
      height = "medium",
      icon: Icon = '',
      variant = 'normal',
      control = null,
      ...rest
    }: any,
    ref
  ) => {
    const heightDynamicClassName: any = {
      small: "py-1",
      semiMedium: "py-2",
      medium: "py-2",
      large: "py-5",
    };

    const mainDynamicClassName = {
      root: 'w-full rounded-md bg-cleanWhite px-2 text-base transition-colors border border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2',
      normal: '',
    };

    const paddingLeftDynamicClassName = "pl-8";

    const rootClassName = classNames(
      mainDynamicClassName.root,
      {
        [mainDynamicClassName.normal]: variant === 'normal',
      },
      Icon && paddingLeftDynamicClassName,
      heightDynamicClassName[height],
      className
    );
    delete rest.className;

    return (
      <div className="relative dark:bg-dark-300 flex items-center rounded-lg max-sm:w-full">
        {Icon && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <Icon className="h-6 w-6 text-gray-500" />
          </div>
        )}
        {console.log('defaultValue', defaultValue)}
        {type === 'number' ?
          <Controller
            control={control}
            name={rest?.name}
            defaultValue={defaultValue}
            render={({ field }) => (
              <NumericInput
                ref={ref}
                value={field.value}
                placeholder={placeholder}
                className={rootClassName}
                onChange={(value) => {
                  field.onChange(value)
                }}
              />
            )
            }
          />
          :
          <input
            defaultValue={defaultValue}
            type={type}
            placeholder={placeholder}
            className={rootClassName}
            ref={ref}
            {...rest}
          />
        }
      </div>
    );
  }
);

export const Textarea = forwardRef(
  (
    { className, placeholder = "Leave a comment...", rows = 4, ...rest }: any,
    ref
  ) => {
    return (
      <textarea
        rows={rows}
        className={classNames(
          "w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2",
          className
        )}
        placeholder={placeholder}
        ref={ref}
        {...rest}
      />
    );
  }
);
