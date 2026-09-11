import React, { useState } from 'react'
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useUpdateApp = () => {

    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const updateApp = async (appID, {name, description, status}) => {
        setLoading(true);
        try {

            const success = dataValidate(name, description, status);

            if(!success){
                return;
            }

            const requestBody = {
                name,
                description,
                status: status === true ? 'active' : 'inactive'
            }

            const {res, data} = await apiCaller('PUT', `/api/v1/apps/${appID}`, requestBody);

            if (res.status === 401) {
                clearUser();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) {
                const message = typeof data === 'object' && data?.message
                    ? data.message
                    : typeof data === 'string' && data.trim()
                        ? data
                        : 'App Updation failed!';

                throw new Error(message);
            }

            return true;

        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {loading, updateApp};

}

export default useUpdateApp;

function dataValidate(name, description, status){
    if(!name || !description || (status !== true && status !== false)){
        toast.error("Please enter all fields!");
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

    if(status !== true && status !== false){
        toast.error("Please select a valid status!");
        return false;
    }

    return true;
};