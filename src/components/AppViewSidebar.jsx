import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useUpdateApp from "../hooks/useAppUpdate";
import useGetAppKey from "../hooks/useGetAppKey";
import toast from "react-hot-toast";
import useGetAppConfig from "../hooks/useGetAppConfig";
import useAppConfigUpdate from "../hooks/useAppConfigUpdate";
import useDeleteApp from "../hooks/useDeleteApp";

const AppViewSidebar = ({ appData, loading = false, setAppDataRefresh }) => {
    const app = appData || {
        id: 0,
        name: loading ? 'Loading app...' : 'CMS App',
        description: loading ? 'Fetching app details' : 'CMS app for Order Admins.',
        status: loading ? 'pending' : 'active',
        created_at: null,
        updated_at: null,
    };

    const formatDate = (iso) => {
        if (!iso) return "—";

        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const [updateInputs, setUpdateInputs] = useState({
        name: app?.name || '',
        description: app?.description || '',
        status: app?.status === 'active',
    });

    useEffect(() => {
        setUpdateInputs({
            name: app?.name || '',
            description: app?.description || '',
            status: app?.status === 'active',
        });
    }, [app?.name, app?.description, app?.status]);

    const { loading: updateLoading, updateApp } = useUpdateApp();

    const handleAppUpdate = async (e) => {
        e.preventDefault();
        if (!app?.id) {
            toast.error('App data is not ready yet.');
            return;
        }

        const success = await updateApp(app.id, updateInputs);
        if (success) {
            setUpdateInputs({
                name: updateInputs.name,
                description: updateInputs.description,
                status: updateInputs.status,
            });
            toast.success('App updated successfully!');
            document.getElementById('UpdateAppModal').close();
            if (typeof setAppDataRefresh === 'function') {
                setAppDataRefresh((prev) => prev + 1);
            }
        }
    }

    const { loading: keyLoading, getAppKey, refreshAppKey } = useGetAppKey();
    const [appKey, setAppKey] = useState('****************');
    const [showKey, setShowKey] = useState(false);

    const handleKeyView = async () => {
        if (!app?.id) {
            toast.error('App data is not ready yet.');
            return;
        }

        if (showKey === true) {
            setAppKey('****************');
            setShowKey(false);
            return;
        }

        const fetchedAppKey = await getAppKey(app.id);
        if (fetchedAppKey && fetchedAppKey !== '****************') {
            setAppKey(fetchedAppKey);
            setShowKey(true);
        } else {
            setAppKey('****************');
        }
    }

    const handleKeyRefresh = async () => {
        if (!app?.id) {
            toast.error('App data is not ready yet.');
            return;
        }

        const success = await refreshAppKey(app.id);

        if (success !== true) {
            return;
        }

        const fetchedAppKey = await getAppKey(app.id);
        if (fetchedAppKey && fetchedAppKey !== '****************') {
            setAppKey(fetchedAppKey);
            setShowKey(true);
        } else {
            setAppKey('****************');
        }
        document.getElementById('refreshModal').close();
    }

    const [configVar, setConfigVar] = useState({
        smtpHost: "",
        smtpPort: "",
        senderName: "",
        senderEmail: "",
        smtpAppKey: "",
        openTrack: false,
        clickTrack: false,
        autoRetry: false,
        maxRetryCount: "",
    });

    const [configRefresh, setConfigRefresh] = useState(0);
    const { loading: configLoading, configData } = useGetAppConfig(app.id, configRefresh)

    const handleConfigModalOpen = async () => {
        if (configLoading) {
            toast('Loading app configuration...');
            return;
        }

        if (configData !== null) {

            setConfigVar({
                smtpHost: configData.smtp_host,
                smtpPort: configData.smtp_port,
                senderName: configData.smtp_name,
                senderEmail: configData.smtp_username,
                smtpAppKey: configData.smtp_password,
                openTrack: configData.open_track === 'active' ? true : false,
                clickTrack: configData.click_track === 'active' ? true : false,
                autoRetry: configData.auto_retry === 'active' ? true : false,
                maxRetryCount: configData.retry_max_count,
            })
        } else {
            setConfigVar({
                smtpHost: "",
                smtpPort: "",
                senderName: "",
                senderEmail: "",
                smtpAppKey: "",
                openTrack: false,
                clickTrack: false,
                autoRetry: false,
                maxRetryCount: "",
            });
        }

        document.getElementById('appConfigModal').showModal()
    }

    const { loading: configUpdateLoading, configUpdate } = useAppConfigUpdate();

    const handleConfigUpdate = async (e) => {
        e.preventDefault();

        let action = "PUT"

        if (configData === null) {
            action = "POST"
        }

        const success = await configUpdate(configVar, action, app.id);
        if (success) {
            toast.success('App Config updated successfully!');
            document.getElementById('appConfigModal').close();
            if (typeof setAppDataRefresh === 'function') {
                setAppDataRefresh((prev) => prev + 1);
            }
            setConfigRefresh((prev) => prev + 1);
        }

    }

    const { loading: deleteLoading, deleteApp } = useDeleteApp();
    const navigate = useNavigate();

    const handleAppDelete = async (e) => {
        e.preventDefault();
        if (!app?.id) {
            toast.error('App data is not ready yet.');
            return;
        }
        const success = await deleteApp(app.id);
        if (success) {
            navigate('/home');
            document.getElementById('appDeleteModal').close();
            toast.success('App deleted successfully!');
            if (typeof setAppDataRefresh === 'function') {
                setAppDataRefresh((prev) => prev + 1);
            }
        }
    };

    return (
        <>
            <div className="">
                <div className="card bg-neutral text-neutral-content shadow-xl mb-4">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <h2 className="card-title"><Link to="/home">Home</Link> / <Link to={`/app/${app.id}`} >{app.name}</Link></h2>
                        </div>
                    </div>
                </div>
                <div className="card bg-neutral text-neutral-content shadow-xl mb-4">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <h2 className="card-title">{app.name}</h2>
                            <span
                                className={`badge ${app.status === "active" ? "badge-success" : "badge-error"
                                    }`}
                            >
                                {app.status}
                            </span>
                        </div>
                        <p className="text-sm opacity-80">{app.description}</p>
                        <div className="text-xs opacity-70 mt-2 space-y-1">
                            <p>App ID: {app.id}</p>
                            <p>Created: {formatDate(app.created_at)}</p>
                            <p>Updated: {formatDate(app.updated_at)}</p>
                        </div>
                        <div className="card-actions justify-end mt-3">
                            <button className="btn btn-ghost btn-sm" onClick={() => document.getElementById('UpdateAppModal').showModal()}>Edit</button>
                            <button className="btn btn-primary btn-sm" onClick={handleConfigModalOpen} disabled={configLoading}>
                                {configLoading ? 'Loading...' : 'Configs'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card bg-neutral text-neutral-content shadow-xl mb-4">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <h2 className="card-title">Mail Key</h2>
                        </div>
                        <input
                            type="text"
                            value={showKey ? appKey : '****************'}
                            className="input"
                            onClick={async (e) => {
                                if (!showKey) {
                                    return;
                                }

                                try {
                                    await navigator.clipboard.writeText(e.currentTarget.value);
                                    toast.success('Mail Key copied to clipboard!');
                                } catch {
                                    toast.error('Failed to copy app key.');
                                }
                            }}
                            readOnly
                        />
                        <div className="card-actions justify-end mt-3">
                            <button className="btn btn-ghost btn-sm"
                                onClick={()=>document.getElementById('refreshModal').showModal()}
                                disabled={keyLoading}
                            >
                                {keyLoading ? (<span className="loading loading-spinner text-default"></span>) : 'Refresh'}
                            </button>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={handleKeyView}
                                disabled={keyLoading}
                            >
                                {keyLoading ? (<span className="loading loading-spinner text-default"></span>) : showKey ? 'Hide' : 'View'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card bg-neutral text-neutral-content shadow-xl">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <h2 className="card-title">Danger Zone</h2>
                        </div>
                        <div className="card-actions justify-end mt-3">
                            <button className="btn btn-error btn-sm" onClick={() => document.getElementById('appDeleteModal').showModal()}>Delete App</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Update App Modal */}
            <dialog id="UpdateAppModal" className="modal">
                <div className="modal-box p-1">
                    <div className="card bg-neutral text-neutral-content w-full">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Update your App!</h2>
                            <fieldset className="fieldset rounded-box w-xs p-4">
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="App Name"
                                    value={updateInputs.name}
                                    onChange={(e) => setUpdateInputs({ ...updateInputs, name: e.target.value })}
                                />
                                <textarea
                                    className="textarea"
                                    placeholder="App Short Description"
                                    value={updateInputs.description}
                                    onChange={(e) => setUpdateInputs({ ...updateInputs, description: e.target.value })}
                                ></textarea>
                                <div className="flex items-center justify-around gap-2 mt-2">
                                    <label htmlFor="status"><span className="text-lg">Status</span></label>
                                    <input
                                        type="checkbox"
                                        id="status"
                                        className="toggle toggle-success"
                                        checked={Boolean(updateInputs.status)}
                                        onChange={(e) => setUpdateInputs({ ...updateInputs, status: e.target.checked })}
                                    />
                                </div>
                            </fieldset>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary" onClick={handleAppUpdate}>
                                    {updateLoading ? (<span className="loading loading-spinner text-success"></span>) : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>

            {/* App Config Modal */}
            <dialog id="appConfigModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">App Config!</h3>
                    <p className="py-4">Find here the app Configurations to send email.</p>
                    <fieldset className="fieldset rounded-box w-full p-4">
                        <label className="label">SMTP Host</label>
                        <input type="text" className="input w-full" placeholder="SMTP Host"
                            value={configVar.smtpHost}
                            onChange={(e) => setConfigVar({ ...configVar, smtpHost: e.target.value })}
                        />
                        <label className="label">SMTP Port</label>
                        <input type="text" className="input w-full" placeholder="SMTP Port"
                            value={configVar.smtpPort}
                            onChange={(e) => setConfigVar({ ...configVar, smtpPort: e.target.value })}
                        />
                        <label className="label">Sender Name</label>
                        <input type="text" className="input w-full" placeholder="Sender Name"
                            value={configVar.senderName}
                            onChange={(e) => setConfigVar({ ...configVar, senderName: e.target.value })}
                        />
                        <label className="label">Sender Email</label>
                        <input type="text" className="input w-full" placeholder="Sender Email"
                            value={configVar.senderEmail}
                            onChange={(e) => setConfigVar({ ...configVar, senderEmail: e.target.value })}
                        />
                        <label className="label">SMTP Password</label>
                        <input type="text" className="input w-full" placeholder="SMTP Password"
                            value={configVar.smtpAppKey}
                            onChange={(e) => setConfigVar({ ...configVar, smtpAppKey: e.target.value })}
                        />
                        <div className="flex items-center justify-around gap-2 mt-2">
                            <label htmlFor="openTrack"><span className="text-md">Open Tracking</span></label>
                            <input
                                type="checkbox"
                                id="openTrack"
                                className="toggle toggle-success"
                                checked={Boolean(configVar.openTrack)}
                                onChange={(e) => setConfigVar({ ...configVar, openTrack: e.target.checked })}
                            />
                        </div>
                        <div className="flex items-center justify-around gap-2 mt-2">
                            <label htmlFor="clickTrack"><span className="text-md">Click Tracking</span></label>
                            <input
                                type="checkbox"
                                id="clickTrack"
                                className="toggle toggle-success"
                                checked={Boolean(configVar.clickTrack)}
                                onChange={(e) => setConfigVar({ ...configVar, clickTrack: e.target.checked })}
                            />
                        </div>
                        <div className="flex items-center justify-around gap-2 mt-2">
                            <label htmlFor="autoRetry"><span className="text-md">Auto Retry</span></label>
                            <input
                                type="checkbox"
                                id="autoRetry"
                                className="toggle toggle-success"
                                checked={Boolean(configVar.autoRetry)}
                                onChange={(e) => setConfigVar({ ...configVar, autoRetry: e.target.checked })}
                            />
                        </div>
                        <label className="label">Max Retry Count</label>
                        <input type="text" className="input w-full" placeholder="Max Retry Count"
                            value={configVar.maxRetryCount}
                            onChange={(e) => setConfigVar({ ...configVar, maxRetryCount: e.target.value })}
                        />
                    </fieldset>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary" onClick={handleConfigUpdate} disabled={configUpdateLoading}>
                            {configUpdateLoading ? (<span className="loading loading-spinner text-success"></span>) : 'Submit'}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* App Delete Modal */}
            <dialog id="appDeleteModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Delete App!</h3>
                    <p className="py-4">Are you sure you want to delete this app? This action cannot be undone.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-error" onClick={handleAppDelete}>
                            {deleteLoading ? (<span className="loading loading-spinner text-success"></span>) : "Yes, Delete!" }
                        </button>
                        <button className="btn btn-primary" onClick={() => document.getElementById('appDeleteModal').close()}>
                            No, Cancel!
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Refresh Modal */}
            <dialog id="refreshModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Refresh App MailKey?</h3>
                    <p className="pt-4">Do you confirm you want to refresh your app's mail key?</p>
                    <p className="py-1">This will invalidate the current mail key and generate a new one.</p>
                    <p className="pb-2">This action cannot be undone. The current email deliveries can fail.</p>
                    <div className="modal-action">
                        <button type="button" onClick={handleKeyRefresh} className="btn btn-error" disabled={keyLoading}>
                            {keyLoading ? (<span className="loading loading-spinner text-default"></span>) : 'Yes, refresh mailkey'}
                        </button>
                        <button type="button" onClick={()=>document.getElementById('refreshModal').close()} className="btn btn-primary">Cancel</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default AppViewSidebar;