import React, { useState } from 'react'
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useSendTestEmail = () => {

    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const sendTestEmail = async ({appID, mailKey, email, subject, body}) => {
        setLoading(true);
        try {

            const success = dataValidate(email, subject, body);

            if(!success){
                return;
            }

            const {res, data} = await apiCaller('POST', '/api/v1/email/send/test', {
                app_id: parseInt(appID), 
                mail_key: mailKey,
                to: email, 
                subject, 
                body});

            if (res.status === 401) {
                clearUser();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) {
                const message = typeof data === 'object' && data?.message
                    ? data.message
                    : typeof data === 'string' && data.trim()
                        ? data
                        : 'Test email failed!';

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

    return {loading, sendTestEmail};

}

export default useSendTestEmail;

function dataValidate(email, subject, body){
    if(!email || !subject || !body){
        toast.error("Please fill in all fields!");
        return false;
    }

    if (!email.match(/^\S+@\S+\.\S+$/)){
        toast.error("Please enter a valid email!");
        return false;
    }

    if (!subject.match(/^[A-Za-z0-9 ._/-|!]{5,100}$/)){
        toast.error("Invalid template subject: 5-100 chars, letters, numbers and spaces and characters ['.','_','-','/','|'] only.");
        return false;
    }

    if (!body.match(/^(?!\s*$).{4,500}$/)){
        toast.error("Please enter a valid body!");
        return false;
    }

    return true;
};