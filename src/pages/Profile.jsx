import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';

const initialProfile = {
    id: 1,
    uuid: 'a821d368-0b1e-4f90-98aa-90f000cb35e9',
    name: 'Shubham Gupta',
    email: 'mailroom396@gmail.com',
    created_at: '2026-07-14T11:43:18.542181Z',
    updated_at: '2026-07-14T11:43:18.542181Z',
};

const Profile = () => {
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

    const handleProfileSubmit = (event) => {
        event.preventDefault();
        setProfile((prev) => ({ ...prev, updated_at: new Date().toISOString() }));
        toast.success('Profile updated successfully');
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = (event) => {
        event.preventDefault();

        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            toast.error('Please complete all password fields');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        toast.success('Password updated successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (confirmed) {
            toast.error('Account deletion is not available in the demo');
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-base-200 px-4 py-8">
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
                                            className="input input-bordered"
                                            placeholder="Your full name"
                                        />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text">Email address</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            className="input input-bordered"
                                            readOnly
                                            disabled
                                        />
                                    </label>
                                </div>

                                <label className="form-control">
                                    <span className="label-text">User ID</span>
                                    <input type="text" value={profile.uuid} className="input input-bordered" readOnly disabled />
                                </label>

                                <div className="rounded-box bg-base-200 p-4 text-sm text-base-content/70">
                                    <p><span className="font-semibold">Last updated:</span> {new Date(profile.updated_at).toLocaleString()}</p>
                                </div>

                                <div className="card-actions justify-end">
                                    <button type="submit" className="btn btn-primary">Save changes</button>
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
                                        className="input input-bordered"
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
                                        className="input input-bordered"
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
                                        className="input input-bordered"
                                        placeholder="Re-enter new password"
                                    />
                                </label>

                                <div className="card-actions justify-end">
                                    <button type="submit" className="btn btn-outline">Update password</button>
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
                                <button type="button" onClick={handleDeleteAccount} className="btn btn-error">Delete account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;