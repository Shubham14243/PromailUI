import React, { useState } from 'react'
import toast from 'react-hot-toast';
import apiCaller from '../utils/apiCaller';

const useSetNew = () => {

    const [loading, setLoading] = useState(false);

    const setNewPass = async ({passwordToken, newPassword, confirmPassword}) => {
        setLoading(true);
        try {

            const success = dataValidate(passwordToken, newPassword, confirmPassword);

            if(!success){
                return;
            }

            const reqBody = {
                "password_token" : passwordToken,
                "new_password" : newPassword
            }

            const {res, data} = await apiCaller('POST', '/api/v1/auth/setnew', reqBody);

            if (!res.ok) {
                const message = typeof data === 'object' && data?.message
                    ? data.message
                    : typeof data === 'string' && data.trim()
                        ? data
                        : 'Set Password Failed.';

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

    return {loading, setNewPass};

}

export default useSetNew;

function dataValidate(passwordToken, newPassword, confirmPassword) {
    if (!passwordToken || !newPassword || !confirmPassword) {
        toast.error("Please fill in all fields!");
        return false;
    }

    if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,25}$/)) {
        toast.error("Password must be 8-25 characters and include uppercase, lowercase, and a number!");
        return false;
    }

    if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match!");
        return false;
    }

    return true;
};