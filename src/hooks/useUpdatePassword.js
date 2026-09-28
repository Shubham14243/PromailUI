import { useState } from 'react'
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useUpdatePassword = () => {

    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const updatePassword = async ({currentPassword, newPassword, confirmPassword}) => {
        setLoading(true);
        try {

            const success = dataValidate(currentPassword, newPassword, confirmPassword);

            if(!success){
                return;
            }

            const requestBody = {
                "current_password": currentPassword,
                "new_password": newPassword
            }

            const {res, data} = await apiCaller('PUT', `/api/v1/users/password`, requestBody);

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

    return {loading, updatePassword};

}

export default useUpdatePassword;

function dataValidate(currentPassword, newPassword, confirmPassword){
    if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Please fill in all fields!");
        return false;
    }

    if (!currentPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,25}$/)) {
        toast.error("Password must be 8-25 characters and include uppercase, lowercase, and a number!");
        return false;
    }

    if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,25}$/)) {
        toast.error("New password must be 8-25 characters and include uppercase, lowercase, and a number!");
        return false;
    }

    if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match!");
        return false;
    }

    return true;
};