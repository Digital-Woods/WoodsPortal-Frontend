import { EyeIcon } from "@/assets/icons/EyeIcon";
import { EyeOffIcon } from "@/assets/icons/EyeOffIcon";
import { Client } from "@/data/client";
import { recorBtnCustom } from "@/data/hubSpotData";
import { useToaster } from "@/state/use-toaster";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import z from "zod";
import { Button } from "../Button";
import { Form, FormItem, FormLabel, FormControl, Input } from "../Form";

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

export const ChangePassword = () => {
  const resetRef = useRef<any>(null);
  const { setToaster } = useToaster();

  // State variables to manage password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValidationSchema = z
    .object({
      currentPassword: z
        .string()
        .nonempty({ message: "Current password is required" })
        .min(6, { message: "Current password must be at least 6 characters long" }),
      newPassword: z
        .string()
        .nonempty({ message: "New password is required" })
        .min(6, { message: "New password must be at least 6 characters long" })
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

  const {
    mutate: changePassword,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data) => Client.authentication.changePassword(data),
    onSuccess: (response: any) => {
      setToaster({ message: response?.statusMsg || "Password updated successfully", type: "success" });
      resetRef.current?.(); // Reset form after successful submission
    },
    onError: (error: any) => {
      let errorMessage = error?.response?.data?.errorMessage;
      if (
        error?.response &&
        error?.response?.data &&
        error?.response?.data?.errorMessage
      ) {
        errorMessage = error?.response?.data?.errorMessage;
      } else if (error?.message) {
        errorMessage = error?.message;
      }
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  const handleSubmit = (value: any) => {
    const payload: any = value

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
      <Form onSubmit={handleSubmit} validationSchema={passwordValidationSchema} mode="onChange">

        {({
          register,
          control,
          setValue,
          formState: { errors },
          reset,
          getValues
        }: any) => {
          resetRef.current = () => {
            const defaultValues: any = {
              "currentPassword": "",
              "newPassword": "",
              "confirmPassword": ""
            };
            reset(defaultValues);
          };
          return (
            <div className="p-4 max-sm:p-2 dark:bg-dark-300 bg-cleanWhite rounded-md border dark:border-none dark:text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl max-sm:text-lg font-semibold dark:text-white">
                  Change Password
                </div>
                <Button
                  variant={!recorBtnCustom ? 'default' : 'create'}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem className="mb-0 py-2 flex flex-col">
                  <FormLabel className="text-xs font-semibold w-[200px]">
                    Current Password
                  </FormLabel>
                  <FormControl className="flex flex-col items-center w-full">
                    <div className="relative w-full">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current Password"
                        {...register("currentPassword")}
                        className="text-xs text-gray-500 w-full"
                        icon={CurrentpassIcon}
                      />
                      <span
                        className="absolute right-3 top-2 cursor-pointer"
                        onClick={toggleCurrentPasswordVisibility}
                      >
                        {showCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </span>
                      {errors?.currentPassword && (
                        <div className="text-red-600 text-[12px] px-2 mt-1 max-w-[calc(100%-16px)]">
                          {errors?.currentPassword?.message}
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>

                <FormItem className="mb-0 py-2 flex flex-col">
                  <FormLabel className="text-xs font-semibold w-[200px]">
                    New Password
                  </FormLabel>
                  <FormControl className="flex flex-col items-center w-full">
                    <div className="relative w-full">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New password"
                        {...register("newPassword")}
                        className="text-xs text-gray-500 w-full"
                        icon={ConfirmandCurrentPassIcon}
                      />
                      <span
                        className="absolute right-2 top-2 cursor-pointer"
                        onClick={toggleNewPasswordVisibility}
                      >
                        {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </span>
                      {errors?.newPassword && (
                        <div className="text-red-600 text-[12px] px-2  mt-1 max-w-[calc(100%-16px)]">
                          {errors?.newPassword?.message}
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>

                <FormItem className="mb-0 py-2 flex flex-col">
                  <FormLabel className="text-xs font-semibold w-[200px]">
                    Confirm New Password
                  </FormLabel>
                  <FormControl className="flex flex-col items-center w-full">
                    <div className="relative w-full">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...register("confirmPassword")}
                        className="text-xs text-gray-500 w-full"
                        icon={ConfirmandCurrentPassIcon}
                      />
                      <span
                        className="absolute right-2 top-2 cursor-pointer"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </span>
                      {errors?.confirmPassword && (
                        <div className="text-red-600 text-[12px] px-2 mt-1 max-w-[calc(100%-16px)]">
                          {errors?.confirmPassword?.message}
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              </div>
            </div>
          );
        }}
      </Form>
    </div>
  );
};
