import React, { useState } from 'react'
import toast from 'react-hot-toast';

const useSignUp = () => {

    const [loading, setLoading] = useState(false);

    const signUp = async ({ name, email, password, confirm }) => {
        setLoading(true);
        try {

            const success = dataValidate(name, email, password, confirm);

            if (!success) {
                return;
            }

            const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080';
            const res = await fetch(`${backendBaseUrl}/api/v1/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                }),
                credentials: 'include',
            })

            const contentType = res.headers.get('Content-Type') || '';
            let data = null;

            if (contentType.includes('application/json')) {
                data = await res.json().catch(() => null);
            } else {
                data = await res.text().catch(() => '');
            }

            if (!res.ok) {
                const message = typeof data === 'object' && data?.message
                    ? data.message
                    : typeof data === 'string' && data.trim()
                        ? data
                        : 'SignUp failed';

                throw new Error(message);
            }

            if (data === "failure" || data?.type === "error") {
                throw new Error(data?.message || 'SignUp failed');
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