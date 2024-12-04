const FirstNameIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    className="fill-black dark:fill-white"
  >
    <path d="M480-492.31q-51.75 0-87.87-36.12Q356-564.56 356-616.31q0-51.75 36.13-87.87 36.12-36.13 87.87-36.13 51.75 0 87.87 36.13Q604-668.06 604-616.31q0 51.75-36.13 87.88-36.12 36.12-87.87 36.12ZM212-219.69v-72.93q0-18.38 10.96-35.42 10.96-17.04 30.66-29.5 52.3-30.07 109.94-46.11t116.23-16.04q58.59 0 116.44 16.04 57.85 16.04 110.15 46.11 19.7 11.46 30.66 29T748-292.62v72.93H212Zm52-52h432v-20.93q0-6.33-4.56-11.91-4.57-5.58-12.59-9.47-43.7-26.46-94.42-40.08Q533.7-367.69 480-367.69q-53.7 0-104.43 13.61-50.72 13.62-94.42 40.08-8.07 5.54-12.61 10.61-4.54 5.07-4.54 10.77v20.93Zm216.21-272.62q29.79 0 50.79-21.21t21-51q0-29.79-21.21-50.79t-51-21q-29.79 0-50.79 21.22-21 21.21-21 51 0 29.78 21.21 50.78t51 21Zm-.21-72Zm0 344.62Z" />
  </svg>
);

const SecondNameIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    className="fill-black dark:fill-white"
  >
    <path d="M480-492.31q-51.75 0-87.87-36.12Q356-564.56 356-616.31q0-51.75 36.13-87.87 36.12-36.13 87.87-36.13 51.75 0 87.87 36.13Q604-668.06 604-616.31q0 51.75-36.13 87.88-36.12 36.12-87.87 36.12ZM212-219.69v-72.93q0-18.38 10.96-35.42 10.96-17.04 30.66-29.5 52.3-30.07 109.94-46.11t116.23-16.04q58.59 0 116.44 16.04 57.85 16.04 110.15 46.11 19.7 11.46 30.66 29T748-292.62v72.93H212Zm52-52h432v-20.93q0-6.33-4.56-11.91-4.57-5.58-12.59-9.47-43.7-26.46-94.42-40.08Q533.7-367.69 480-367.69q-53.7 0-104.43 13.61-50.72 13.62-94.42 40.08-8.07 5.54-12.61 10.61-4.54 5.07-4.54 10.77v20.93Zm216.21-272.62q29.79 0 50.79-21.21t21-51q0-29.79-21.21-50.79t-51-21q-29.79 0-50.79 21.22-21 21.21-21 51 0 29.78 21.21 50.78t51 21Zm-.21-72Zm0 344.62Z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    className="fill-black dark:fill-white"
  >
    <path d="M180.31-212q-27.01 0-45.66-18.66Q116-249.32 116-276.35v-407.62q0-27.03 18.65-45.53t45.66-18.5h599.38q27.01 0 45.66 18.66Q844-710.68 844-683.65v407.62q0 27.03-18.65 45.53T779.69-212H180.31ZM480-449.69 168-633.31v357q0 5.39 3.46 8.85t8.85 3.46h599.38q5.39 0 8.85-3.46t3.46-8.85v-357L480-449.69Zm0-67.31 305.85-179h-611.7L480-517ZM168-633.31V-696v419.69q0 5.39 3.46 8.85t8.85 3.46H168v-369.31Z" />
  </svg>
);

const EditButton = ({ onClick }) => (
  <Button
    variant="outline"
    size="sm"
    className="text-secondary dark:text-white"
    onClick={onClick}
  >
    Edit
  </Button>
);

const SaveButton = ({ onClick }) => (
  <Button
    variant="outline"
    size="sm"
    className="text-secondary dark:text-white"
    onClick={onClick}
  >
    Save
  </Button>
);

const ProfileUpdate = () => {
  const [isEditPersonalInfo, setIsEditPersonalInfo] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { me, getMe } = useMe();
  const loggedInDetails = useRecoilValue(userDetailsAtom);

  const validationSchema = z.object({
    firstName: z.string().min(2, {
      message: "First Name should be more than 2 letters",
    }),
    lastName: z.string().min(1, {
      message: "Last Name should be more than 2 letters",
    }),
  });

  const {
    mutate: updateProfile,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data) => Client.profile.update(data),
    onSuccess: (response) => {
      getMe();
      setAlertMessage(response.statusMsg || "Profile updated successfully");
      setShowAlert(true);
      setIsEditPersonalInfo(false);
    },
    onError: (error) => {
      setAlertMessage("Error updating profile");
      setShowAlert(true);
    },
  });

  const handleSaveChanges = (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
    };

    updateProfile(payload);
    getMe();
  };

  const handleButtonClick = () => {
    if (isEditPersonalInfo) {
    } else {
      setIsEditPersonalInfo(true);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSaveChanges} validationSchema={validationSchema}>
        {({ register, formState: { errors } }) => (
          <div className="p-5 dark:bg-dark-300 bg-cleanWhite rounded-md dark:text-white">
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold dark:text-white pb-4">
                Personal Information
              </h1>
              {/* {isEditPersonalInfo ? (
                <SaveButton onClick={handleButtonClick} isLoading={isLoading} />
              ) : (
                <EditButton onClick={handleButtonClick} />
              )} */}
            </div>

            <div>
              <FormItem className="!mb-0 py-2 flex md:flex-row flex-col  md:items-center items-start">
                <FormLabel className="text-xs font-semibold md:w-[200px]">
                  First Name:
                </FormLabel>
                {isEditPersonalInfo ? (
                  <FormControl className="flex flex-col items-center w-[230px]">
                    <Input
                      icon={FirstNameIcon}
                      type="text"
                      defaultValue={getFirstName()}
                      placeholder="First Name"
                      {...register("firstName")}
                      className="text-xs text-gray-500 dark:text-cleanWhite ml-2 w-full"
                    />
                    {errors.firstName && (
                      <div className="text-red-600 text-[12px] px-2 mt-1 max-w-full">
                        {errors.firstName.message}
                      </div>
                    )}
                  </FormControl>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-cleanWhite">
                    {getFirstName() || "N/A"}
                  </div>
                )}
              </FormItem>

              <FormItem className="!mb-0 py-2 flex md:flex-row flex-col  md:items-center items-start">
                <FormLabel className="text-xs font-semibold md:w-[200px]">
                  Last Name:
                </FormLabel>
                {isEditPersonalInfo ? (
                  <FormControl className="flex flex-col items-center w-[230px]">
                    <Input
                      icon={SecondNameIcon}
                      type="text"
                      defaultValue={getLastName()}
                      placeholder="Last Name"
                      {...register("lastName")}
                      className="text-xs text-gray-500 dark:text-cleanWhite ml-2 w-full"
                    />
                    {errors.lastName && (
                      <div className="text-red-600 text-[12px] dark:text-cleanWhite px-2 mt-1 max-w-full">
                        {errors.lastName.message}
                      </div>
                    )}
                  </FormControl>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-cleanWhite">
                    {getLastName() || "N/A"}
                  </div>
                )}
              </FormItem>
            </div>
          </div>
        )}
      </Form>

      {showAlert && (
        <Alert
          duration={1000}
          message={alertMessage}
          type={isSuccess ? "success" : "error"}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};
