const { useForm } = ReactHookForm;

const Form = ({
  onSubmit,
  children,
  useFormProps,
  validationSchema,
  serverError,
  resetFields,
  initialValues = {},
  ...formProps
}) => {
  const zodResolver = (schema) => async (data) => {
    try {
      const values = schema.parse(data);
      return { values, errors: {} };
    } catch (e) {
      return {
        values: {},
        errors: e.errors.reduce((acc, error) => {
          acc[error.path[0]] = { type: error.code, message: error.message };
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
      Object.entries(serverError).forEach(([key, value]) => {
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
      className="m-0"
    >
      {children(methods)}
    </form>
  );
};

const FormItem = ({ children, className }) => (
  <div className={`mb-5 ${className}`}>{children}</div>
);

const FormLabel = ({ children, className }) => (
  <label
    className={`block mb-2 text-sm font-medium dark:text-white ${className}`}
  >
    {children}
  </label>
);

const FormControl = ({ children, className }) => (
  <div className={` ${className}`}>{children}</div>
);

const FormMessage = ({ children, className }) => (
  <p class="mt-2 text-sm text-red-600 dark:text-red-500">{children}</p>
);

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      placeholder = "Search",
      height = "medium",
      icon: Icon = '',
      variant = 'normal',
      ...rest
    },
    ref
  ) => {
    const heightClasses = {
      small: "py-1",
      semiMedium: "py-2",
      medium: "py-2",
      large: "py-5",
    };

    const classes = {
      root: 'w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2',
      normal: '',
    };

    const rootClassName = classNames(
      classes.root,
      {
        [classes.normal]: variant === 'normal',
      },
      Icon && "pl-10",
      heightClasses[height],
      className
    );
    delete rest.className;
    return (
      <div className="relative dark:bg-dark-300 flex items-center rounded-md max-sm:w-full">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="h-6 w-6 text-gray-500" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={rootClassName}
          ref={ref}
          {...rest}
        />
      </div>
    );
  }
);

const Textarea = React.forwardRef(
  (
    { className, placeholder = "Leave a comment...", rows = 4, ...rest },
    ref
  ) => {
    return (
      <textarea
        rows={rows}
        className={classNames(
          "block p-2.5 w-full text-xs text-gray-900 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-cleanWhite  border border-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          className
        )}
        placeholder={placeholder}
        ref={ref}
        {...rest}
      />
    );
  }
);
