import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../context/AuthContext";
import apiCaller from "../utils/apiCaller";

const useGetEmaiLogData = (uuid) => {
    const [logData, setLogData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    useEffect(() => {
        if (!uuid) {
            return undefined;
        }

        let isMounted = true;

        const getEmailLogData = async () => {
            setLoading(true);

            try {
                const { res, data } = await apiCaller("GET", `/api/v1/email/logs/${uuid}`);

                if (res.status === 401) {
                    clearUser();
                    throw new Error("Session expired. Please login again.");
                }

                if (!res.ok) {
                    throw new Error(data?.message || "Failed to load email log details.");
                }

                if (isMounted) {
                    setLogData(data?.data || null);
                }
            } catch (error) {
                if (isMounted) {
                    setLogData(null);
                    toast.error(error.message || "Something went wrong while loading email log details");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        getEmailLogData();

        return () => {
            isMounted = false;
        };
    }, [clearUser, uuid]);

    return { loading, logData };
};

export default useGetEmaiLogData;
