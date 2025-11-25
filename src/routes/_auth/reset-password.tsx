import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Client } from '@/data/client/index'
import { hubSpotUserDetails } from '@/data/hubSpotData'
import { Form, FormItem, FormLabel, FormControl, Input, FormMessage } from '@/components/ui/Form'
import { EyeIcon } from '@/assets/icons/EyeIcon'
import { EyeOffIcon } from '@/assets/icons/EyeOffIcon'
import { PasswordIcon } from '@/assets/icons/PasswordIcon'
import { Button } from '@/components/ui/Button'
import { z } from 'zod';
import { useToaster } from "@/state/use-toaster";

const ResetPassword = () => {
  const [serverError, setServerError] = useState(null);
  const { setToaster } = useToaster();
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
    .refine((data: any) => data?.newPassword === data?.confirmPassword, {
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
      token = (token && typeof token === "string") ? token.replace(/ /g, "+") : "";
      return decodeURIComponent(token);
    }

    return null;
  };

  const { mutate: resetNewPassword, isLoading } = useMutation({
    mutationKey: ["resetNewPassword"],
    mutationFn: async (input: any) => {
      const token = getTokenFromParams();
      if (!token) {
        throw new Error("Token not found");
      }
      try {
        const response = await Client.authentication.resetPassword({
          newPassword: input?.newPassword,
          confirmPassword: input?.confirmPassword,
          token: token,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data: any) => {
      setToaster({ message: "Password reset successful", type: "success" });
      window.location.hash = "/login";
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.errorMessage;
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  useEffect(() => {
    const token = getTokenFromParams();
    if (!token) {
      window.location.hash = "/login";
    }
  }, []);

  const onSubmit = (data: any) => {
    resetNewPassword(data);
  };

  return (
    <div className="flex items-center bg-flatGray dark:bg-gray-800 justify-center h-screen">
      <div className="dark:bg-dark-200 bg-cleanWhite py-8 gap-4 px-4 flex flex-col items-center justify-center rounded-lg w-[30%]">
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
            serverError={serverError}
            className="dark:bg-dark-200"
          >
            {({ register, formState: { errors } }: any) => (
              <div className="text-gray-800 dark:text-gray-200">
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
                        className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
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

                <FormItem className="pt-4">
                  <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm Password"
                        icon={PasswordIcon}
                        type={showConfirmPassword ? "text" : "password"}
                        className=" "
                        {...register("confirmPassword")}
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </span>
                    </div>
                  </FormControl>
                  {errors?.confirmPassword && (
                    <FormMessage className="text-red-600 dark:text-red-400">
                      {errors?.confirmPassword?.message}
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

export default ResetPassword

export const Route = createFileRoute('/_auth/reset-password')({
  component: ResetPassword,
  beforeLoad: () => {
    return {
      layout: "AuthLayout",
      requiresAuth: false,
    }
  },
})