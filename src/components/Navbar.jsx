import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import toast from 'react-hot-toast';
import useAuthStore from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { loading, logout } = useLogout();

    const handleLogout = async () => {
        const success = await logout();

        if (success) {
            navigate('/login');
            toast.success("Logout Successful");
        }
    };

    const { user } = useAuthStore();
    const authUser = user;

    return (
        <>
            {authUser ? (
                <div className="navbar bg-neutral shadow-sm">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                            </div>
                            <ul
                                tabIndex={-1}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li><Link to="/home">Home</Link></li>
                                <li><Link to="/docs">Documentation</Link></li>
                                <li><Link to="/logs">Email Logs</Link></li>
                            </ul>
                        </div>
                        <Link className="text-xl font-bold" to="/"><i className="bi bi-envelope-paper-fill" /> ProMail</Link>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/docs">Documentation</Link></li>
                            <li><Link to="/logs">Email Logs</Link></li>
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <div className="tooltip tooltip-bottom" data-tip="Profile">
                            <Link to="/profile" className="btn btn-ghost btn-circle">
                                <i className="bi bi-file-person text-lg"></i>
                            </Link>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="Logout">
                            <button
                                type="button"
                                className="btn btn-ghost btn-circle"
                                onClick={handleLogout}
                                disabled={loading}
                            >
                                <i className="bi bi-box-arrow-right text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <header className="container bg-neutral">
                    <div className="navbar shadow-sm">
                        <div className="navbar-start">
                            <div className="dropdown">
                                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                    <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                                </div>
                                <ul
                                    tabIndex={-1}
                                    className="menu menu-sm dropdown-content  bg-neutral rounded-box z-1 mt-3 w-52 p-2 shadow">
                                    <li><Link to="/docs">Docs</Link></li>
                                    <li><Link to="/#features">Features</Link></li>
                                    <li><Link to="/#workflow">How it works?</Link></li>
                                    <li><Link to="/#pricing">Pricing</Link></li>
                                </ul>
                            </div>
                            <Link className="text-xl font-bold" to="/"><i className="bi bi-envelope-paper-fill" /> ProMail</Link>
                        </div>
                        <div className="navbar-center hidden lg:flex">
                            <ul className="menu menu-horizontal px-1">
                                <li><Link to="/docs">Docs</Link></li>
                                <li><Link to="/#features">Features</Link></li>
                                <li><Link to="/#workflow">How it works?</Link></li>
                                <li><Link to="/#pricing">Pricing</Link></li>
                            </ul>
                        </div>
                        <div className="navbar-end gap-2">
                            <Link to="/login" className="btn btn-ghost">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary">Get Started</Link>
                        </div>
                    </div>
                </header>
            )}
        </>
    )
}

export default Navbar;