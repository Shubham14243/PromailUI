import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useCreateApp from "../hooks/useCreateApp";
import toast from "react-hot-toast";

const ListApp = ({ appsData, setRefresh, pages, setPages }) => {

    const data = appsData || JSON.parse(localStorage.getItem("proMailApps")) || [];

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const apps = Array.isArray(data) ? data : [];
    const [query, setQuery] = useState("");

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

    const handlePagination = (direction) => {
        if (direction === 'next') {
            setPages((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
        } else if (direction === 'prev') {
            setPages((prev) => ({ ...prev, offset: prev.offset - prev.limit }));
        }
        setRefresh((prev) => prev + 1);
    };

    const DOCS_SUGGESTION_KEY = "proMailDocsSuggestion";
    const [showDocsSuggestion, setShowDocsSuggestion] = useState(localStorage.getItem(DOCS_SUGGESTION_KEY) == "true");

    const handleCloseDocsSuggestion = () => {
        console.log("Closing docs suggestion");
        localStorage.setItem(DOCS_SUGGESTION_KEY, "false");
        setShowDocsSuggestion(false);
    };

    return (
        <>
            <div className="mt-5 w-[80%] space-y-5">
                {showDocsSuggestion && (
                    <div className="w-full">
                        <div className="hero relative bg-base-200 min-h-[20%]">
                            <button
                                type="button"
                                className="btn btn-sm btn-circle absolute right-3 top-3 z-50 bg-base-300 text-base-content hover:bg-base-content hover:text-base-100"
                                onClick={handleCloseDocsSuggestion}
                                aria-label="Close documentation suggestion"
                                title="Close documentation suggestion"
                            >
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <div className="hero-content w-full text-center">
                                <div className="grid w-full grid-cols-1 items-center gap-4 lg:grid-cols-4">
                                    <div className="flex flex-col items-center justify-start lg:col-span-3">
                                        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Welcome to ProMail</h1>
                                        <p className="p-4 sm:p-6">
                                            A modern and reliable email management platform designed to help you create, manage, and scale your applications effortlessly.
                                            Get started quickly with our complete documentation, covering setup, configuration, and usage.
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Link to="/docs#send-email" className="btn btn-primary w-full sm:w-auto"> <i className="bi bi-file-earmark-text"></i> Documentation</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
                    <div className="flex justify-start gap-2 lg:col-span-1">
                        <p className="px-2 text-2xl">MY APPS</p>
                    </div>
                    <div className="w-full lg:col-span-1 flex items-center justify-center">
                    <label className="input max-w-md sm:w-full">
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
                    <div className="flex justify-stretch gap-2 sm:col-span-2 sm:justify-end lg:col-span-1">
                    <button className="btn btn-outline btn-success w-full sm:w-auto"
                        onClick={() => document.getElementById('CreateAppModal').showModal()}
                    >
                        <i className="bi bi-plus"></i> Create App
                    </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredApps.length === 0 ? (
                    <div className="col-span-full card bg-neutral text-neutral-content">
                        <div className="card-body items-center text-center">
                            <p>No apps found.</p>
                        </div>
                    </div>
                ) : (
                    filteredApps.map((app) => (
                        <div key={app.id} className="card w-full bg-neutral text-neutral-content shadow-xl">
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
                                    <Link to={`/app/${app.id}`}>
                                        <button className="btn btn-primary btn-sm">Open</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                </div>
                <div className="col-span-full flex justify-center mt-2">
                    <div className="join">
                        <button className="join-item btn" onClick={() => handlePagination('prev')}>«</button>
                        <button className="join-item btn">Page {Math.floor(pages.offset / pages.limit) + 1}</button>
                        <button className="join-item btn" onClick={() => handlePagination('next')}>»</button>
                    </div>
                </div>
            </div>

            {/* Create App Modal */}
            <dialog id="CreateAppModal" className="modal">
                <div className="modal-box p-1">
                    <div className="card bg-neutral text-neutral-content w-full">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Create New App!</h2>
                            <fieldset className="fieldset w-full max-w-xs rounded-box p-4">
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
            </dialog>
        </>
    );
}

export default ListApp;