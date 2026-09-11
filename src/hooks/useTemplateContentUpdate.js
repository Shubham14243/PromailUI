import { useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../context/AuthContext";
import apiCaller from "../utils/apiCaller";

const useTemplateContentUpdate = () => {
    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const updateTemplateContent = async (templateID, { content, variables }) => {
        setLoading(true);

        try {
            const { res, data } = await apiCaller(
                "PUT",
                `/api/v1/templates/${templateID}/content`,
                {
                    type: "html",
                    content,
                    variables,
                },
            );

            if (res.status === 401) {
                clearUser();
                throw new Error("Session expired. Please login again.");
            }

            if (!res.ok) {
                throw new Error(data?.message || data || "Template content update failed!");
            }

            return true;
        } catch (error) {
            toast.error(error.message || "Something went wrong. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, updateTemplateContent };
};

export default useTemplateContentUpdate;