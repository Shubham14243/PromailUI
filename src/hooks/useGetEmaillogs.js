import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../context/AuthContext";
import apiCaller from "../utils/apiCaller";

const ITEMS_PER_PAGE = 10;

const useGetEmaillogs = (page, appliedFilters) => {
    const [serverLogs, setServerLogs] = useState([]);
    const [totalLogs, setTotalLogs] = useState(0);
    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    useEffect(() => {
        let isMounted = true;

        const getEmailLogs = async () => {
            setLoading(true);

            try {
                const params = {
                    limit: ITEMS_PER_PAGE,
                    skip: (page - 1) * ITEMS_PER_PAGE,
                    to_email: appliedFilters.toEmail,
                    template_id: appliedFilters.templateId,
                    app_id: appliedFilters.appId,
                    startDateTime: appliedFilters.startDate,
                    endDateTime: appliedFilters.endDate
                };
                const { res, data } = await apiCaller("GET", "/api/v1/email/logs", {}, params);

                if (res.status === 401) {
                    clearUser();
                    throw new Error("Session expired. Please login again.");
                }

                if (res.status === 404) {
                    if (isMounted) {
                        setServerLogs([]);
                        setTotalLogs(0);
                    }
                    return;
                }

                if (!res.ok) {
                    throw new Error(data?.message || "Failed to load email logs.");
                }

                const responseData = data?.data;
                const responseLogs = Array.isArray(responseData)
                    ? responseData
                    : responseData?.logs || responseData?.items || [];
                const responseTotal = data?.total ?? responseData?.total ?? responseLogs.length;

                if (isMounted) {
                    setServerLogs(Array.isArray(responseLogs) ? responseLogs : []);
                    setTotalLogs(Number(responseTotal) || 0);
                }
            } catch (error) {
                if (isMounted) {
                    setServerLogs([]);
                    setTotalLogs(0);
                    toast.error(error.message || "Something went wrong while loading email logs");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        getEmailLogs();

        return () => {
            isMounted = false;
        };
    }, [appliedFilters, clearUser, page]);

    return { loading, serverLogs, totalLogs };
};

export default useGetEmaillogs;
