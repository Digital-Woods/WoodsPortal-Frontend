const PreLogin = ({ setActiveState, entredEmail, setEntredEmail, setloginData }) => {
  const [serverError, setServerError] = useState(null);
  const { setToaster } = useToaster();

  const enterEmailValidationSchema = z.object({
    email: z.string().email().nonempty({
      message: "Email is required.",
    }),
  });

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
      setloginData(data?.data)
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
        const errors = error.response.data.validationErrors;
        setServerError(errors);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      setToaster({ message: errorMessage, type: "error" });
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
      <div className={`dark:bg-dark-200 gap-4 bg-cleanWhite py-8 px-4 flex flex-col items-center justify-center rounded-lg ${isLargeScreen && 'w-[30%]'}  ${isMediumScreen && 'w-[45%]'}  ${isSmallScreen && 'w-[85%]'} `}>
        <div className="">
          <div className="w-[200px]">
            <img
              src={hubSpotUserDetails.hubspotPortals.portalSettings.authPopupFormLogo}
              alt="Light Mode Logo"
              className="h-auto dark:hidden"
            />
            <img
              src={hubSpotUserDetails.hubspotPortals.portalSettings.logo}
              alt="Dark Mode Logo"
              className="h-auto hidden dark:block"
            />
          </div>
        </div>
        <p className="text-center dark:text-white">
          {baseCompanyOptions.welcomeMessage || ""}
        </p>
        <div className="w-full">
          <Form
            onSubmit={onSubmit}
            validationSchema={enterEmailValidationSchema}
            serverError={serverError}
            className="dark:bg-dark-200"
            formName={`login-form-submited`}
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
                        autoFocus
                        height="medium"
                        icon={emailIcon}
                        placeholder="Email"
                        defaultValue={entredEmail}
                        {...register("email")}
                        onChange={(e) => {
                          e.target.value = e.target.value.toLowerCase();
                          register('email').onChange(e);
                        }}
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
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </Form>
          {baseCompanyOptions?.createAccountBool &&
            <p className="mt-6 mb-0 text-xs dark:text-white flex gap-1 relative items-center justify-center flex-wrap">
              Don't have an Account?
              <span className="text-secondary hover:underline">
              {ReactHtmlParser.default(baseCompanyOptions?.createAccountLink)}
              </span>
            </p>
          }
        </div>
      </div>
    </div>
  );
};
