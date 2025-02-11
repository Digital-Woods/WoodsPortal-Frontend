const NotVerifiedEmail = () => {
  const { me } = useMe();
  const loggedInDetails = useRecoilValue(userDetailsAtom);
  const [alert, setAlert] = useState(null);
  const [serverError, setServerError] = useState(null);

  let email = "no-email@example.com";

  if (loggedInDetails && loggedInDetails.email) {
    email = loggedInDetails.email;
  } else if (me && me.email) {
    email = me.email;
  }

  const { mutate: resetPassword, isLoading } = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async () => {
      try {
        const response = await Client.authentication.resendEmail({
          email: email,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      setAlert({ message: data.statusMsg, type: "success" });
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

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <div className="w-full max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 h-24 mb-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 12l-4-4-4 4m8-4l-4 4m-4 4v1a1 1 0 001 1h10a1 1 0 001-1v-1M5 11V5a2 2 0 012-2h10a2 2 0 012 2v6"
          />
        </svg>
        <h1 className="text-2xl font-bold mb-4">Please Verify Your Email</h1>
        <p className="text-base mb-6">
          Click <span className="font-semibold cursor-pointer">Resend</span> to
          send the link to your email:
          <span className="font-semibold ml-1">{email}</span>
        </p>
        <div className="flex justify-between space-x-4">
          <Button className="w-full !bg-white !text-black">Cancel</Button>
          <Button
            className="w-full"
            onClick={() => resetPassword()}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Resend"}
          </Button>
        </div>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
};
