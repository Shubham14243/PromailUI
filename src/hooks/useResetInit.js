import { useState } from 'react'
import toast from 'react-hot-toast';
import apiCaller from '../utils/apiCaller';

const useResetInit = () => {

    const [loading, setLoading] = useState(false);

    const resetInit = async ({email}) => {
        setLoading(true);
        try {

            const success = dataValidate(email);

            if(!success){
                return;
            }

            const {res, data} = await apiCaller('POST', '/api/v1/auth/reset', {email});

            if (res.status >= 500 && res.status < 600) {
                throw new Error('Something went wrong. Please try again after sometime.');
            }

            return true;

        } catch (error) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {loading, resetInit};

}

export default useResetInit;

function dataValidate(email){
    if(!email){
        toast.error("Please enter Email!");
        return false;
    }

    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        toast.error("Please enter a valid email!");
        return false;
    }

    return true;
};