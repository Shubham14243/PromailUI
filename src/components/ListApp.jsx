import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useCreateApp from "../hooks/useCreateApp";

const ListApp = ({ appsData, setRefresh }) => {

    const data = appsData || JSON.parse(localStorage.getItem("proMailApps")) || [];

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const [query, setQuery] = useState("");

    const apps = Array.isArray(data) ? data : [];

    const filteredApps = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return apps;
        return apps.filter(
            (app) =>
                app?.name?.toLowerCase?.().includes(q) ||
                app?.description?.toLowerCase?.().includes(q)
        );
    }, [query, apps]);

    const [inputs, setInputs] = useState({
        name: '',
        description: ''
    });

    const { loading, createApp } = useCreateApp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await createApp(inputs);
        if (result) {
            setRefresh((prev) => prev + 1);
            toast.success('App created successfully!');
            setInputs({
                name: '',
                description: ''
            });
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                <div className="col-span-1 flex justify-start gap-2">
                    <p className="text-2xl px-2">MY APPS</p>
                    <button className="btn btn-outline btn-default"
                        onClick={() => document.getElementById('CreateAppModal').showModal()}
                    >
                        <i className="bi bi-plus"></i> Create App
                    </button>
                </div>
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
                <div className="col-span-1 flex justify-end gap-2">
                    <Link to="/docs" className="btn btn-outline btn-success">
                        <i className="bi bi-file-earmark-text"></i> Email Docs
                    </Link>
                    <Link to="/logs" className="btn btn-outline btn-default">
                        <i className="bi bi-list"></i> Email Logs
                    </Link>
                </div>
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
                                    <Link to="/app"><button className="btn btn-primary btn-sm">Open</button></Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {filteredApps.length > 9 && (
                    <div className="col-span-full flex justify-center mt-2">
                        <div className="join">
                            <button className="join-item btn">«</button>
                            <button className="join-item btn">Page 22</button>
                            <button className="join-item btn">»</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create App Modal */}
            <dialog id="CreateAppModal" className="modal">
                <div className="modal-box p-1">
                    <div className="card bg-neutral text-neutral-content w-full">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Create your First App!</h2>
                            <fieldset className="fieldset rounded-box w-xs p-4">
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="App Name"
                                    value={inputs.name}
                                    onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                                />
                                <textarea
                                    className="textarea"
                                    placeholder="App Short Description"
                                    value={inputs.description}
                                    onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
                                ></textarea>
                            </fieldset>
                            <div className="card-actions justify-end" onClick={handleSubmit}>
                                <button className="btn btn-primary">
                                    {loading ? (<span className="loading loading-spinner text-success"></span>) : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}

export default ListApp;