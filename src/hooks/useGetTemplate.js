import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../context/AuthContext";
import apiCaller from '../utils/apiCaller';

const useGetTemplate = (templateID, refresh = 0) => {
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState(null);
  const { clearUser } = useAuthStore();

  useEffect(() => {
    if (!templateID) {
      setTemplateData(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const getTemplateData = async () => {
      setLoading(true);
      try {
        const { res, data } = await apiCaller('GET', `/api/v1/templates/${templateID}`, {}, {});

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
          setTemplateData(typeof data?.data === 'object' && data.data !== null ? data.data : null);
        }
      } catch (error) {
        if (isMounted) {
          setTemplateData((prev) => prev ?? null);
          toast.error(error.message || 'Something went wrong while loading template data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getTemplateData();

    return () => {
      isMounted = false;
    };
  }, [templateID, refresh, clearUser]);

  return { loading, templateData };
};

export default useGetTemplate;
