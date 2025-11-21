import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { EmailIcon } from '@/assets/icons/EmailIcon'
import { Form, FormItem, FormLabel, FormControl, Input, FormMessage } from '@/components/ui/Form'
import { Client } from '@/data/client/index'
import { hubSpotUserDetails } from '@/data/hubSpotData'
import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/Button'
import { z } from 'zod';
import { useToaster } from '@/state/use-toaster';
import { useResponsive } from '@/utils/UseResponsive';

const ForgetPassword = () => {
  const [serverError, setServerError] = useState(null);
  const { setToaster } = useToaster();
  const resetPasswordValidationSchema = z.object({
    email: z.string().email(),
  });

  const { mutate: resetPassword, isLoading } = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async (input: any) => {
      try {
        const response = await Client.authentication.forgetPassword({
          email: input?.email,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data: any) => {
      setToaster({ message: data?.statusMsg, type: "success" });
    },
    onError: (error: any) => {
      let errorMessage = error?.response?.data?.errorMessage;

      if (error?.response && error?.response?.data) {
        const errorData = error?.response?.data?.errorMessage;
        setServerError(errorData);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      setToaster({ message: errorMessage, type: "error" });
    },
  });

  const onSubmit = (data: any) => {
    resetPassword(data);
  };
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  return (
    <div className="flex items-center bg-flatGray dark:bg-gray-900 justify-center h-screen">
      <div className={`dark:bg-dark-200 gap-4 bg-cleanWhite py-8 px-4 flex flex-col items-center justify-center rounded-lg ${isLargeScreen && 'w-[30%]'}  ${isMediumScreen && 'w-[45%]'}  ${isSmallScreen && 'w-[85%]'} `}>
        <div className="w-[200px]">
          <img
            src={hubSpotUserDetails?.hubspotPortals?.portalSettings?.authPopupFormLogo}
            alt="Light Mode Logo"
            className="h-auto dark:hidden"
          />
          <img
            src={hubSpotUserDetails?.hubspotPortals?.portalSettings?.logo}
            alt="Dark Mode Logo"
            className="h-auto hidden dark:block"
          />
        </div>

        <div className="w-full">
          <Form
            onSubmit={onSubmit}
            validationSchema={resetPasswordValidationSchema}
            // serverError={serverError}
            className="dark:bg-dark-200"
          >
            {({ register, formState: { errors } }: any) => (
              <div className="text-gray-800 dark:text-gray-200">
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        height="medium"
                        icon={EmailIcon}
                        placeholder="Email"
                        className=""
                        {...register("email")}
                      />
                    </div>
                  </FormControl>
                  {errors?.email && (
                    <FormMessage className="text-red-600 dark:text-red-400">
                      {errors?.email?.message}
                    </FormMessage>
                  )}
                </FormItem>
                <div className="flex justify-end items-center">
                  <div>
                    <Link to="/login">
                      <p className="text-secondary hover:underline text-xs dark:text-gray-300">
                        Back to Login?
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex flex-col justify-center items-center">
                  <Button
                    disabled={isLoading}
                    className="w-full  "
                  >
                    {isLoading ? "Sending..." : "Send Link"}
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

export default ForgetPassword

export const Route = createFileRoute('/_auth/forget-password')({
  component: ForgetPassword,
  beforeLoad: () => {
    return {
      layout: "AuthLayout",
      requiresAuth: false,
    }
  },
})