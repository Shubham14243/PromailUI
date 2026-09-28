import { useMemo, useState } from "react";
import CreateTemplate from "./CreateTemplate";
import { Link } from "react-router-dom";
import useCreateTemplate from "../hooks/useCreateTemplate";
import toast from "react-hot-toast";
import useGetAppKey from "../hooks/useGetAppKey";
import useSendTestEmail from "../hooks/useSendTestEmail";

const AppViewMain = ({ templateData, templatesLoading, setAppDataRefresh, appID, pages, setPages }) => {
    const templates = templateData || [];

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const [query, setQuery] = useState("");

    const filteredTemplates = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return templates;
        return templates.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.slug.toLowerCase().includes(q) ||
                t.subject.toLowerCase().includes(q)
        );
    }, [query, templates]);

    const [inputs, setInputs] = useState({
        name: '',
        slug: '',
        subject: '',
        contentType: 'empty',
    });

    const { loading, createTemplate } = useCreateTemplate(appID);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const success = await createTemplate(inputs);
        if (success) {
            setInputs({
                name: '',
                slug: '',
                subject: '',
                contentType: 'empty',
            });
            setAppDataRefresh((prev) => prev + 1);
            const modal = document.getElementById('CreateTemplateModal');
            if (modal) {
                modal.close();
            }
            toast.success("Template Created Successfully");
        }
    }

    const handlePagination = (direction) => {
        if (direction === 'next') {
            setPages((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
        } else if (direction === 'prev') {
            setPages((prev) => ({ ...prev, offset: prev.offset - prev.limit }));
        }
        setAppDataRefresh((prev) => prev + 1);
    };


    const [testEmailInputs, setTestEmailInputs] = useState({
        appID: appID,
        mailKey: '',
        email: '',
        subject: '',
        body: '',
    });
    const { getAppKey } = useGetAppKey();
    const { loading: sendLoading, sendTestEmail } = useSendTestEmail();

    const handleSendTestEmail = async (e) => {
        e.preventDefault();
        const fetchedAppKey = await getAppKey(appID);
        if (!fetchedAppKey || fetchedAppKey === "") {
            toast.error("Failed to fetch app key. Please try again.");
            console.log("fetched " + fetchedAppKey)
            return;
        }
        console.log("fetched " + fetchedAppKey)
        setTestEmailInputs(() => ({ ...testEmailInputs, mailKey: fetchedAppKey }));
        console.log("received " + testEmailInputs.mailKey)

        const success = await sendTestEmail(testEmailInputs);
        if (success) {
            toast.success("Test Email Sent Successfully");
        }
        setTestEmailInputs({
            appID: appID,
            mailKey: fetchedAppKey,
            email: '',
            subject: '',
            body: '',
        });
        const modal = document.getElementById('testEmailModal');
        if (modal) {
            modal.close();
        }
    }

    return (

        <>
            {templateData === null ? (
                <div className="container mx-auto mt-5 w-full flex items-center justify-center">
                    <CreateTemplate setAppDataRefresh={setAppDataRefresh} appID={appID} />
                </div>
            ) : (
                <div className="flex flex-col gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1 mb-1">
                            <p className="text-2xl px-2">MY TEMPLATES</p>
                        </div>
                        <div className="col-span-1 mb-1">
                            <label className="input w-full">
                                <svg
                                    className="h-[1em] opacity-50"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
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
                                    placeholder="Search templates"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="col-span-1 mb-1 flex justify-end gap-2">
                            <button className="btn btn-outline btn-success"
                                onClick={() => document.getElementById('testEmailModal').showModal()}
                            >
                                <i className="bi bi-envelope"></i> Test Email
                            </button>
                            <button className="btn btn-outline btn-default"
                                onClick={() => document.getElementById('CreateTemplateModal').showModal()}
                            >
                                <i className="bi bi-plus"></i> Create Template
                            </button>
                        </div>

                        {filteredTemplates.length === 0 ? (
                            <div className="md:col-span-2 lg:col-span-3 card bg-neutral text-neutral-content">
                                <div className="card-body items-center text-center">
                                    <p>No templates match "{query}".</p>
                                </div>
                            </div>
                        ) : (
                            filteredTemplates.map((t) => (
                                <div
                                    key={t.template_id}
                                    className="card bg-neutral text-neutral-content shadow-xl"
                                >
                                    <div className="card-body">
                                        <div className="flex items-center justify-between">
                                            <h2 className="card-title">{t.name}</h2>
                                            <span
                                                className={`badge ${t.status === "active"
                                                    ? "badge-success"
                                                    : "badge-error"
                                                    }`}
                                            >
                                                {t.status}
                                            </span>
                                        </div>
                                        <p className="text-sm font-mono opacity-70">{t.slug}</p>
                                        <p className="text-sm">
                                            <span className="opacity-70">Subject:</span> {t.subject}
                                        </p>
                                        <p className="text-xs opacity-70 mt-1">
                                            Type: {t.type} &middot; Created: {formatDate(t.created_at)}
                                        </p>
                                        <div className="card-actions justify-end mt-2">
                                            <Link to={`/template/${t.template_id}`}><button className="btn btn-primary btn-sm">Open</button></Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="col-span-full flex justify-center mt-2">
                            <div className="join">
                                <button className="join-item btn" onClick={() => handlePagination('prev')}>«</button>
                                <button className="join-item btn">Page {Math.floor(pages.offset / pages.limit) + 1}</button>
                                <button className="join-item btn" onClick={() => handlePagination('next')}>»</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Create Template Modal */}
            <dialog id="CreateTemplateModal" className="modal">
                <div className="modal-box p-1">
                    <div className="card bg-neutral text-neutral-content w-full">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Create New Template!</h2>
                            <fieldset className="fieldset rounded-box w-full p-4">
                                <input type="text" className="input w-full" placeholder="Template Name"
                                    value={inputs.name}
                                    onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                                />
                                <input type="text" className="input w-full" placeholder="Slug (e.g. verify-email-user)"
                                    value={inputs.slug}
                                    onChange={(e) => setInputs({ ...inputs, slug: e.target.value })} />
                                <input type="text" className="input w-full" placeholder="Subject"
                                    value={inputs.subject}
                                    onChange={(e) => setInputs({ ...inputs, subject: e.target.value })} />
                                <select className="select w-full"
                                    value={inputs.contentType}
                                    onChange={(e) => setInputs({ ...inputs, contentType: e.target.value })}>
                                    <option disabled={true} value="empty">Content Type</option>
                                    <option value="html">HTML</option>
                                    <option value="text">TEXT</option>
                                </select>
                            </fieldset>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary" onClick={handleCreateSubmit}>
                                    {loading ? (<span className="loading loading-spinner text-success"></span>) : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
            {/* Test Email */}
            <dialog id="testEmailModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Test Email</h3>
                    <p className="py-4">Enter the details to send a test email.</p>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full p-4 mb-3">
                        <input type="email" className="input w-full" placeholder="Email" value={testEmailInputs.email} onChange={(e) => setTestEmailInputs({ ...testEmailInputs, email: e.target.value })} />
                        <input type="text" className="input w-full" placeholder="Subject" value={testEmailInputs.subject} onChange={(e) => setTestEmailInputs({ ...testEmailInputs, subject: e.target.value })} />
                        <textarea className="textarea w-full" placeholder="Body" value={testEmailInputs.body} onChange={(e) => setTestEmailInputs({ ...testEmailInputs, body: e.target.value })}></textarea>
                    </fieldset>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary" onClick={handleSendTestEmail}>
                            {sendLoading ? (<span className="loading loading-spinner text-success"></span>) : "Send"}
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default AppViewMain;