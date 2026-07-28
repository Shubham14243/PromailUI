import { useMemo, useState } from "react";

const ListApp = () => {
    const data = [
        {
            id: 1,
            name: "CMS App",
            description: "CMS app for Order Admins.",
            status: "active",
            created_at: "2026-07-14T11:44:31.496717Z",
            updated_at: "2026-07-14T11:44:31.496717Z"
        },
        {
            id: 2,
            name: "Promail",
            description: "Promotional mailing service.",
            status: "active",
            created_at: "2026-07-15T10:30:00.000000Z",
            updated_at: "2026-07-20T09:15:00.000000Z"
        },
        {
            id: 3,
            name: "User Portal",
            description: "Customer self-service portal.",
            status: "inactive",
            created_at: "2026-07-10T08:00:00.000000Z",
            updated_at: "2026-07-22T14:45:00.000000Z"
        }
    ];

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const [query, setQuery] = useState("");

    const filteredApps = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return data;
        return data.filter(
            (app) =>
                app.name.toLowerCase().includes(q) ||
                app.description.toLowerCase().includes(q)
        );
    }, [query, data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            <div className="col-span-1"></div>
            <div className="col-span-1 mb-5">
                <label className="input w-full">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input
                        type="search"
                        required
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>
            </div>
            <div className="col-span-1"></div>
            {filteredApps.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 card bg-neutral text-neutral-content">
                    <div className="card-body items-center text-center">
                        <p>No apps match "{query}".</p>
                    </div>
                </div>
            ) : (
                filteredApps.map((app) => (
                <div key={app.id} className="card bg-neutral text-neutral-content w-96 shadow-xl">
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
                        <p>{app.description}</p>
                        <div className="text-xs opacity-70 mt-2">
                            <p>Created: {formatDate(app.created_at)}</p>
                            <p>Updated: {formatDate(app.updated_at)}</p>
                        </div>
                        <div className="card-actions justify-end mt-2">
                            <button className="btn btn-primary btn-sm">Open</button>
                        </div>
                    </div>
                </div>
                ))
            )}
        </div>
    );
}

export default ListApp;