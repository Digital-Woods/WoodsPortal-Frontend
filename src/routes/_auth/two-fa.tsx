import { createFileRoute } from "@tanstack/react-router"
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Client } from '@/data/client/index'
import { useSetRecoilState } from 'recoil';
import { setCookie } from "@/utils/cookie";
import { hubSpotUserDetails } from '@/defaultData'
import { Form, FormItem, FormLabel, FormControl, Input, FormMessage } from '@/components/ui/Form'
import { PasswordIcon } from '@/assets/icons/PasswordIcon'
import { Button } from '@/components/ui/Button'
import { Link } from '@/components/ui/link';
import { env } from "@/env";

const TwoFa = () => {
  const [serverError, setServerError] = useState(null);
  const { setToaster } = useToaster();
  const { routes } = useRoute();

  const loginUserValidationSchema = z.object({
    otp: z.string().nonempty({
      message: "OTP is required.",
    }),
  });

  const { tokenData } = getLoggedInDetails()

  const setUserDetails = useSetRecoilState(userDetailsAtom);

  const setItemAsync = async (key: any, value: any) => {
    return new Promise((resolve: any) => {
      setCookie(key, value);
      resolve();
    });
  };

  const { mutate: login, isLoading } = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: async (input: any) => {
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
    onSuccess: async (data: any) => {
      if (!data.data.tokenData.token) {
        setToaster({ message: "Wrong email or password", type: "error" });
        return;
      }

      await setItemAsync(env.VITE_AUTH_TOKEN_KEY, data.data.tokenData.token);
      // getMe(); // Fetch user details

      setUserDetails(data.data.loggedInDetails);
      setToaster({ message: "Login successful", type: "success" });

      // Use if-else to check if routes exist
      if (routes && routes.length > 0) {
        const firstRoute = routes[0].path;
        window.location.hash = firstRoute;
      } else {
        window.location.hash = "/no-routes";
      }
    },

    onError: (error: any) => {
      let errorMessage = "An unexpected error occurred.";

      if (error.response && error.response.data) {
        const errorData = error.response.data.detailedMessage;
        setServerError(errorData);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      setToaster({ message: errorMessage, type: "error" });
    },
  });

  const onSubmit = (data: any) => {
    login(data);
  };

  return (
    <div className="flex items-center bg-flatGray dark:bg-gray-800 justify-center h-screen">
      <div className="dark:bg-dark-200 bg-cleanWhite py-8 gap-4 px-4 flex flex-col items-center justify-center rounded-lg w-[30%]">
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
        <div className="w-full">
          <Form
            onSubmit={onSubmit}
            validationSchema={loginUserValidationSchema}
            serverError={serverError}
            className="dark:bg-dark-200"
          >
            {({ register, formState: { errors } }: any) => (
              <div className="text-gray-800 dark:text-gray-200">
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                    OTP
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        height="medium"
                        icon={PasswordIcon}
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
                    <Link to="/login">
                      <p className="text-black text-xs dark:text-gray-300">
                        Back to Login
                      </p>
                    </Link>
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

export default TwoFa

export const Route = createFileRoute('/_auth/two-fa')({
  component: TwoFa,
  beforeLoad: () => {
    return {
      layout: "AuthLayout",
      requiresAuth: false,
    }
  },
})