import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useResetInit from '../hooks/useResetInit';

const Reset = () => {

    const [email, setEmail] = useState("");
    const {loading, resetInit} = useResetInit();

    const handleResetTrigger = async (e) => {
        e.preventDefault();
        const success = await resetInit({email});
         if (success) {
            navigate('/login');
            toast.success("If an account exists with the provided email address, a password reset email has been sent.");
        }
    }

    return (
        <>
            <div className='p-4 h-screen flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center m-w-96 mx-auto w-96'>
                    <Link className="text-xl font-bold" to="/"><i className="bi bi-envelope-paper-fill" /> ProMail</Link>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">Reset Password</legend>

                        <label className="label">Email</label>
                        <input type="email" className="input" placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button className="btn btn-neutral mt-4" onClick={handleResetTrigger} >
                            {loading ? (<span className="loading loading-bars loading-sm"></span>) : 'Reset Password'}
                        </button>
                        <div className="w-full flex items-center justify-around gap-4">
                            <Link to="/signup" className='text-center mt-3'>SignUp</Link>
                            <Link to="/login" className='text-center mt-3'>Login </Link>
                        </div>
                    </fieldset>
                </div >
            </div >
        </>
    )
}

export default Reset;