import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import useRefreshToken from './useRefreshToken';

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();
    const refreshToken = useRefreshToken();

    const logout = async () => {
        setLoading(true);
        try {
            const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080';
            const getAuthHeader = (token) => ({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
            });

            const makeRequest = async (token) => {
                const res = await fetch(`${backendBaseUrl}/api/v1/auth/logout`, {
                    method: 'POST',
                    headers: getAuthHeader(token),
                    credentials: 'include',
                });

                const contentType = res.headers.get('Content-Type') || '';
                let data = null;

                if (contentType.includes('application/json')) {
                    data = await res.json().catch(() => null);
                } else {
                    data = await res.text().catch(() => '');
                }

                return { res, data };
            };

            let { res, data } = await makeRequest(JSON.parse(localStorage.getItem('proMailUser') || 'null')?.auth_token || '');

            if (res.status === 401) {
                const refreshedUser = await refreshToken();
                if (!refreshedUser) {
                    return false;
                }

                const retry = await makeRequest(refreshedUser.auth_token || '');
                res = retry.res;
                data = retry.data;
            }

            if (!res.ok) {
                const message = typeof data === 'object' && data?.message
                    ? data.message
                    : typeof data === 'string' && data.trim()
                        ? data
                        : 'Logout failed';

                throw new Error(message);
            }

            if (data === 'failure' || data?.type === 'error') {
                throw new Error(data?.message || 'Logout failed');
            }

            localStorage.removeItem('proMailUser');
            clearUser();
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
