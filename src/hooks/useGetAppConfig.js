import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../context/AuthContext";
import apiCaller from '../utils/apiCaller';

const useGetAppConfig = (appID, refresh = 0) => {
  const [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState(null);
  const { clearUser } = useAuthStore();

  useEffect(() => {
    if (!appID) {
      setConfigData(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const getConfigData = async () => {
      setLoading(true);
      try {
        const { res, data } = await apiCaller('GET', `/api/v1/config/${appID}`, {}, {});

        if (res.status === 401) {
          clearUser();
          throw new Error('Session expired. Please login again.');
        }

        if (res.status === 404) {
          setConfigData(typeof data?.data === 'object' && data.data !== null ? data.data : null);
          return;
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
          setConfigData(typeof data?.data === 'object' && data.data !== null ? data.data : null);
        }
      } catch (error) {
        if (isMounted) {
          setConfigData((prev) => prev ?? null);
          toast.error(error.message || 'Something went wrong while loading app data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getConfigData();

    return () => {
      isMounted = false;
    };
  }, [appID, refresh, clearUser]);

  return { loading, configData };
};

export default useGetAppConfig;
