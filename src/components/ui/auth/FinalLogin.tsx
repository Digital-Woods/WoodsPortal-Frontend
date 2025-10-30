import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Client } from '@/data/client/index'
import { env } from "@/env";
import { z } from 'zod';
import { addHomeTabOption, baseCompanyOptions, developerMode, hubId } from '@/data/hubSpotData'
import { useResponsive } from '@/utils/UseResponsive'
import { Form, FormItem, FormLabel, FormControl, Input, FormMessage } from '@/components/ui/Form'
import { EmailIcon } from '@/assets/icons/EmailIcon'
import { EyeIcon } from '@/assets/icons/EyeIcon'
import { EyeOffIcon } from '@/assets/icons/EyeOffIcon'
import { EditIcon2 } from '@/assets/icons/EditIcon2'
import { PasswordIcon } from '@/assets/icons/PasswordIcon'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner';
import { hubSpotUserDetails } from '@/data/hubSpotData';
import { setPortal, setLoggedInDetails, setTwoFa, setAuthCredentials, setRefreshToken } from "@/data/client/auth-utils";
import { setCookie } from "@/utils/cookie";
import { Link } from '@/components/ui/link';
import { formatPath } from '@/utils/DataMigration';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '@/state/use-auth';

export const FinalLogin = ({ setActiveState, entredEmail, loginData, clientSiteUrl }: any) => {
  const router = useRouter()
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const hasUserData = loginData?.firstName || loginData?.email;
  const userPortals = loginData?.portals || [];
  const matchingPortal = userPortals.find((portal: any) => portal.portalUrl === clientSiteUrl);
  const portalUrl = matchingPortal?.portalUrl?.replace('https://', '') || (userPortals.leggth > 0 ? userPortals[0]?.portalUrl?.replace('https://', '') : "");
  const developerModeOn = developerMode;
  const loginUserValidationSchema = z.object({
    // email: z.string().email(),
    password: z.string().nonempty({
      message: "Password is required.",
    }),
  });

  const { setSubscriptionType }: any = useAuth();

  // const { getMe } = useMe();
  // const setUserDetails = useSetRecoilState(userDetailsAtom);

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
        const response = await Client.authentication.login({
          username: entredEmail,
          password: input.password,
        }, hubId);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data: any) => {
      if (!data.data.tokenData.token) {
        toast.error("Wrong email or password");
        return;
      }

      const currentDomain = env.VITE_NODE_ENV === 'development' ? env.VITE_PORTAL_URL : window.location.origin;
      const portal = data.data.loggedInDetails.portals.find(
        (item: any) => item.portalUrl === currentDomain
      );

      setPortal(portal || {});

      const SubscriptionType = data?.data?.loggedInDetails?.subscriptionType || "FREE";
      setSubscriptionType(SubscriptionType);

      const token = data?.data?.tokenData?.token;
      const refreshToken = data?.data?.tokenData?.refreshToken;
      const expiresIn = data?.data?.tokenData?.expiresIn;
      const rExpiresIn = data?.data?.tokenData?.refreshExpiresIn;
      // const rExpiresAt = data?.data?.tokenData?.refreshExpiresAt;
      if (
        data.data.loggedInDetails &&
        data.data.loggedInDetails.hubspot &&
        data.data.loggedInDetails.hubspot.twoFa
      ) {
        setLoggedInDetails(data.data);

        setTwoFa({ twoFa: data.data.loggedInDetails.hubspot.twoFa });
        window.location.hash = "/login/tow-fa";
      } else {

        await setAuthCredentials(token, expiresIn);
        await setRefreshToken(refreshToken, rExpiresIn);
        await setLoggedInDetails(data.data);

        // setLoggedInDetails(data.data);
        // setAuthCredentials(data.data.tokenData.token);
        // await setItemAsync(env.VITE_AUTH_USER_KEY, JSON.stringify(data.data));
        // await setItemAsync(env.VITE_AUTH_TOKEN_KEY, data.data.tokenData.token);
        // getMe(); // Fetch user details
        // Use if-else to check if routes exist
        // if (routes && routes.length > 0) {
        //   const firstRoute = routes[0].path;
        //   window.location.hash = firstRoute;
        // } else {
        //   window.location.hash = "/no-routes";
        // }

        let path = formatPath(hubSpotUserDetails?.sideMenu[0]?.label && !addHomeTabOption ? hubSpotUserDetails?.sideMenu[0]?.label : hubSpotUserDetails?.sideMenu[0]?.tabName)
        if(router.state.location?.search?.r) {
          path = router.state.location?.search?.r
        }
        router.navigate({to: `/${path}`});

        // console.log('home', true)
      }
      toast.success(data.statusMsg);
    },

    onError: (error: any) => {
      let errorMessage = "An unexpected error occurred.";

      if (error.response && error.response.data) {
        const errorData = error.response.data.detailedMessage;
        const errors = error.response.data.validationErrors;
        setServerError(errors);
        // helper function to extract first error message
        const extractMessage = (err: any): string => {
          if (typeof err === "string") return err;
          if (typeof err === "object" && err !== null) {
            const val = Object.values(err)[0];
            return Array.isArray(val) ? val[0] : String(val);
          }
          return String(err);
        };
        errorMessage = errors ? extractMessage(errors) : extractMessage(errorData);
      }

      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: any) => {
    login(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  return (
    <div className="flex items-center bg-flatGray dark:bg-gray-800 justify-center h-screen">
      <div
        className={`dark:bg-dark-200 gap-4 bg-cleanWhite py-8 px-4 flex flex-col items-center justify-center rounded-lg ${isLargeScreen && "w-[30%]"
          }  ${isMediumScreen && "w-[45%]"}  ${isSmallScreen && "w-[85%]"} `}
      >
        <div className="">
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
        </div>
        <p className="text-center dark:text-white">
          {baseCompanyOptions.welcomeMessage || ""}
        </p>
        <div className="w-full">
          <Form
            onSubmit={onSubmit}
            validationSchema={loginUserValidationSchema}
            serverError={serverError}
            formName={
              hasUserData && userPortals.length > 0
                ? `${portalUrl}-Login–User-Verification`
                : 'Existing-user-logged-in-form-submitted'
            }
            className="dark:bg-dark-200"
          >
            {({ register, setValue, formState: { errors } }: any) => {

              useEffect(() => {
                if (developerModeOn) {
                  setValue("password", "Krish@12345");
                }
              }, [developerModeOn, setValue]);

              return (
                <div className="text-gray-800 dark:text-gray-200">
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div>
                        <div className="relative">
                          <Input
                            height="medium"
                            icon={EmailIcon}
                            placeholder="Email"
                            {...register("email")}
                            defaultValue={entredEmail}
                            disabled
                            readOnly
                          />
                          <span
                            className="absolute right-2 top-3 text-secondary cursor-pointer"
                            onClick={() => setActiveState("pre-login")}
                          >
                            <EditIcon2 />
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    {errors.username && (
                      <FormMessage className="text-red-600 dark:text-red-400">
                        {errors.username.message}
                      </FormMessage>
                    )}
                  </FormItem>
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoFocus
                          placeholder="Password"
                          icon={PasswordIcon}
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          disabled={developerModeOn}
                        />
                        {!developerModeOn &&
                          <span
                            className="absolute right-2 top-3 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                          </span>
                        }
                      </div>
                    </FormControl>
                    {errors.password && (
                      <FormMessage className="text-red-600 dark:text-red-400">
                        {errors.password.message}
                      </FormMessage>
                    )}
                  </FormItem>
                  <p className="mt-2 mb-0 text-xs dark:text-white text-secondary hover:underline text-end">
                    <Link to="/forget-password">
                        Forgot password?
                    </Link>
                  </p>
                  <div className="mt-4 flex flex-col justify-center items-center">
                    <Button className="w-full" isLoading={isLoading}>
                      Login
                    </Button>
                  </div>
                </div>
              );
            }}
          </Form>
        </div>
      </div>
    </div>
  );
};