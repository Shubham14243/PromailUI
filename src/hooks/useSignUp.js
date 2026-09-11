import React, { useState } from 'react'
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useSignUp = () => {

    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const signUp = async ({ name, email, password, confirm }) => {
        setLoading(true);
        try {

            const success = dataValidate(name, email, password, confirm);

            if (!success) {
                return;
            }

            const {res, data} = await apiCaller('POST', '/api/v1/auth/signup', {name, email, password});

            if (res.status === 401) {
                clearUser();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) {
                const message = typeof data === 'object' && data?.message
                    ? data.message
                    : typeof data === 'string' && data.trim()
                        ? data
                        : 'SignUp Failed!';

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

    return { loading, signUp };

}

export default useSignUp;

function dataValidate(name, email, password, confirm) {
    if (!name || !email || !password || !confirm) {
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

    if (password !== confirm) {
        toast.error("Passwords do not match!");
        return false;
    }

    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,25}$/)) {
        toast.error("Password must be 8-25 characters and include uppercase, lowercase, and a number!");
        return false;
    }

    return true;
};