const CurrentpassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    className="fill-black dark:fill-white"
  >
    <path d="M288-399.39q-33.85 0-57.23-23.38-23.38-23.38-23.38-57.23 0-33.85 23.38-57.23 23.38-23.38 57.23-23.38 33.85 0 57.23 23.38 23.38 23.38 23.38 57.23 0 33.85-23.38 57.23-23.38 23.38-57.23 23.38ZM288-260q-91.54 0-155.77-64.23T68-480q0-91.54 64.23-155.77T288-700q62.31 0 114.81 32.69 52.5 32.7 80.88 87.31h352.08l100 100-153.85 141.07-78.23-55.76-68.15 56.53L546.46-404h-50.77q-19.38 67.23-78.38 105.61Q358.31-260 288-260Zm0-52q64.54 0 112.15-41.27 47.62-41.27 53.47-102.73h110.69l69.61 50.85 67.16-55.16L779-405.38 860.62-481l-46-47h-366q-17.85-51.46-60.97-85.73Q344.54-648 288-648q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
  </svg>
);

const ConfirmandCurrentPassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    className="fill-black dark:fill-white"
  >
    <path d="M276.03-116q-26.64 0-45.34-18.84Q212-153.69 212-180.31v-359.38q0-26.62 18.84-45.47Q249.69-604 276.31-604H308v-96q0-71.6 50.27-121.8Q408.53-872 480.23-872q71.69 0 121.73 50.2Q652-771.6 652-700v96h31.69q26.62 0 45.47 18.84Q748-566.31 748-539.69v359.38q0 26.62-18.86 45.47Q710.29-116 683.65-116H276.03Zm.28-52h407.38q5.39 0 8.85-3.46t3.46-8.85v-359.38q0-5.39-3.46-8.85t-8.85-3.46H276.31q-5.39 0-8.85 3.46t-3.46 8.85v359.38q0 5.39 3.46 8.85t8.85 3.46Zm203.9-130q25.94 0 43.87-18.14Q542-334.27 542-360.21t-18.14-43.87Q505.73-422 479.79-422t-43.87 18.14Q418-385.73 418-359.79t18.14 43.87Q454.27-298 480.21-298ZM360-604h240v-96q0-50-35-85t-85-35q-50 0-85 35t-35 85v96Zm-96 436v-384 384Z" />
  </svg>
);

const ChangePassword = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // State variables to manage form input values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State variables to manage password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValidationSchema = z
    .object({
      currentPassword: z
        .string()
        .min(6, { message: "Current password is required" }),
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

  const {
    mutate: changePassword,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data) => Client.authentication.changePassword(data),
    onSuccess: (response) => {
      setAlertMessage(response.statusMsg || "Password updated successfully");
      setShowAlert(true);
      // Clear input fields on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      let errorMessage = "Error updating password";
      if (
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMessage = error.response.data.errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setAlertMessage(errorMessage);
      setShowAlert(true);
    },
  });

  const handleSubmit = () => {
    const payload = {
      currentPassword: String(currentPassword),
      newPassword: String(newPassword),
      confirmPassword: String(confirmPassword),
    };

    changePassword(payload);
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prevState) => !prevState);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  return (
    <div>
      {showAlert && (
        <Alert
          duration={1000}
          message={alertMessage}
          type={isSuccess ? "success" : "error"}
          onClose={() => setShowAlert(false)}
        />
      )}

      <Form onSubmit={handleSubmit} validationSchema={passwordValidationSchema}>
        {({ register, formState: { errors } }) => (
          <div className="p-5 dark:bg-dark-300 bg-cleanWhite rounded-md  dark:text-white">
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold dark:text-white pb-4">
                Password Information
              </h1>
              <Button
                variant="outline"
                size="sm"
                className="text-secondary dark:text-white"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>

            <div>
              <FormItem className="!mb-0 py-2 flex md:flex-row flex-col  md:items-center items-start">
                <FormLabel className="text-xs font-semibold w-[200px]">
                  Current Password
                </FormLabel>
                <FormControl className="flex flex-col items-center w-[230px]">
                  <div className="relative w-full">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Current Password"
                      {...register("currentPassword")}
                      className="text-xs text-gray-500 md:ml-2 w-full !px-10"
                      icon={CurrentpassIcon}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <span
                      className="absolute right-3 top-2 cursor-pointer"
                      onClick={toggleCurrentPasswordVisibility}
                    >
                      {showCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </span>
                    {errors.currentPassword && (
                      <div className="text-red-600 text-[12px] px-2 mt-1 max-w-[calc(100%-16px)]">
                        {errors.currentPassword.message}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>

              <FormItem className="!mb-0 py-2 flex md:flex-row flex-col  md:items-center items-start">
                <FormLabel className="text-xs font-semibold w-[200px]">
                  New Password
                </FormLabel>
                <FormControl className="flex flex-col items-center w-[230px]">
                  <div className="relative w-full">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New password"
                      {...register("newPassword")}
                      className="text-xs text-gray-500 md:ml-2 !px-10 w-full"
                      icon={ConfirmandCurrentPassIcon}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      className="absolute right-2 top-2 cursor-pointer"
                      onClick={toggleNewPasswordVisibility}
                    >
                      {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </span>
                    {errors.newPassword && (
                      <div className="text-red-600 text-[12px] px-2  mt-1 max-w-[calc(100%-16px)]">
                        {errors.newPassword.message}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>

              <FormItem className="!mb-0 py-2 flex md:flex-row flex-col  md:items-center items-start">
                <FormLabel className="text-xs font-semibold w-[200px]">
                  Confirm New Password
                </FormLabel>
                <FormControl className="flex flex-col items-center w-[230px]">
                  <div className="relative w-full">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...register("confirmPassword")}
                      className="text-xs text-gray-500 md:ml-2 !px-10 w-full"
                      icon={ConfirmandCurrentPassIcon}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      className="absolute right-2 top-2 cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </span>
                    {errors.confirmPassword && (
                      <div className="text-red-600 text-[12px] px-2 mt-1 max-w-[calc(100%-16px)]">
                        {errors.confirmPassword.message}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};
