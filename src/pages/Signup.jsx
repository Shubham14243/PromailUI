import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useSignUp from '../hooks/useSignUp';
import toast from 'react-hot-toast';

const Signup = () => {

    const [inputs, setInput] = useState({
        name: '',
        email: '',
        password: '',
        confirm: ''
    });

    const navigate = useNavigate();
    const {loading, signUp} = useSignUp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signUp(inputs);
        if (success) {
            navigate('/login');
            toast.success("SignUp Successful!\nPlease login to continue.");
        }
    }

    return (
        <>
            <div className='p-4 h-screen flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center m-w-96 mx-auto w-96'>
                    <h2 className='text-xl font-bold'>ProMail</h2>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">User SignUp</legend>

                        <label className="label">Name</label>
                        <input type="text" className="input" placeholder="Full Name"
                            value={inputs.name}
                            onChange={(e) => setInput({ ...inputs, name: e.target.value })}
                        />

                        <label className="label">Email</label>
                        <input type="email" className="input" placeholder="Email"
                            value={inputs.email}
                            onChange={(e) => setInput({ ...inputs, email: e.target.value })}
                        />

                        <label className="label">Password</label>
                        <input type="password" className="input" placeholder="Password"
                            value={inputs.password}
                            onChange={(e) => setInput({ ...inputs, password: e.target.value })}
                        />

                        <label className="label">Confirm Password</label>
                        <input type="password" className="input" placeholder="Confirm Password"
                            value={inputs.confirm}
                            onChange={(e) => setInput({ ...inputs, confirm: e.target.value })}
                        />

                        <button className="btn btn-neutral mt-4" onClick={handleSubmit}>
                            {loading ? (<span className="loading loading-spinner text-success"></span>) : 'SignUp'}
                        </button>
                        <Link to="/login" className='text-center mt-3'>Login Instead?</Link>
                    </fieldset>
                </div >
            </div>
        </>
    )
}

export default Signup;