import React, { useState } from 'react'
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useUserUpdate = () => {

    const [loading, setLoading] = useState(false);
    const { clearUser, getStoredUser, setUser } = useAuthStore();

    const updateUser = async ({name, email}) => {
        setLoading(true);
        try {

            const success = dataValidate(name, email);

            if(!success){
                return;
            }

            const requestBody = {
                name,
                email
            }

            const {res, data} = await apiCaller('PUT', `/api/v1/users`, requestBody);

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
                
            const initialUser = getStoredUser();
            initialUser.name = name;
            initialUser.email = email;
            setUser(initialUser);

            return true;

        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {loading, updateUser};

}

export default useUserUpdate;

function dataValidate(name, email){
    if (!name || !email) {
        toast.error("Please fill in all fields!");
        return false;
    }

    if (!name.match(/^[a-zA-Z ]{2,50}$/)) {
        toast.error("Please enter a valid name!");
        return false;
    }

    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        toast.error("Please enter a valid email!");
        return false;
    }

    return true;
};