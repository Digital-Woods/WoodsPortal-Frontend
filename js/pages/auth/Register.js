const { z } = Zod;

const registerUserValidationSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

const Register = () => {
  let [serverError, setServerError] = useState(null);

  const { mutate: addUser, isLoading } = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async (input) => await Client.authentication.register(input),
    onSuccess: (data) => {
      console.log("data", data);
    },
    onError: (error) => {
      setServerError(error.response.data);
    },
  });

  const onSubmit = (data) => {
    addUser(data);
  };

  return (
    <div className="bg-light-100 dark:bg-dark-200 p-5">
      <Form
        onSubmit={onSubmit}
        validationSchema={registerUserValidationSchema}
        serverError={serverError}
        className="bg-light-100 dark:bg-dark-200"
      >
        {({ register, formState: { errors } }) => (
          <div>
            <div className="text-dark dark:text-white">
              <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                Register
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600  dark:text-white">
                Use a permanent address where you can receive mail.
              </p>

              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...register("name")} />
                </FormControl>
                {errors.name && (
                  <FormMessage className="text-red-600">
                    {errors.name.message}
                  </FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...register("email")} />
                </FormControl>
                {errors.email && (
                  <FormMessage className="text-red-600">
                    {errors.email.message}
                  </FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...register("password")} />
                </FormControl>
                {errors.password && (
                  <FormMessage className="text-red-600">
                    {errors.password.message}
                  </FormMessage>
                )}
              </FormItem>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button href="/home">Home</Button>
              <Button type="submit" isLoading={isLoading}>
                Submit
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};
