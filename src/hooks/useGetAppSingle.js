import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../context/AuthContext";
import apiCaller from '../utils/apiCaller';

const useGetAppSingle = (appID, refresh = 0) => {
  const [loading, setLoading] = useState(false);
  const [appData, setAppData] = useState(null);
  const { clearUser } = useAuthStore();

  useEffect(() => {
    if (!appID) {
      setAppData(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const getAppData = async () => {
      setLoading(true);
      try {
        const { res, data } = await apiCaller('GET', `/api/v1/apps/${appID}`, {}, {});

        if (res.status === 401) {
          clearUser();
          throw new Error('Session expired. Please login again.');
        }

        if (!res.ok) {
          const message = typeof data === 'object' && data?.message
            ? data.message
            : typeof data === 'string' && data.trim()
              ? data
              : 'Failed to load app data.';

          throw new Error(message);
        }

        if (isMounted) {
          setAppData(typeof data?.data === 'object' && data.data !== null ? data.data : null);
        }
      } catch (error) {
        if (isMounted) {
          setAppData((prev) => prev ?? null);
          toast.error(error.message || 'Something went wrong while loading app data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getAppData();

    return () => {
      isMounted = false;
    };
  }, [appID, refresh, clearUser]);

  return { loading, appData };
};

export default useGetAppSingle;
