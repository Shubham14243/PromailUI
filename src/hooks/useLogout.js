import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const logout = async () => {
        setLoading(true);
        try {
            const {res, data} = await apiCaller('POST', '/api/v1/auth/logout', {});

            clearUser();
            localStorage.setItem("proMailDocsSuggestion", "true");

            return true;
        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, logout };
};

export default useLogout;
