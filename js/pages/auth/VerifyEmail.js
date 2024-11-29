const Tick = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
    >
      <path
        fill="#c8e6c9"
        d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
      ></path>
      <path
        fill="#4caf50"
        d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
      ></path>
    </svg>
  );
};

function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const token = getParam("token")

  const { mutate: getVeifyEmail, isLoading } = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: async (input) => {
      try {
        const response = await Client.authentication.verifyEmail({
          token: token,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      setIsVerified(true)
      setIsVerifying(false)
    },
    onError: (error) => {
      console.log('error', error.response.data.detailedMessage)
      setAlert({ message: errorMessage, type: "error" });
      setIsVerifying(false)
    },
  });

  // Mock API call to verify email
  useEffect(() => {
    // const fakeApiCall = () => {
    //   setTimeout(() => {
    //     setIsVerifying(false);
    //     setIsVerified(true);
    //   }, 5000); // Simulates a 5-second API call
    // };

    // fakeApiCall();
    getVeifyEmail();
  }, [token]);

  // Redirect to dashboard on button click
  const handleRedirect = () => {
    window.location.hash= "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        {isVerified ? "Email Verified" : "Verify your email"}
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        {isVerified ? "The message for email verify" : "confirm verify"}
      </p>

      {isLoading ? (
        <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 mb-6 animate-spin"></div>
      ) : isVerified ? (
        <div>
          <Tick />
          <Button className="my-4 ml-3 !bg-black" onClick={handleRedirect}>
            Okay
          </Button>
        </div>
      ) :
        <div className="flex flex-col items-center justify-center">
          <div>
            Session is expired
          </div>
          <Button className="my-4 ml-3 !bg-black" onClick={handleRedirect}>
            Back to login
          </Button>
        </div>
      }
    </div>
  );
}
