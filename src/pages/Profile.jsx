import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import useAuthStore from "../context/AuthContext";
import useUserUpdate from '../hooks/useUserUpdate';
import useUpdatePassword from '../hooks/useUpdatePassword';

const Profile = () => {

    const { getStoredUser } = useAuthStore();
    const initialProfile = getStoredUser();

    const [profile, setProfile] = useState(initialProfile);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const { loading, updateUser } = useUserUpdate();

    const handleProfileSubmit = (event) => {
        event.preventDefault();
        setProfile((prev) => ({ ...prev, updated_at: new Date().toISOString() }));

        const success = updateUser({ name: profile.name, email: profile.email });
        if (success) {
            toast.success('Profile updated successfully');
            return;
        }
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const { loading: passwordLoading, updatePassword } = useUpdatePassword();

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        const successP = await updatePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword, confirmPassword: passwords.confirmPassword });
        if (successP) {
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('Password updated successfully');
            return;
        }
    };

    const handleDeleteAccount = () => {
        // Implement account deletion logic here
        document.getElementById('deleteModal').close()
        toast.success('Account deleted successfully');
    };

    return (
        <>
            <Navbar />

            <div className="min-h-[calc(100vh-5rem)] bg-base-200 px-4 py-8">
                <div className="mx-auto flex max-w-6xl flex-col gap-6">
                    <div className="rounded-2xl bg-base-100 p-6 shadow-sm">
                        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Profile</p>
                                <h1 className="text-3xl font-bold">Account settings</h1>
                                <p className="text-sm text-base-content/70">Manage your public profile details and security preferences.</p>
                            </div>
                            <div className="badge badge-outline badge-primary">Member since {new Date(profile.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <form onSubmit={handleProfileSubmit} className="card bg-base-100 shadow-sm">
                            <div className="card-body gap-4">
                                <div>
                                    <h2 className="card-title">Personal information</h2>
                                    <p className="text-sm text-base-content/70">Update your name and view your account details.</p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <label className="form-control">
                                        <span className="label-text">Full name</span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleProfileChange}
                                            className="input input-bordered w-full"
                                            placeholder="Your full name"
                                        />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text">Email address</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            className="input input-bordered w-full"
                                            readOnly
                                            disabled
                                        />
                                    </label>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <label className="form-control">
                                        <span className="label-text">User ID</span>
                                        <input type="text" value={profile.uuid} className="input input-bordered w-full" readOnly disabled />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text">Last updated</span>
                                        <input type="text" value={new Date(profile.updated_at).toLocaleString()} className="input input-bordered w-full" readOnly disabled />
                                    </label>
                                </div>

                                <div className="card-actions justify-end">
                                    <button type="submit" className="btn btn-primary">
                                        {loading ? (<span className="loading loading-spinner loading-sm"></span>) : "Save changes"}</button>
                                </div>
                            </div>
                        </form>

                        <form onSubmit={handlePasswordSubmit} className="card bg-base-100 shadow-sm">
                            <div className="card-body gap-4">
                                <div>
                                    <h2 className="card-title">Update password</h2>
                                    <p className="text-sm text-base-content/70">Use a strong password and keep it up to date.</p>
                                </div>

                                <label className="form-control">
                                    <span className="label-text">Current password</span>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwords.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="input input-bordered w-full"
                                        placeholder="Enter current password"
                                    />
                                </label>

                                <label className="form-control">
                                    <span className="label-text">New password</span>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        className="input input-bordered w-full"
                                        placeholder="Enter new password"
                                    />
                                </label>

                                <label className="form-control">
                                    <span className="label-text">Confirm password</span>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="input input-bordered w-full"
                                        placeholder="Re-enter new password"
                                    />
                                </label>

                                <div className="card-actions justify-end">
                                    <button type="submit" className="btn btn-outline">
                                        {passwordLoading ? (<span className="loading loading-spinner loading-sm"></span>) : "Update Password"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="card border border-error/30 bg-base-100 shadow-sm">
                        <div className="card-body gap-4">
                            <div>
                                <h2 className="card-title text-error">Danger zone</h2>
                                <p className="text-sm text-base-content/70">Deleting your account will remove your access and data from the demo workspace.</p>
                            </div>

                            <div className="card-actions justify-start">
                                <button type="button" onClick={() => document.getElementById('deleteModal').showModal()} className="btn btn-error">Delete account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <dialog id="deleteModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete your account?</h3>
                    <p className="pt-4">Do you confirm you want to delete your account?</p>
                    <p className="py-1">All your apps, templates and data will be permanently deleted.</p>
                    <p className="pb-2">This action cannot be undone.</p>
                    <div className="modal-action">
                        <button type="button" onClick={handleDeleteAccount} className="btn btn-error">
                            {loading ? (<span className="loading loading-spinner loading-sm"></span>) : "Yes, delete my account"}
                        </button>
                        <button type="button" onClick={() => document.getElementById('deleteModal').close()} className="btn btn-primary">Cancel</button>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default Profile;