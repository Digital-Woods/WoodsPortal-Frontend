import { useState } from "react";
import { toast } from "sonner";
import { Client } from "@/data/client/index";
import { Button } from "../Button";
import { GoogleLogo } from "@/assets/icons/GoogleLogo";

const SsoLoginButton = ({
    integrationSlug,
    buttonText,
    integrationLogo
}: {
    buttonText?: string;
    integrationSlug?: string;
    integrationLogo?: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = async () => {
        if (isLoading) return;
        if (!integrationSlug) {
            toast.error("SSO provider is missing.");
            return;
        }

        setIsLoading(true);
        try {
            const response: any = await Client.authentication.generateSsoUrl(integrationSlug);
            const redirectUrl = response?.data;

            if (!redirectUrl) {
                toast.error("Unable to generate SSO URL.");
                setIsLoading(false);
                return;
            }
            window.location.href = redirectUrl;
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.errorMessage || "Failed to start SSO login.";
            toast.error(errorMessage);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center">
            <Button
                onClick={handleClick}
                disabled={isLoading}
                isLoading={isLoading}
                variant='outline'
                className="shadow-none flex gap-2 items-center justify-center"
            >
                {!isLoading &&

                    <div>
                        <img src={integrationLogo} alt="Integration LOGO" width="24px" height="24px" />
                    </div>
                }
                <span>
                    {buttonText ? buttonText: "Continue with SSO"}
                </span>
            </Button>
        </div>
    );
}

export default SsoLoginButton
