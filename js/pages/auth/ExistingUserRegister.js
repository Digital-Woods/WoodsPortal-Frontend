const ExistingUserRegister = ({ setActiveState, entredEmail }) => {
  const [resend, setIsResend] = useState(true);

  const { useSetRecoilState } = Recoil;
  const [serverError, setServerError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { routes, setRoutes } = useRoute();

  const enterEmailValidationSchema = z.object({
    // email: z.string().email().nonempty({
    //   message: "Email is required.",
    // }),
    newPassword: z.string().nonempty({
      message: "New password is required.",
    }),
    confirmPassword: z.string().nonempty({
      message: "Confirm password is required.",
    })
  })
    .refine(
      (data) => data.newPassword === data.confirmPassword,
      {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      }
    );

  const { mutate: login, isLoading } = useMutation({
    mutationKey: ["enterEmailUser"],
    mutationFn: async (input) => {
      try {
        const response = await Client.authentication.existingUserRegister({
          email: entredEmail,
          newPassword: input.newPassword,
          confirmPassword: input.confirmPassword
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      setAlert({ message: data.statusMsg, type: "success" });
      setTimeout(() => {
        // setActiveState('pre-login')
        setIsResend(true)
      }, 1000);
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

  const { mutate: resendEmail, isLoadingResend } = useMutation({
    mutationKey: ["enterEmailUser"],
    mutationFn: async (input) => {
      try {
        const response = await Client.authentication.verifyEmailResend({
          email: entredEmail
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      setAlert({ message: data.statusMsg, type: "success" });
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

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const togglePassword2Visibility = () => {
    setShowPassword2((prevState) => !prevState);
  };

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
      <div className={`dark:bg-gray-900 gap-4 bg-cleanWhite py-8 px-4 flex flex-col items-center justify-center rounded-lg ${isLargeScreen && 'w-[30%]'}  ${isMediumScreen && 'w-[50%]'}  ${isSmallScreen && 'w-[80%]'} `}>
        <div className="">
          <div className="w-[80px]">
            <img src={hubSpotUserDetails.hubspotPortals.portalSettings.smallLogo} alt="Logo" className={`h-auto `} />
          </div>
        </div>
        <p className="text-center">
        { baseCompanyOptions.welcomeMessage || "Welcome" }
        </p>
        {!resend ?
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full">
              <Form
                onSubmit={onSubmit}
                validationSchema={enterEmailValidationSchema}
                serverError={serverError}
                className="dark:bg-gray-900"
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
                            {...register("email")}
                            defaultValue={entredEmail}
                            disabled
                            readonly
                          />
                        </div>
                      </FormControl>
                      {errors.email && (
                        <FormMessage className="text-red-600 dark:text-red-400">
                          {errors.email.message}
                        </FormMessage>
                      )}
                    </FormItem>
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="New Password"
                            icon={passwordIcon}
                            type={showPassword ? "text" : "password"}
                            className=" "
                            {...register("newPassword")}
                          />
                          <span
                            className="absolute right-2 top-2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                          </span>
                        </div>
                      </FormControl>
                      {errors.newPassword && (
                        <FormMessage className="text-red-600 dark:text-red-400">
                          {errors.newPassword.message}
                        </FormMessage>
                      )}
                    </FormItem>
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm Password"
                            icon={passwordIcon}
                            type={showPassword2 ? "text" : "password"}
                            className=" "
                            {...register("confirmPassword")}
                          />
                          <span
                            className="absolute right-2 top-2 cursor-pointer"
                            onClick={togglePassword2Visibility}
                          >
                            {showPassword2 ? <EyeIcon /> : <EyeOffIcon />}
                          </span>
                        </div>
                      </FormControl>
                      {errors.confirmPassword && (
                        <FormMessage className="text-red-600 dark:text-red-400">
                          {errors.confirmPassword.message}
                        </FormMessage>
                      )}
                    </FormItem>
                    <div className="flex justify-end items-center">
                      <div>
                        <NavLink to="/login" onClick={() => setActiveState('pre-login')}>
                          <p className="text-black text-xs dark:text-gray-300">
                            Back to enter email
                          </p>
                        </NavLink>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col justify-center items-center">
                      <Button
                        className="w-full  "
                        isLoading={isLoading}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </div>
          </div>
          :
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-xl font-bold mb-4">Verify your email address</h1>
            <p className=" text-sm text-muted-gray ">
              A verification link has been sent to
            </p>
            <p className="ml-1 text-base">{entredEmail}</p>

            <p className="text-sm text-muted-gray my-6">
              Check your inbox to verify your account
            </p>
            <hr className="w-full" />

            <p className="text-sm text-muted-gray my-6">
              Didn’t receive your email?
            </p>
            <div className="flex justify-between space-x-4">
              <Button
                className="w-[50%]"
                variant="outline"
                onClick={() => setActiveState('pre-login')}
              >
                Cancel
              </Button>
              {/* <Button
                size="small"
                className="flex-1"
                onClick={() => resendEmail()}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Resend'}
              </Button> */}
              <Button
                className="w-[50%]"
                isLoading={isLoadingResend}
                onClick={() => resendEmail()}
              >
                Resend
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  );
};
