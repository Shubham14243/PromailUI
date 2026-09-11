import React, { useState } from 'react'
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useDeleteApp = () => {

    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const deleteApp = async (appId) => {
        setLoading(true);
        try {
            const {res, data} = await apiCaller('DELETE', `/api/v1/apps/${appId}`);

            if (res.status === 401) {
                clearUser();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) {
                const message = typeof data === 'object' && data?.message
                    ? data.message
                    : typeof data === 'string' && data.trim()
                        ? data
                        : 'App Deletion failed!';

                throw new Error(message);
            }

            return true;

        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {loading, deleteApp};

}

export default useDeleteApp;