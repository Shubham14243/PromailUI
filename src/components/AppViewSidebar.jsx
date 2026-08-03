const AppViewSidebar = () => {
    const app = {
        id: 1,
        name: "CMS App",
        description: "CMS app for Order Admins.",
        status: "active",
        created_at: "2026-07-14T11:44:31.496717Z",
        updated_at: "2026-07-14T11:44:31.496717Z"
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    return (
        <div className="">
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
                        <button className="btn btn-ghost btn-sm">Edit</button>
                        <button className="btn btn-primary btn-sm">Configs</button>
                    </div>
                </div>
            </div>
            <div className="card bg-neutral text-neutral-content shadow-xl mb-4">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className="card-title">Mail Key</h2>
                    </div>
                    <input type="text" placeholder="****************" className="input" disabled />
                    <div className="card-actions justify-end mt-3">
                        <button className="btn btn-ghost btn-sm">Refresh</button>
                        <button className="btn btn-ghost btn-sm">View</button>
                    </div>
                </div>
            </div>
            <div className="card bg-neutral text-neutral-content shadow-xl">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className="card-title">Danger Zone</h2>
                    </div>
                    <div className="card-actions justify-end mt-3">
                        <button className="btn btn-error btn-sm">Delete App</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppViewSidebar;