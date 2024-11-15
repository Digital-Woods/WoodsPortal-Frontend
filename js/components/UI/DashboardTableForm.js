const DashboardTableForm = ({ openModal, setOpenModal, title, path, portalId, hubspotObjectTypeId }) => {

  const [data, setData] = useState([]);

  const { mutate: getData, isLoading } = useMutation({
    mutationKey: [
      "TableFormData"
    ],
    mutationFn: async () => {
      return await Client.form.fields({
        portalId,
        hubspotObjectTypeId: path === '/association' ? getParam('objectTypeId') : hubspotObjectTypeId,
      });
    },

    onSuccess: (response) => {
      if (response.statusCode === "200") {
        setData(
          response.data.sort((a, b) => {
            if (a.primaryDisplayProperty) return -1;
            if (b.primaryDisplayProperty) return 1;
            if (a.secondaryDisplayProperty) return -1;
            if (b.secondaryDisplayProperty) return 1;
            return 0;
          })
        )
      }
    },
    onError: () => {
      setData([]);
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const [serverError, setServerError] = useState(null);
  const [alert, setAlert] = useState(null);
  const { z } = Zod;

  const createValidationSchema = (data) => {
    const schemaShape = {};

    data.forEach((field) => {
      if (field.requiredProperty && field.type === 'string') {
        // Add validation for required fields based on your criteria
        schemaShape[field.name] = z.string().nonempty({
          message: `${field.customLabel || field.label} is required.`,
        });
      }
      // Add more field types as needed, such as numbers, booleans, etc.
      // Example:
      // if (field.type === 'number') {
      //   schemaShape[field.name] = z.number().min(1, {
      //     message: `${field.customLabel || field.label} must be at least 1.`,
      //   });
      // }
    });

    return z.object(schemaShape);
  };

  const validationSchema = createValidationSchema(data);

  const { mutate: login, isLoading: submitLoading } = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: async (input) => {
      try {
        const response = await Client.authentication.login({
          username: input.email,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      setAlert({ message: "Login successful", type: "success" });
    },

    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";

      if (error.response && error.response.data) {
        const errorData = error.response.data.detailedMessage;
        const errors = error.response.data.errors;
        setServerError(errors);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      setAlert({ message: errorMessage, type: "error" });
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <Dialog open={openModal} onClose={setOpenModal} className="bg-custom-gradient rounded-md sm:min-w-[600px]">
        <div className="rounded-md flex-col gap-6 flex">
          <h3 className="text-start text-xl dark:text-white font-semibold">
            Add new {title}
          </h3>
          {isLoading ?
            <div className="loader-line"></div>
            :
            <div className="w-full text-left">
              <Form
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                serverError={serverError}
                className="dark:bg-[#181818]"
              >
                {({ register, formState: { errors } }) => (
                  <div>
                    <div className="text-gray-800 dark:text-gray-200 grid gap-x-4 grid-cols-2">
                      {data.map((filled) => (
                        <div>
                          <FormItem className="mb-0">
                            <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                              {filled.customLabel}
                            </FormLabel>
                            <FormControl>
                              <div>
                                <Input
                                  height="medium"
                                  placeholder={filled.customLabel}
                                  className=""
                                  {...register(filled.name)}
                                />
                              </div>
                            </FormControl>
                            {errors[filled.name] && (
                              <FormMessage className="text-red-600 dark:text-red-400">
                                {errors[filled.name].message}
                              </FormMessage>
                            )}
                          </FormItem>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end items-end gap-1">
                      <Button
                        variant="outline"
                        onClick={() => setOpenModal(false)}
                      >
                        Close
                      </Button>
                      <Button
                        className="!bg-defaultPrimary"
                        isLoading={submitLoading}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </div>
          }
        </div>
      </Dialog>
    </div>
  );
};
