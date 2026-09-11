import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../context/AuthContext";
import apiCaller from "../utils/apiCaller";

const useGetAppKey = (appID) => {
  const [loading, setLoading] = useState(false);
  const { clearUser } = useAuthStore();

  const getAppKey = async (appID) => {
    setLoading(true);
    try {
      const { res, data } = await apiCaller(
        "GET",
        `/api/v1/apps/${appID}/key`,
        {},
        {},
      );

      if (res.status === 401) {
        clearUser();
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const message =
          typeof data === "object" && data?.message
            ? data.message
            : typeof data === "string" && data.trim()
              ? data
              : "Failed to load app key.";

        throw new Error(message);
      }

      const appKey = typeof data?.data === "object" && data.data !== null
        ? data.data.mail_key
        : "";
      return appKey;
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while loading app key",
      );
      return '****************';
    } finally {
      setLoading(false);
    }
  };

  const refreshAppKey = async (appID) => {
    setLoading(true);
    try {
      const { res, data } = await apiCaller(
        "PUT",
        `/api/v1/apps/${appID}/key`,
        {},
        {},
      );

      if (res.status === 401) {
        clearUser();
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const message =
          typeof data === "object" && data?.message
            ? data.message
            : typeof data === "string" && data.trim()
              ? data
              : "Failed to load app key.";

        throw new Error(message);
      }

      return true;
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while loading app key",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, getAppKey, refreshAppKey };
};

export default useGetAppKey;
