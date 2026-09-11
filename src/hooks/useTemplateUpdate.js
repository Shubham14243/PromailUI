import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useTemplateUpdate = () => {
    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const updateTemplate = async (templateID, { name, slug, subject, status }) => {
        setLoading(true);
        try {
            if (!name || !slug || !subject || (status !== true && status !== false)) {
                toast.error('Please enter all fields!');
                return false;
            }

            const { res, data } = await apiCaller('PUT', `/api/v1/templates/${templateID}`, {
                name,
                slug,
                subject,
                status: status ? 'active' : 'inactive',
            });

            if (res.status === 401) {
                clearUser();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) {
                throw new Error(data?.message || data || 'Template update failed!');
            }

            return true;
        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, updateTemplate };
};

export default useTemplateUpdate;