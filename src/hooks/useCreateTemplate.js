import React, { useState } from 'react'
import toast from 'react-hot-toast';
import useAuthStore from '../context/AuthContext';
import apiCaller from '../utils/apiCaller';

const useCreateTemplate = (appID) => {

    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

    const createTemplate = async ({name, slug, subject, contentType}) => {
        setLoading(true);
        try {

            const success = dataValidate(name, slug, subject, contentType);

            if(!success){
                return;
            }

            const payload = {
                app_id: parseInt(appID, 10),
                name,
                slug,
                subject,
                type: contentType,
                content: contentType === 'html' ? '<p>Hello, World!</p>' : 'Hello, World!',
            };

            const {res, data} = await apiCaller('POST', '/api/v1/templates', payload);

            if (res.status === 401) {
                clearUser();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) {
                const message = typeof data === 'object' && data?.message
                    ? data.message
                    : typeof data === 'string' && data.trim()
                        ? data
                        : 'Template Creation failed!';

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

    return {loading, createTemplate};

}

export default useCreateTemplate;

function dataValidate(name, slug, subject, contentType){
    if(!name || !slug || !subject || !contentType){
        toast.error("Please fill in all the fields!");
        return false;
    }

    if (!name.match(/^[A-Za-z][A-Za-z0-9 ._/-]{4,49}$/)){
        toast.error("Invalid template name: 5-50 chars, starting with letter, letters, numbers, spaces and characters ['.','_','-','/'] only.");
        return false;
    }

    if (!slug.match(/^[a-z0-9-]{5,50}$/)){
        toast.error("Invalid template slug: 5-50 chars, lowercase letters, numbers and hyphens only.");
        return false;
    }

    if (!subject.match(/^[A-Za-z0-9 ._/-|!]{5,100}$/)){
        toast.error("Invalid template subject: 5-100 chars, letters, numbers and spaces and characters ['.','_','-','/','|'] only.");
        return false;
    }

    if (contentType !== 'html' && contentType !== 'text'){
        toast.error("Invalid template type: must be either 'html' or 'text'.");
        return false;
    }

    return true;
}