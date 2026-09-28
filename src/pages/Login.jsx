import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import toast from 'react-hot-toast';

const Login = () => {

    const [inputs, setInput] = useState({
        email: 'mailroom396@gmail.com',
        password: 'Shubham@123'
    });

    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(inputs);
        if (success) {
            toast.success("Login Successful");
        }
    }

    return (
        <>
            <div className='p-4 h-screen flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center m-w-96 mx-auto w-96'>
                    <Link className="text-xl font-bold" to="/"><i className="bi bi-envelope-paper-fill" /> ProMail</Link>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">User Login</legend>

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

                        <button className="btn btn-neutral mt-4" onClick={handleSubmit}>
                            {loading ? (<span className="loading loading-bars loading-sm"></span>) : 'Login'}
                        </button>
                        <div className="w-full flex items-center justify-around gap-4">
                            <Link to="/reset" className='text-center mt-3'>Reset Password </Link>
                            <Link to="/signup" className='text-center mt-3'>SignUp Instead?</Link>
                        </div>
                    </fieldset>
                </div >
            </div >
        </>
    )
}

export default Login;