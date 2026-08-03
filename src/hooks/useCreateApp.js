import React, { useState } from 'react'
import toast from 'react-hot-toast';
import useRefreshToken from './useRefreshToken';

const useCreateApp = () => {

    const [loading, setLoading] = useState(false);
    const refreshToken = useRefreshToken();

    const createApp = async ({name, description}) => {
        setLoading(true);
        try {

            const success = dataValidate(name, description);

            if(!success){
                return;
            }

            const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080';
            const getAuthHeader = (token) => ({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
            });

            const makeRequest = async (token) => {
                const res = await fetch(`${backendBaseUrl}/api/v1/apps`, {
                    method: 'POST',
                    headers: getAuthHeader(token),
                    body: JSON.stringify({
                        name,
                        description,
                    }),
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
                        : 'CreateApp failed';

                throw new Error(message);
            }

            if(data === "failure" || data?.type === "error") {
                throw new Error(data?.message || 'CreateApp failed');
            }

            return true;

        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {loading, createApp};

}

export default useCreateApp;

function dataValidate(name, description){
    if(!name || !description){
        toast.error("Please enter Name and Description!");
        return false;
    }

    if (!name.match(/^[A-Za-z][A-Za-z0-9 ._/-]{4,49}$/)){
        toast.error("Please enter a valid name!");
        return false;
    }

    if (!description.match(/^(?!\s*$).{4,250}$/)){
        toast.error("Please enter a valid description!");
        return false;
    }

    return true;
};