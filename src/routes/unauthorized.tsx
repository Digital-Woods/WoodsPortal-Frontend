import { Button } from '@/components/ui/Button';
import { Routes } from '@/config/routes';
import { clearAccessToken } from '@/data/client/token-store';
import { removeAllCookie } from '@/utils/cookie';
import { useResponsive } from '@/utils/UseResponsive';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react';

const Unauthorized = () => {
    const router = useRouter()
    const navigate = useNavigate();
    const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

    const raw = sessionStorage.getItem('authError');
    const authError = raw ? JSON.parse(raw) : null;

    useEffect(() => {
        if (raw) {
            clearAccessToken();
            removeAllCookie();
        } else {
            router.navigate({ to: `/` });
        }
    }, [raw]);

    useEffect(() => {
        return () => {
            sessionStorage.removeItem('authError');
        };
    }, []);

    return (
        <div className="flex items-center bg-flatGray dark:bg-gray-800 justify-center h-screen">
            <div className={`dark:bg-dark-200 gap-4 bg-cleanWhite py-8 px-4 flex flex-col items-center justify-center rounded-lg ${isLargeScreen && 'w-[30%]'}  ${isMediumScreen && 'w-[45%]'}  ${isSmallScreen && 'w-[85%]'} `}>
                <div className="text-center p-4 dark:text-white">
                    <h1 className="text-xl font-bold mb-4">401 Unauthorized</h1>
                    <p className="text-md text-muted-gray">
                        {authError?.errorMessage || "Your session may have expired or you do not have the required permissions. Please log in again to continue."}
                    </p>
                    <Button
                        className="w-full my-6"
                        onClick={() => navigate({ to: Routes.login })}
                    >
                        Go to Login
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default Unauthorized

export const Route = createFileRoute('/unauthorized')({
    component: Unauthorized,
    beforeLoad: () => {
        return {
            layout: "UnauthorizedLayout"
        }
    },
})