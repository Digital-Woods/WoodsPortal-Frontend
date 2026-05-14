import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod'
import { Client } from '@/data/client/index'
import { useResponsive } from '@/utils/UseResponsive'
import { baseCompanyOptions, ssoButtonsCustomizeOptions } from '@/data/hubSpotData'
import { Form, FormItem, FormLabel, FormControl, Input, FormMessage } from '@/components/ui/Form'
import { hubSpotUserDetails } from '@/data/hubSpotData'
import { EmailIcon } from '@/assets/icons/EmailIcon'
import { Button } from '@/components/ui/Button'
import { HtmlParser } from '@/components/HtmlParser';
import SsoLoginButton from './SsoLoginButton';

export const PreLogin = ({ setActiveState, entredEmail, setEntredEmail, setloginData }: any) => {
  const [serverError, setServerError] = useState(null);

  const { data: activeSsoData }: any = useQuery({
    queryKey: ['activeSsoIntegrations'],
    queryFn: () => Client.authentication.getActiveSso(),
    retry: false,
  });

  const activeSsoIntegrations = (activeSsoData?.data || []).filter(
    (integration: any) => integration?.activeStatus
  );

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
    onSuccess: async (data: any, variables: any) => {
      setEntredEmail(variables.email);
      let status = data?.data?.status || ""
      if (status.toUpperCase() === "OK" && data?.data?.allowed) {
        setActiveState('final-login')
      } else {
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

  const onSubmit = (data: any) => {
    login(data);
  };

  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  const getSsoConfig = (integration: any) => {
  const custom = ssoButtonsCustomizeOptions?.[integration?.integrationSlug];

  return {
    buttonText: custom?.button_text || integration?.buttonText,
    logo: custom?.button_logo?.src || integration?.logo,
  };
};


  return (
    <div className="flex items-center bg-flatGray dark:bg-gray-800 justify-center h-screen">
      <div className={`dark:bg-dark-200 bg-cleanWhite py-8 px-4 flex flex-col items-center justify-center rounded-lg ${isLargeScreen && 'w-[30%]'}  ${isMediumScreen && 'w-[45%]'}  ${isSmallScreen && 'w-[85%]'} `}>
        <div className="w-full mb-4">
          <div className="w-[200px] mx-auto">
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
        {baseCompanyOptions?.welcomeMessage &&
          <p className="text-center dark:text-white mb-4">
            {String(baseCompanyOptions?.welcomeMessage) || ""}
          </p>
        }
        <div className="w-full">
          <Form
            onSubmit={onSubmit}
            validationSchema={enterEmailValidationSchema}
            serverError={serverError}
            className="dark:bg-dark-200"
            formName={`login-form-submited`}
          >
            {({ register, setValue, formState: { errors } }: any) => {
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
                          {...register("email", {
                            onChange: (e: any) =>
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
              )
            }}
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
        {activeSsoIntegrations?.length > 0 && (
          <div className='w-full'>
            <div className="relative mt-6 mb-6 flex flex-col items-center justify-center text-sm text-heading w-full">
              <span className="w-full border-b border-gray-300 dark:border-gray-600 inline-block"></span>
              <span className="start-2/4 -ms-4 absolute -top-2.5 bg-light px-2 text-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300">
                OR
              </span>
            </div>
            <div className='flex gap-2 items-center justify-center flex-wrap'>
              {activeSsoIntegrations?.map((integration: any) => {
                const { buttonText, logo } = getSsoConfig(integration);

                return (
                  <SsoLoginButton
                    key={integration?.portalIntegrationConfigId || integration?.integrationSlug}
                    integrationSlug={integration?.integrationSlug}
                    buttonText={buttonText}
                    integrationLogo={logo}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
