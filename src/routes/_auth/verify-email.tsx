import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Client } from '@/data/client/index'
import { Button } from '@/components/ui/Button'
import { TickIcon } from '@/assets/icons/tickIcon'
import { toast } from 'sonner';
import { useToaster } from "@/state/use-toaster";

function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const { setToaster } = useToaster();

  const token = getParam("token")

  const { mutate: getVeifyEmail, isLoading } = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: async () => {
      try {
        const response = await Client.authentication.verifyEmail({
          token: token,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      setIsVerified(true)
      setIsVerifying(false)
    },
    onError: (error: any) => {
       let errorMessage = "An unexpected error occurred.";

      if (error.response && error.response.data) {
        const errorData = error.response.data.detailedMessage;
        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      toast.error(errorMessage);
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
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isVerified ? "Your Email Has Been Successfully Verified" : "Verify your email"}
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        {isVerified ? "Your email is now verified. Enjoy full access to your account!" : "confirm verify"}
      </p>

      {isLoading ? (
        <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 mb-6 animate-spin"></div>
      ) : isVerified ? (
        <div>
          <TickIcon />
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

export default VerifyEmail

export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmail,
  beforeLoad: () => {
    return {
      layout: "AuthLayout",
      requiresAuth: false,
    }
  },
})