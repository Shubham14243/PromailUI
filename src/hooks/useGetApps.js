import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useRefreshToken from "./useRefreshToken";

const useGetApps = (refresh) => {
  const [loading, setLoading] = useState(false);
  const [appsData, setAppsData] = useState([]);
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const getApps = async () => {
      setLoading(true);
      try {
        const backendBaseUrl =
          import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";
        const res = await fetch(`${backendBaseUrl}/api/v1/apps`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('proMailUser') || 'null')?.auth_token || ''}`,
          },
          credentials: "include",
        });

        if (res.status === 401) {
          const refreshedUser = await refreshToken();
          if (!refreshedUser) {
            return;
          }

          const retryRes = await fetch(`${backendBaseUrl}/api/v1/apps`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshedUser.auth_token || ''}`,
            },
            credentials: "include",
          });

          if (!retryRes.ok) {
            const retryData = await retryRes.json().catch(() => null);
            throw new Error(retryData?.message || 'Failed to load apps after refresh');
          }

          const retryData = await retryRes.json().catch(() => null);
          setAppsData(retryData?.data || null);
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || 'Failed to load apps');
        }

        const data = await res.json().catch(() => null);
        if (data?.type === "failure" || data?.type === "error") {
          throw new Error(data.message || 'Failed to load apps');
        }
        setAppsData(data?.data || null);
      } catch (error) {
        toast.error(error.message || 'Something went wrong while loading apps');
      } finally {
        setLoading(false);
      }
    };

    getApps();
  }, [refresh, refreshToken]);

  return { loading, appsData };
};

export default useGetApps;
