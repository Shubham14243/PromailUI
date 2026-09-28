import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useSetNew from '../hooks/useSetNew';

const Setnew = () => {

    const { token: passwordToken } = useParams();

    const [newPassword, setNewPassword] = useState("");
    const [curPassword, setCurPassword] = useState("");
    const {loading, setNewPass} = useSetNew();
    const nav = useNavigate();

    const handleSetNewTrigger = async (e) => {
        e.preventDefault();
        const success = await setNewPass({ passwordToken, newPassword, confirmPassword: curPassword });
         if (success) {
            nav('/login');
            toast.success("New Password set successfully. Please Login!");
        }
    }

    return (
        <>
            <div className='p-4 h-screen flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center m-w-96 mx-auto w-96'>
                    <Link className="text-xl font-bold" to="/"><i className="bi bi-envelope-paper-fill" /> ProMail</Link>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">Set New Password</legend>

                        <label className="label">New Password</label>
                        <input type="password" className="input" placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <label className="label">Confirm Password</label>
                        <input type="password" className="input" placeholder="Confirm Password"
                            value={curPassword}
                            onChange={(e) => setCurPassword(e.target.value)}
                        />

                        <button className="btn btn-neutral mt-4" onClick={handleSetNewTrigger} >
                            {loading ? (<span className="loading loading-bars loading-sm"></span>) : 'Set Password'}
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

export default Setnew;