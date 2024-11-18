const ResetPassword = () => {
  const [serverError, setServerError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordValidationSchema = z
    .object({
      newPassword: z
        .string()
        .min(6, { message: "It should be 6 characters long" })
        .regex(/[A-Z]/, {
          message: "Must contain at least one uppercase letter",
        })
        .regex(/\d/, { message: "Must contain at least one number" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: "Must contain at least one special character",
        }),
      confirmPassword: z
        .string()
        .min(6, { message: "Please confirm your new password" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "New passwords don't match",
      path: ["confirmPassword"],
    });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const getTokenFromParams = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    let token = params.get("token");

    if (token) {
      token = token.replace(/ /g, "+");
      return decodeURIComponent(token);
    }

    return null;
  };

  const { mutate: resetNewPassword, isLoading } = useMutation({
    mutationKey: ["resetNewPassword"],
    mutationFn: async (input) => {
      const token = getTokenFromParams();
      if (!token) {
        throw new Error("Token not found");
      }
      console.log("Token Passed to API:", token);
      try {
        const response = await Client.authentication.resetPassword({
          newPassword: input.newPassword,
          confirmPassword: input.confirmPassword,
          token: token,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      setAlert({ message: "Password reset successful", type: "success" });
      window.location.hash = "/login";
    },
    onError: (error) => {
      console.error("Error:", error); // Log the error to inspect
      setAlert({ message: "Failed to reset password", type: "error" });
    },
  });

  useEffect(() => {
    const token = getTokenFromParams();
    if (!token) {
      window.location.hash = "/login";
    }
  }, []);

  const onSubmit = (data) => {
    console.log("Submitting Data:", data);
    resetNewPassword(data);
  };

  // useEffect(() => {
  //   const token = getTokenFromParams();
  //   if (!token) {
  //     window.location.hash = "/login";
  //   }
  // }, []);

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
            validationSchema={resetPasswordValidationSchema}
            serverError={serverError}
            className="dark:bg-gray-900"
          >
            {({ register, formState: { errors } }) => (
              <div className="text-gray-800 dark:text-gray-200">
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
                        type={showConfirmPassword ? "text" : "password"}
                        className=" "
                        {...register("confirmPassword")}
                      />
                      <span
                        className="absolute right-2 top-2 cursor-pointer"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </span>
                    </div>
                  </FormControl>
                  {errors.confirmPassword && (
                    <FormMessage className="text-red-600 dark:text-red-400">
                      {errors.confirmPassword.message}
                    </FormMessage>
                  )}
                </FormItem>

                <div className="mt-4 flex flex-col justify-center items-center">
                  <Button
                    className="w-full  "
                    isLoading={isLoading}
                  >
                    Reset Password
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
