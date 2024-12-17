const PreLogin = ({ setActiveState, entredEmail, setEntredEmail }) => {
  const { useSetRecoilState } = Recoil;
  const [serverError, setServerError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { routes, setRoutes } = useRoute();

  const enterEmailValidationSchema = z.object({
    email: z.string().email().nonempty({
      message: "Email is required.",
    }),
  });

  // const { getMe } = useMe();
  // const setUserDetails = useSetRecoilState(userDetailsAtom);

  // const setItemAsync = async (key, value, days = env.COOKIE_EXPIRE) => {
  //   return new Promise((resolve) => {
  //     setCookie(key, value, days);
  //     resolve();
  //   });
  // };

  const { mutate: login, isLoading } = useMutation({
    mutationKey: ["enterEmailUser"],
    mutationFn: async (input) => {
      try {
        const response = await Client.authentication.preLogin({
          email: input.email
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {

      setEntredEmail(data.data.email)
      if (data.data.activeStatus === "ACTIVE" && data.data.emailVerified === true) {
        // window.location.hash = "/login";
        setActiveState('final-login')
      } else {
        // window.location.hash = "/existing-user-register";
        setActiveState('existing-user-register')
      }
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

  // const togglePasswordVisibility = () => {
  //   setShowPassword((prevState) => !prevState);
  // };
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  return (
    <div className="flex items-center bg-flatGray dark:bg-gray-800 justify-center h-screen">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className={`dark:bg-dark-200 gap-4 bg-cleanWhite py-8 px-4 flex flex-col items-center justify-center rounded-lg ${isLargeScreen && 'w-[30%]'}  ${isMediumScreen && 'w-[45%]'}  ${isSmallScreen && 'w-[85%]'} `}>
        <div className="">
          <div className="w-[80px]">
            <img src={hubSpotUserDetails.hubspotPortals.portalSettings.smallLogo} alt="Logo" className={`h-auto `} />
          </div>
        </div>
        <p className="text-center dark:text-white">
          { baseCompanyOptions.welcomeMessage || "Welcome" }
        </p>
        <div className="w-full">
          <Form
            onSubmit={onSubmit}
            validationSchema={enterEmailValidationSchema}
            serverError={serverError}
            className="dark:bg-dark-200"
          >
            {({ register, formState: { errors } }) => (
              <div className="text-gray-800 dark:text-gray-200">
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                    Enter Email
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        height="medium"
                        icon={emailIcon}
                        placeholder="Email"
                        className=""
                        defaultValue={entredEmail}
                        {...register("email")}
                      />
                    </div>
                  </FormControl>
                  {errors.email && (
                    <FormMessage className="text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </FormMessage>
                  )}
                </FormItem>

                <div className="mt-4 flex flex-col justify-center items-center">
                  <Button
                    className="w-full  "
                    isLoading={isLoading}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};
