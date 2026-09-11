import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useDeleteTemplate = () => {
    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const deleteTemplate = async (templateID) => {
        setLoading(true);
        try {
            const { res, data } = await apiCaller('DELETE', `/api/v1/templates/${templateID}`);

            if (res.status === 401) {
                clearUser();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) {
                throw new Error(data?.message || data || 'Template deletion failed!');
            }

            return true;
        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, deleteTemplate };
};

export default useDeleteTemplate;