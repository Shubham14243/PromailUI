import { useMemo, useState } from "react";
import CreateTemplate from "./CreateTemplate";
import { Link } from "react-router-dom";

const AppViewMain = () => {
    const templates = [
        {
            template_id: 1,
            name: "Verify Email",
            slug: "verify-email-user",
            subject: "CMS App | Verification | Please verify your email",
            type: "html",
            content:
                "<html><body><h1>Hello {{name}}!</h1><br/><p>Welcome to our CMS app.<br/>Kindly use the OTP - {{otp}} to verify your email.</p><br/><a href='https://google.com'>Link</a><br/><h4>Thanks</h4></body></html>",
            status: "active",
            created_at: "2026-07-14T11:54:23.639003Z",
            updated_at: "2026-07-14T11:54:23.639003Z"
        },
        {
            template_id: 2,
            name: "Password Reset",
            slug: "password-reset",
            subject: "CMS App | Reset your password",
            type: "html",
            content:
                "<html><body><h1>Reset Password</h1><p>Click the link to reset your password.</p></body></html>",
            status: "active",
            created_at: "2026-07-15T09:00:00.000000Z",
            updated_at: "2026-07-15T09:00:00.000000Z"
        },
        {
            template_id: 3,
            name: "Welcome Email",
            slug: "welcome-email",
            subject: "Welcome to CMS App",
            type: "html",
            content:
                "<html><body><h1>Welcome!</h1><p>Thanks for signing up.</p></body></html>",
            status: "inactive",
            created_at: "2026-07-10T08:00:00.000000Z",
            updated_at: "2026-07-22T14:45:00.000000Z"
        },{
            template_id: 1,
            name: "Verify Email",
            slug: "verify-email-user",
            subject: "CMS App | Verification | Please verify your email",
            type: "html",
            content:
                "<html><body><h1>Hello {{name}}!</h1><br/><p>Welcome to our CMS app.<br/>Kindly use the OTP - {{otp}} to verify your email.</p><br/><a href='https://google.com'>Link</a><br/><h4>Thanks</h4></body></html>",
            status: "active",
            created_at: "2026-07-14T11:54:23.639003Z",
            updated_at: "2026-07-14T11:54:23.639003Z"
        },
        {
            template_id: 2,
            name: "Password Reset",
            slug: "password-reset",
            subject: "CMS App | Reset your password",
            type: "html",
            content:
                "<html><body><h1>Reset Password</h1><p>Click the link to reset your password.</p></body></html>",
            status: "active",
            created_at: "2026-07-15T09:00:00.000000Z",
            updated_at: "2026-07-15T09:00:00.000000Z"
        },
        {
            template_id: 3,
            name: "Welcome Email",
            slug: "welcome-email",
            subject: "Welcome to CMS App",
            type: "html",
            content:
                "<html><body><h1>Welcome!</h1><p>Thanks for signing up.</p></body></html>",
            status: "inactive",
            created_at: "2026-07-10T08:00:00.000000Z",
            updated_at: "2026-07-22T14:45:00.000000Z"
        },{
            template_id: 1,
            name: "Verify Email",
            slug: "verify-email-user",
            subject: "CMS App | Verification | Please verify your email",
            type: "html",
            content:
                "<html><body><h1>Hello {{name}}!</h1><br/><p>Welcome to our CMS app.<br/>Kindly use the OTP - {{otp}} to verify your email.</p><br/><a href='https://google.com'>Link</a><br/><h4>Thanks</h4></body></html>",
            status: "active",
            created_at: "2026-07-14T11:54:23.639003Z",
            updated_at: "2026-07-14T11:54:23.639003Z"
        },
        {
            template_id: 2,
            name: "Password Reset",
            slug: "password-reset",
            subject: "CMS App | Reset your password",
            type: "html",
            content:
                "<html><body><h1>Reset Password</h1><p>Click the link to reset your password.</p></body></html>",
            status: "active",
            created_at: "2026-07-15T09:00:00.000000Z",
            updated_at: "2026-07-15T09:00:00.000000Z"
        },
        {
            template_id: 3,
            name: "Welcome Email",
            slug: "welcome-email",
            subject: "Welcome to CMS App",
            type: "html",
            content:
                "<html><body><h1>Welcome!</h1><p>Thanks for signing up.</p></body></html>",
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

    return (

        <>

            <div className="container mx-auto mt-5 w-full flex items-center justify-center">
                <CreateTemplate />
            </div>

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
                    <div className="col-span-1 mb-1"></div>

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
                                        <button className="btn btn-ghost btn-sm">Edit</button>
                                        <Link to="/template"><button className="btn btn-primary btn-sm">Open</button></Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div className="col-span-1"></div>
                    <div className="col-span-1 text-center">
                        <div className="join">
                            <button className="join-item btn">«</button>
                            <button className="join-item btn">Page 22</button>
                            <button className="join-item btn">»</button>
                        </div>
                    </div>
                    <div className="col-span-1"></div>
                </div>
            </div>
        </>
    );
};

export default AppViewMain;