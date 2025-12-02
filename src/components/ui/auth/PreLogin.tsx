import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { any, z } from 'zod'
import { Client } from '@/data/client/index'
import { useResponsive } from '@/utils/UseResponsive'
import { baseCompanyOptions, developerMode } from '@/data/hubSpotData'
import { Form, FormItem, FormLabel, FormControl, Input, FormMessage } from '@/components/ui/Form'
import { hubSpotUserDetails } from '@/data/hubSpotData'
import { EmailIcon } from '@/assets/icons/EmailIcon'
import { Button } from '@/components/ui/Button'
import { HtmlParser } from '@/components/HtmlParser';

export const PreLogin = ({ setActiveState, entredEmail, setEntredEmail, setloginData } : any) => {
  const [serverError, setServerError] = useState(null);
  
  const enterEmailValidationSchema = z.object({
    email: z.string().email().nonempty({
      message: "Email is required.",
    }),
  });

  const { mutate: login, isLoading } = useMutation({
    mutationKey: ["enterEmailUser"],
    mutationFn: async (input: any) => {
      try {
        const response = await Client.authentication.preLogin({
          email: input.email
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data: any) => {
      setEntredEmail(data?.data?.email || "")
      // setloginData(data?.data)
      if (data?.data?.activeStatus === "ACTIVE" && data?.data?.emailVerified === true) {
        // window.location.hash = "/login";
        setActiveState('final-login')
      } else {
        // window.location.hash = "/existing-user-register";
        setActiveState('existing-user-register')
      }
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

  const onSubmit = (data : any) => {
    login(data);
  };

  // const togglePasswordVisibility = () => {
  //   setShowPassword((prevState) => !prevState);
  // };
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  return (
    <div className="flex items-center bg-flatGray dark:bg-gray-800 justify-center h-screen">
      <div className={`dark:bg-dark-200 gap-4 bg-cleanWhite py-8 px-4 flex flex-col items-center justify-center rounded-lg ${isLargeScreen && 'w-[30%]'}  ${isMediumScreen && 'w-[45%]'}  ${isSmallScreen && 'w-[85%]'} `}>
        <div className="">
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
        </div>
        <p className="text-center dark:text-white">
          {baseCompanyOptions?.welcomeMessage || ""}
        </p>
        <div className="w-full">
          <Form
            onSubmit={onSubmit}
            validationSchema={enterEmailValidationSchema}
            serverError={serverError}
            className="dark:bg-dark-200"
            formName={`login-form-submited`}
          >
            {({ register, setValue, watch, formState: { errors } } : any) => {
              const emailValue = watch("email");

              useEffect(() => {
                if (developerMode) {
                  setValue("email", "krishna@digitalwoods.net");
                }
              }, [developerMode, setValue]);

              return (
              <div className="text-gray-800 dark:text-gray-200">
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                    Enter Email
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        autoFocus
                        height="medium"
                        icon={EmailIcon}
                        placeholder="Email"
                        defaultValue={entredEmail}
                        disabled={developerMode}
                          {...register("email", {
                            onChange: (e : any) =>
                              setValue("email", e.target.value.toLowerCase()),
                          })}
                      />
                    </div>
                  </FormControl>
                  {errors.email && (
                    <FormMessage className="text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </FormMessage>
                  )}
                </FormItem>

                <div className="mt-4 flex flex-col justify-center items-center">
                  <Button
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}}
          </Form>
          {baseCompanyOptions?.createAccountBool &&
            <p className="!mt-4 mb-0 text-xs dark:text-white flex gap-1 relative items-center justify-center flex-wrap">
              Don't have an Account?
              <span className="text-secondary hover:underline">
                <HtmlParser html={baseCompanyOptions?.createAccountLink} />
              </span>
            </p>
          }
        </div>
      </div>
    </div>
  );
};