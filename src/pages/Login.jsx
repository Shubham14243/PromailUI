import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Login = () => {

    const [inputs, setInput] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs)
    }

    return (
        <>
            <div className='p-4 h-screen flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center m-w-96 mx-auto w-96'>
                    <h2 className='text-xl font-bold'>ProMail</h2>
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

                        <button className="btn btn-neutral mt-4" onClick={handleSubmit}>Login</button>
                        <Link to="/signup" className='text-center mt-3'>SignUp Instead?</Link>
                    </fieldset>
                </div >
            </div >
        </>
    )
}

export default Login;