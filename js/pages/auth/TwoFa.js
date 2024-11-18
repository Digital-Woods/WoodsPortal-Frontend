const TwoFa = () => {
  const { useSetRecoilState } = Recoil;
  const [serverError, setServerError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { routes, setRoutes } = useRoute();

  const loginUserValidationSchema = z.object({
    otp: z.string().nonempty({
      message: "OTP is required.",
    }),
  });

  const { tokenData } = getLoggedInDetails()

  // const { getMe, me } = useMe();
  const setUserDetails = useSetRecoilState(userDetailsAtom);

  const setItemAsync = async (key, value, days = env.COOKIE_EXPIRE) => {
    return new Promise((resolve) => {
      setCookie(key, value, days);
      resolve();
    });
  };

  const { mutate: login, isLoading } = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: async (input) => {
      try {
        const response = await Client.authentication.verifyOtp({
          otp: input.otp,
          token: tokenData.token,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      if (!data.data.tokenData.token) {
        setAlert({ message: "Wrong email or password", type: "error" });
        return;
      }

      await setItemAsync(env.AUTH_TOKEN_KEY, data.data.tokenData.token);
      // getMe(); // Fetch user details

      setUserDetails(data.data.loggedInDetails);
      setAlert({ message: "Login successful", type: "success" });

      // Use if-else to check if routes exist
      if (routes && routes.length > 0) {
        const firstRoute = routes[0].path;
        window.location.hash = firstRoute;
      } else {
        window.location.hash = "/no-routes";
      }
    },

    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";

      if (error.response && error.response.data) {
        const errorData = error.response.data.detailedMessage;
        setServerError(errorData);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      setAlert({ message: errorMessage, type: "error" });
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex items-center bg-flatGray dark:bg-gray-800 justify-center h-screen">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="dark:bg-gray-900 bg-cleanWhite py-8 gap-4 px-4 flex flex-col items-center justify-center rounded-lg w-[30%]">
        <div className="w-[50px]">
          <img src={hubSpotUserDetails.hubspotPortals.portalSettings.smallLogo} alt="Logo" className={`h-auto `} />
        </div>
        <div className="w-full">
          <Form
            onSubmit={onSubmit}
            validationSchema={loginUserValidationSchema}
            serverError={serverError}
            className="dark:bg-gray-900"
          >
            {({ register, formState: { errors } }) => (
              <div className="text-gray-800 dark:text-gray-200">
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                    OTP
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        height="medium"
                        icon={passwordIcon}
                        placeholder="OTP"
                        className=""
                        {...register("otp")}
                      />
                    </div>
                  </FormControl>
                  {errors.otp && (
                    <FormMessage className="text-red-600 dark:text-red-400">
                      {errors.otp.message}
                    </FormMessage>
                  )}
                </FormItem>
                <div className="flex justify-end items-center">
                  <div>
                    <NavLink to="/login">
                      <p className="text-black text-xs dark:text-gray-300">
                        Back to Login
                      </p>
                    </NavLink>
                  </div>
                </div>
                <div className="mt-4 flex flex-col justify-center items-center">
                  <Button
                    className="w-full  "
                    isLoading={isLoading}
                  >
                    Login
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
