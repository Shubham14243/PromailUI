import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import toast from 'react-hot-toast';

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

    return (
        <>
            <div className="navbar bg-neutral shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/logs">Email Logs</Link></li>
                            <li><a>About</a></li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    <Link to="/" className="btn btn-ghost text-xl">ProMail</Link>
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
        </>
    )
}

export default Navbar;