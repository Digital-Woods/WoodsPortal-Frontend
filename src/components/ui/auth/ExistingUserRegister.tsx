import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Client } from '@/data/client/index'
import { useResponsive } from '@/utils/UseResponsive'
import { hubSpotUserDetails, baseCompanyOptions } from '@/data/hubSpotData'
import { Form, FormItem, FormLabel, FormControl, Input, FormMessage } from '@/components/ui/Form'
import { EmailIcon } from '@/assets/icons/EmailIcon'
import { EyeIcon } from '@/assets/icons/EyeIcon'
import { EyeOffIcon } from '@/assets/icons/EyeOffIcon'
import { PasswordIcon } from '@/assets/icons/PasswordIcon'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner';
import { z } from 'zod';
import { Link } from '@/components/ui/link';


export const ExistingUserRegister = ({ setActiveState, entredEmail, loginData, clientSiteUrl }: any) => {
  const [resend, setIsResend] = useState(true);

  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const hasUserData = loginData?.firstName || loginData?.email;
  const userPortals = loginData?.portals || [];
  const matchingPortal = userPortals.find((portal: any) => portal?.portalUrl === clientSiteUrl);
  const portalUrl = matchingPortal?.portalUrl?.replace('https://','') || userPortals[0]?.portalUrl?.replace('https://','');

  const enterEmailValidationSchema = z
    .object({
      // email: z.string().email().nonempty({
      //   message: "Email is required.",
      // }),
      newPassword: z.string().nonempty({
        message: "New password is required.",
      }),
      confirmPassword: z.string().nonempty({
        message: "Confirm password is required.",
      }),
    })
    .refine((data: any) => data?.newPassword === data?.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

  const { mutate: login, isLoading } = useMutation({
    mutationKey: ["enterEmailUser"],
    mutationFn: async (input: any) => {
      try {
        const response = await Client.authentication.existingUserRegister({
          email: entredEmail,
          newPassword: input?.newPassword,
          confirmPassword: input?.confirmPassword,
        });
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: async (data: any) => {
      toast.error(data?.statusMsg);
      setTimeout(() => {
        // setActiveState('pre-login')
        setIsResend(false);
      }, 1000);
    },

    onError: (error: any) => {
      let errorMessage = "An unexpected error occurred.";

      if (error?.response && error?.response?.data) {
        const errorData = error?.response?.data?.errorMessage;
        const errors = error?.response?.data?.validationErrors;
        setServerError(errors);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: any) => {
    login(data);
  };

  const { mutate: resendEmail, isLoading: isLoadingResend } = useMutation({
    mutationKey: ["enterEmailUser"],
    mutationFn: async () => {
      try {
        const response = await Client.authentication.verifyEmailResend({
          email: entredEmail,
        });
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: async (data: any) => {
      toast.error(data?.statusMsg);
    },

    onError: (error: any) => {
      let errorMessage = "An unexpected error occurred.";

      if (error?.response && error?.response.data) {
        const errorData = error?.response?.data?.errorMessage;
        const errors = error?.response?.data?.validationErrors;
        setServerError(errors);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      toast.error(errorMessage);
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
      <div
        className={`dark:bg-dark-200 gap-4 bg-cleanWhite py-8 px-4 flex flex-col items-center justify-center rounded-lg ${
          isLargeScreen && "w-[30%]"
        }  ${isMediumScreen && "w-[50%]"}  ${isSmallScreen && "w-[80%]"} `}
      >
        <div className="">
          <div className="w-[200px]">
            <img
              src={
                hubSpotUserDetails?.hubspotPortals?.portalSettings
                  .authPopupFormLogo
              }
              alt="Light Mode Logo"
              className="h-auto dark:hidden"
            />
            <img
              src={hubSpotUserDetails?.hubspotPortals?.portalSettings.logo}
              alt="Dark Mode Logo"
              className="h-auto hidden dark:block"
            />
          </div>
        </div>
        <p className="text-center dark:text-white">
          {baseCompanyOptions?.welcomeMessage || ""}
        </p>
        {resend ? (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full">
              <Form
                onSubmit={onSubmit}
                validationSchema={enterEmailValidationSchema}
                serverError={serverError}
                formName={
                  hasUserData && userPortals.length > 0
                    ? `${portalUrl}-Login-Credential-Approval`
                    : 'Existing-user-registered-form-submitted'
                }
                className="dark:bg-dark-200"
              >
                {({ register, formState: { errors } }: any) => (
                  <div className="text-gray-800 dark:text-gray-200">
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                        Enter Email
                      </FormLabel>
                      <FormControl>
                        <div>
                          <Input
                            height="medium"
                            icon={EmailIcon}
                            placeholder="Email"
                            className=""
                            {...register("email")}
                            defaultValue={entredEmail}
                            disabled
                            readonly
                          />
                        </div>
                      </FormControl>
                      {errors?.email && (
                        <FormMessage className="text-red-600 dark:text-red-400">
                          {errors?.email?.message}
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
                            icon={PasswordIcon}
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
                      {errors?.newPassword && (
                        <FormMessage className="text-red-600 dark:text-red-400">
                          {errors?.newPassword?.message}
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
                            icon={PasswordIcon}
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
                      {errors?.confirmPassword && (
                        <FormMessage className="text-red-600 dark:text-red-400">
                          {errors?.confirmPassword?.message}
                        </FormMessage>
                      )}
                    </FormItem>
                    <div className="flex justify-end items-center">
                      <div>
                        <Link
                          to="/login"
                          onClick={() => setActiveState("pre-login")}
                        >
                          <p className="text-black text-xs dark:text-gray-300">
                            Back to enter email
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col justify-center items-center">
                      <Button className="w-full" isLoading={isLoading}>
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-xl font-bold mb-4">
              Verify your email address
            </div>
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
                variant="outline"
                onClick={() => setActiveState("pre-login")}
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
              <Button isLoading={isLoadingResend} onClick={() => resendEmail()}>
                Resend
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};