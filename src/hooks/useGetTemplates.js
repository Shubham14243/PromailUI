import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiCaller from '../utils/apiCaller';
import useAuthStore from '../context/AuthContext';

const useGetTemplates = (appID, refresh, limit = 9, offset = 0) => {
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState(null);
  const { clearUser } = useAuthStore();

  useEffect(() => {
    const getTemplates = async () => {
      setLoading(true);
      try {
        const { res, data } = await apiCaller('GET', `/api/v1/apps/${appID}/templates`, {}, { limit, offset });

        if (res.status === 401) {
          clearUser();
          throw new Error('Session expired. Please login again.');
        }

        if (!res.ok) {
          const message = typeof data === 'object' && data?.message
            ? data.message
            : typeof data === 'string' && data.trim()
              ? data
              : 'Failed to load templates.';

          throw new Error(message);
        }

        setTemplateData(Array.isArray(data?.data) ? data.data : null);
      } catch (error) {
        setTemplateData(null);
        toast.error(error.message || 'Something went wrong while loading templates');
      } finally {
        setLoading(false);
      }
    };

    getTemplates();
  }, [appID, clearUser, refresh]);

  return { loading, templateData };
};

export default useGetTemplates;
