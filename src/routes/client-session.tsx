import { Client } from '@/data/client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { setAuthCredentials, setLoggedInDetails, setPortal, setRefreshToken, setTwoFa } from '@/data/client/auth-utils';
import { addHomeTabOption, hubSpotUserDetails, makeLink } from '@/data/hubSpotData';
import { env } from '@/env';
import { useAuth } from '@/state/use-auth';
import { useToaster } from '@/state/use-toaster';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, COOKIE_EXPIRE } from '@/utils/constants';
import { setCookie } from '@/utils/cookie';
import { formatPath, isArray } from '@/utils/DataMigration';
import { getParam } from '@/utils/param';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';


const ClientSession = () => {
    const { setToaster } = useToaster();
    const accessToken = getParam("accessToken");
    const [progressMessage, setProgressMessage] = useState('');
    const router = useRouter();
    const { setSubscriptionType }: any = useAuth();
    const setItemAsync = async (key: any, value: any, days = COOKIE_EXPIRE) => {
        return new Promise<void>((resolve) => {
            setCookie(key, value, days);
            resolve();
        });
    };
    const VITE_PUBLIC_REST_API_ENDPOINT = window?.hubSpotData?.developerOption === true ? window?.hubSpotData?.developerOptionTempUrl : env.VITE_PUBLIC_REST_API_ENDPOINT ?? '';

    const { mutate: clientSession, isLoading } = useMutation({
        mutationKey: ["clientSession"],
        // mutationFn: async () => {
        //     // Instead of making an API call, return the mock data
        //     return data;
        // },
        mutationFn: async () => {
            try {
                const response = await axios.post(
                    `${VITE_PUBLIC_REST_API_ENDPOINT}${API_ENDPOINTS.CLIENT_SESSION}`, // Replace with your API endpoint
                    {
                        refreshToken: accessToken,
                    }, // Request body (if needed)
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: async (data: any) => {
            console.log("data", data)
            const tokenData: any = data?.data?.tokenData || {}
            const loggedInDetails: any = data?.data?.loggedInDetails || {}

            if (loggedInDetails?.portals) {
                delete loggedInDetails?.portals;
            }

            if (loggedInDetails?.hubspots) {
                delete loggedInDetails?.hubspots;
            }

            if (!tokenData?.token) {
                toast.error("Wrong email or password");
                return;
            }

            // const currentDomain = env.VITE_NODE_ENV === 'development' ? env.VITE_PORTAL_URL : window.location.origin;
            // const portal = portals.find(
            //     (item: any) => item?.portalUrl === currentDomain
            // );

            const currentPortal: any = data?.data?.loggedInDetails?.currentPortal || {}

            setPortal(currentPortal);

            const SubscriptionType = loggedInDetails?.subscriptionType || "FREE";
            setSubscriptionType(SubscriptionType);

            const token = tokenData?.token;
            const refreshToken = tokenData?.refreshToken;
            const expiresIn = tokenData?.expiresIn;
            const rExpiresIn = tokenData?.refreshExpiresIn;

            // const rExpiresAt = data?.data?.tokenData?.refreshExpiresAt;
            if (
                loggedInDetails &&
                loggedInDetails?.hubspot &&
                loggedInDetails?.hubspot.twoFa
            ) {
                setLoggedInDetails(data.data);

                setTwoFa({ twoFa: loggedInDetails?.hubspot?.twoFa });
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

                // let path = formatPath(hubSpotUserDetails?.sideMenu[0]?.label && !addHomeTabOption ? hubSpotUserDetails?.sideMenu[0]?.label : hubSpotUserDetails?.sideMenu[0]?.tabName)
                // if (router.state.location?.search?.r) {
                //     path = router.state.location?.search?.r
                // }
                // router.navigate({ to: `/${path}` });

                let path = isArray(hubSpotUserDetails?.sideMenu) && hubSpotUserDetails?.sideMenu.length > 0 ? makeLink(hubSpotUserDetails?.sideMenu[0]) : ""
                if(router.state.location?.search?.r) {
                    path = router.state.location?.search?.r
                }
                router.navigate({to: `/${path}`});

            }
            toast.success(data?.statusMsg);
        },
        onError: (error: any) => {
            let errorMessage = "An unexpected error occurred.";

            if (error?.response && error?.response.data) {
                const errorData = error?.response?.data?.errorMessage;
                const errors = error?.response?.data?.validationErrors;
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
                setProgressMessage(errorMessage);
            }

            toast.error(errorMessage);
        },
    });

    // Trigger the mutation automatically when component mounts
    useEffect(() => {
        clientSession();
    }, [clientSession]);

    return (
        <div>
            {isLoading ?
                <div id="loader">
                    <div className="spinner"></div>
                </div>
                :
                <div className="h-[100vh] w-[100vw] flex items-center justify-center text-primary">
                    {progressMessage}
                </div>
            }
        </div>
    )
}
export default ClientSession

export const Route = createFileRoute('/client-session')({
    component: ClientSession,
    beforeLoad: () => {
        return {
            layout: "AuthLayout",
            requiresAuth: false,
        }
    },
})