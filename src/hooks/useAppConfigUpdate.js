import React, { useState } from 'react'
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useAppConfigUpdate = () => {

    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const configUpdate = async ({smtpHost, smtpPort, senderName, senderEmail, smtpAppKey, openTrack, clickTrack, autoRetry, maxRetryCount}, action, appID) => {
        setLoading(true);
        try {



            const success = dataValidate(smtpHost, smtpPort, senderName, senderEmail, smtpAppKey, openTrack, clickTrack, autoRetry, maxRetryCount);

            if(!success){
                return;
            }

            if (action !== "POST" && action !== "PUT"){
                toast.error("Invalid app config update action.")
                return;
            }

            if (openTrack === true){
                openTrack = "active"
            } else {
                openTrack = "inactive"
            }

            if (clickTrack === true){
                clickTrack = "active"
            } else {
                clickTrack = "inactive"
            }

            if (autoRetry === true){
                autoRetry = "active"
            } else {
                autoRetry = "inactive"
                maxRetryCount = 0
            }

            smtpPort = parseInt(smtpPort)

            const body = {
                smtp_host: smtpHost.trim(),
                smtp_port: smtpPort,
                smtp_name: senderName.trim(),
                smtp_username: senderEmail.trim(),
                smtp_password: smtpAppKey,
                open_track: openTrack,
                click_track: clickTrack,
                auto_retry: autoRetry,
                retry_max_count: maxRetryCount,
            };

            const {res, data} = await apiCaller(action, `/api/v1/config/${appID}`, body);

            if (res.status === 401) {
                clearUser();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) {
                const message = typeof data === 'object' && data?.message
                    ? data.message
                    : typeof data === 'string' && data.trim()
                        ? data
                        : 'App Creation failed!';

                throw new Error(message);
            }

            return true;

        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {loading, configUpdate};

}

export default useAppConfigUpdate;

function isValidName(name) {
    if (!name || typeof name !== "string") {
        return false;
    }

    return /^[A-Za-z][A-Za-z0-9 ._/-]{4,49}$/.test(name);
}

function isValidEmail(email) {
    if (!email || typeof email !== "string") {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function dataValidate(smtpHost, smtpPort, senderName, senderEmail, smtpAppKey, openTrack, clickTrack, autoRetry, maxRetryCount){
    
    if (!smtpHost) {
        toast.error("Invalid smtpHost: cannot be empty.");
        return false;
    }

    if (!Number.isInteger(Number(smtpPort)) || smtpPort <= 0 || smtpPort > 65535) {
        toast.error(
            "Invalid smtpPort: must be a positive integer between 1 and 65535."
        );
        return false;
    }

    if (!isValidName(senderName)) {
        toast.error("Invalid senderName: must be a valid name.");
        return false;
    }

    if (!isValidEmail(senderEmail)) {
        toast.error("Invalid senderEmail: must be a valid email address.");
        return false;
    }

    if (openTrack !== true && openTrack !== false) {
        toast.error(
            "Invalid open_track: must be either 'active' or 'inactive'."
        );
        return false;
    }

    if (clickTrack !== true && clickTrack !== false) {
        toast.error(
            "Invalid click_track: must be either 'active' or 'inactive'."
        );
        return false;
    }

    if (autoRetry !== true && autoRetry !== false) {
        toast.error(
            "Invalid auto_retry: must be either 'active' or 'inactive'."
        );
        return false;
    }

    if (
        !Number.isInteger(Number(maxRetryCount)) ||
        Number(maxRetryCount) < 0 ||
        Number(maxRetryCount) > 5
    ) {
        toast.error(
            "Invalid retry_max_count: must be a non-negative integer in the range 0-5."
        );
        return false;
    }

    return true;
};