import { useCallback } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';

const useRefreshToken = () => {
    const { user, setUser, clearUser } = useAuthStore();

    const refreshToken = useCallback(async () => {
        try {
            const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080';
            const res = await fetch(`${backendBaseUrl}/api/v1/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.auth_token || JSON.parse(localStorage.getItem('proMailUser') || 'null')?.auth_token || ''}`,
                },
                credentials: 'include',
            });

            const contentType = res.headers.get('Content-Type') || '';
            let data = null;

            if (contentType.includes('application/json')) {
                data = await res.json().catch(() => null);
            } else {
                data = await res.text().catch(() => '');
            }

            if (!res.ok) {
                clearUser();
                throw new Error(data?.message || 'Session expired. Please log in again.');
            }

            if (data?.type === 'failure' || data?.type === 'error') {
                clearUser();
                throw new Error(data?.message || 'Unable to refresh session.');
            }

            const refreshedUser = data?.data || user;
            setUser(refreshedUser);
            return refreshedUser;
        } catch (error) {
            toast.error(error.message || 'Session refresh failed.');
            clearUser();
            return null;
        }
    }, [clearUser, setUser, user]);

    return refreshToken;
};

export default useRefreshToken;
