import { Client } from '@/data/client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { setLoggedInDetails, setPortal, setTwoFa } from '@/data/client/auth-utils';
import { addHomeTabOption, hubSpotUserDetails } from '@/data/hubSpotData';
import { env } from '@/env';
import { useToaster } from '@/state/use-toaster';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, COOKIE_EXPIRE } from '@/utils/constants';
import { setCookie } from '@/utils/cookie';
import { formatPath } from '@/utils/DataMigration';
import { getParam } from '@/utils/param';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios';
import { useEffect, useState } from 'react';


const ClientSession = () => {
    const { setToaster } = useToaster();
    const accessToken = getParam("accessToken");
    const [progressMessage, setProgressMessage] = useState('');
    const router = useRouter();
    const setItemAsync = async (key: any, value: any, days = COOKIE_EXPIRE) => {
        return new Promise<void>((resolve) => {
            setCookie(key, value, days);
            resolve();
        });
    };

    const { mutate: clientSession, isLoading } = useMutation({
        mutationKey: ["clientSession"],
        // mutationFn: async () => {
        //     // Instead of making an API call, return the mock data
        //     return data;
        // },
        mutationFn: async () => {
            try {
                const response = await axios.post(
                    `${env.VITE_PUBLIC_REST_API_ENDPOINT}${API_ENDPOINTS.CLIENT_SESSION}`, // Replace with your API endpoint
                    {}, // Request body (if needed)
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
            if (!data.data.tokenData.token) {
                setToaster({ message: "Wrong email or password", type: "error" });
                return;
            }

            const currentDomain = window.location.origin;
            const portal = data.data.loggedInDetails.portals.find(
                (item: any) => item.portalUrl === currentDomain
            );
            setPortal(portal);
            setProgressMessage('Logged in successfully!')
            if (
                data.data.loggedInDetails &&
                data.data.loggedInDetails.hubspots &&
                data.data.loggedInDetails.hubspots.some(hub => hub.twoFa)
            ) {
                setLoggedInDetails(data.data);
                setTwoFa({ twoFa: true });
                window.location.hash = "/login/two-fa";
            } else {
                await setItemAsync(AUTH_USER_KEY, JSON.stringify(data.data));
                await setItemAsync(AUTH_TOKEN_KEY, data.data.tokenData.token);
                router.history.replace(`/dashboard`);
            }
            setToaster({ message: "Logged in successfull!", type: "success" });
        },
        onError: (error: any) => {
            let errorMessage = "An unexpected error occurred.";

            if (error.response && error.response.data) {
                const errorData = error.response.data.detailedMessage;
                const errors = error.response.data.validationErrors;
                errorMessage =
                    typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
            }
            setProgressMessage("You are not authorized!")
            setToaster({ message: "You are not authorized", type: "error" });
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