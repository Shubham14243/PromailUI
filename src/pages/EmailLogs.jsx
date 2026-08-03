import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

const ITEMS_PER_PAGE = 10;

const EmailLogs = () => {
    const apps = [
        { id: 1, name: "CMS App" },
        { id: 2, name: "Promail" },
        { id: 3, name: "User Portal" }
    ];

    const templates = [
        { template_id: 1, name: "Verify Email" },
        { template_id: 2, name: "Password Reset" },
        { template_id: 3, name: "Welcome Email" }
    ];

    const logs = [
        {
            id: 30,
            uuid: "57e076b6-9f7c-4b2b-ae37-33bc3e94a734",
            user_id: 1,
            app_id: 1,
            template_id: 1,
            to_email: "skgsmasher14243@gmail.com",
            subject: "CMS App | Verification | Please verify your email",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-27T17:57:41.55594Z",
            created_at: "2026-07-27T17:57:37.303755Z"
        },
        {
            id: 29,
            uuid: "1e7a6c11-1bcd-4d2e-9c2e-b1c41f86aa01",
            user_id: 1,
            app_id: 1,
            template_id: 2,
            to_email: "jane.doe@example.com",
            subject: "CMS App | Reset your password",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-26T12:10:11.000000Z",
            created_at: "2026-07-26T12:10:05.000000Z"
        },
        {
            id: 28,
            uuid: "9d0b1d3a-2c40-44b2-9c1d-2a86f01a8a55",
            user_id: 2,
            app_id: 2,
            template_id: 3,
            to_email: "marketing@promail.com",
            subject: "Welcome to Promail",
            status: "failed",
            error_message: "SMTP timeout after 30s",
            sentAt: "2026-07-25T09:22:00.000000Z",
            created_at: "2026-07-25T09:21:55.000000Z"
        },
        {
            id: 27,
            uuid: "a3f8b1c2-7d94-4e10-9a3b-1f5d77e3a210",
            user_id: 1,
            app_id: 1,
            template_id: 1,
            to_email: "alice@example.com",
            subject: "CMS App | Verification | Please verify your email",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-24T08:14:42.000000Z",
            created_at: "2026-07-24T08:14:38.000000Z"
        },
        {
            id: 26,
            uuid: "b1c4d2e3-8a52-4f0c-9b21-77f1c9c8a3d1",
            user_id: 3,
            app_id: 3,
            template_id: 3,
            to_email: "bob@userportal.com",
            subject: "Welcome to User Portal",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-23T18:33:09.000000Z",
            created_at: "2026-07-23T18:33:00.000000Z"
        },
        {
            id: 25,
            uuid: "c2d3e4f5-9011-4231-9a87-12ab34cd56ef",
            user_id: 2,
            app_id: 2,
            template_id: 2,
            to_email: "ops@promail.com",
            subject: "Promail | Reset your password",
            status: "failed",
            error_message: "Invalid recipient address",
            sentAt: "2026-07-22T15:00:01.000000Z",
            created_at: "2026-07-22T15:00:00.000000Z"
        },
        {
            id: 24,
            uuid: "d3e4f5a6-1234-4567-89ab-cdef01234567",
            user_id: 1,
            app_id: 1,
            template_id: 1,
            to_email: "carol@example.com",
            subject: "CMS App | Verification | Please verify your email",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-21T11:45:21.000000Z",
            created_at: "2026-07-21T11:45:15.000000Z"
        },
        {
            id: 23,
            uuid: "e4f5a6b7-2345-4678-9abc-def012345678",
            user_id: 3,
            app_id: 1,
            template_id: 2,
            to_email: "dave@userportal.com",
            subject: "CMS App | Reset your password",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-20T07:22:33.000000Z",
            created_at: "2026-07-20T07:22:30.000000Z"
        },
        {
            id: 22,
            uuid: "f5a6b7c8-3456-4789-abcd-ef0123456789",
            user_id: 1,
            app_id: 2,
            template_id: 3,
            to_email: "eve@promail.com",
            subject: "Welcome to Promail",
            status: "failed",
            error_message: "Rate limit exceeded",
            sentAt: "2026-07-19T20:05:14.000000Z",
            created_at: "2026-07-19T20:05:10.000000Z"
        },
        {
            id: 21,
            uuid: "a6b7c8d9-4567-4890-bcde-f01234567890",
            user_id: 2,
            app_id: 3,
            template_id: 1,
            to_email: "frank@userportal.com",
            subject: "User Portal | Verification | Please verify your email",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-18T14:00:00.000000Z",
            created_at: "2026-07-18T13:59:55.000000Z"
        },
        {
            id: 20,
            uuid: "b7c8d9e0-5678-4901-cdef-012345678901",
            user_id: 1,
            app_id: 1,
            template_id: 3,
            to_email: "grace@example.com",
            subject: "Welcome to CMS App",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-17T10:11:12.000000Z",
            created_at: "2026-07-17T10:11:10.000000Z"
        },
        {
            id: 19,
            uuid: "c8d9e0f1-6789-4012-def0-123456789012",
            user_id: 3,
            app_id: 2,
            template_id: 2,
            to_email: "henry@promail.com",
            subject: "Promail | Reset your password",
            status: "failed",
            error_message: "Bounce: mailbox full",
            sentAt: "2026-07-16T16:40:50.000000Z",
            created_at: "2026-07-16T16:40:45.000000Z"
        },
        {
            id: 18,
            uuid: "d9e0f1a2-7890-4123-ef01-234567890123",
            user_id: 2,
            app_id: 1,
            template_id: 1,
            to_email: "ivy@example.com",
            subject: "CMS App | Verification | Please verify your email",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-15T09:30:00.000000Z",
            created_at: "2026-07-15T09:29:55.000000Z"
        },
        {
            id: 17,
            uuid: "e0f1a2b3-8901-4234-f012-345678901234",
            user_id: 1,
            app_id: 3,
            template_id: 3,
            to_email: "jack@userportal.com",
            subject: "Welcome to User Portal",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-14T13:13:13.000000Z",
            created_at: "2026-07-14T13:13:10.000000Z"
        },
        {
            id: 16,
            uuid: "f1a2b3c4-9012-4345-0123-456789012345",
            user_id: 3,
            app_id: 1,
            template_id: 2,
            to_email: "kim@example.com",
            subject: "CMS App | Reset your password",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-13T17:55:09.000000Z",
            created_at: "2026-07-13T17:55:05.000000Z"
        },
        {
            id: 15,
            uuid: "a2b3c4d5-0123-4456-1234-567890123456",
            user_id: 2,
            app_id: 2,
            template_id: 1,
            to_email: "leo@promail.com",
            subject: "Promail | Verification | Please verify your email",
            status: "failed",
            error_message: "DNS resolution failed",
            sentAt: "2026-07-12T08:00:00.000000Z",
            created_at: "2026-07-12T07:59:55.000000Z"
        },
        {
            id: 14,
            uuid: "b3c4d5e6-1234-4567-2345-678901234567",
            user_id: 1,
            app_id: 3,
            template_id: 1,
            to_email: "mia@userportal.com",
            subject: "User Portal | Verification | Please verify your email",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-11T19:24:36.000000Z",
            created_at: "2026-07-11T19:24:30.000000Z"
        },
        {
            id: 13,
            uuid: "c4d5e6f7-2345-4678-3456-789012345678",
            user_id: 2,
            app_id: 1,
            template_id: 3,
            to_email: "noah@example.com",
            subject: "Welcome to CMS App",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-10T11:00:00.000000Z",
            created_at: "2026-07-10T10:59:55.000000Z"
        },
        {
            id: 12,
            uuid: "d5e6f7a8-3456-4789-4567-890123456789",
            user_id: 3,
            app_id: 2,
            template_id: 2,
            to_email: "olivia@promail.com",
            subject: "Promail | Reset your password",
            status: "failed",
            error_message: "Spam check failed",
            sentAt: "2026-07-09T05:18:42.000000Z",
            created_at: "2026-07-09T05:18:40.000000Z"
        },
        {
            id: 11,
            uuid: "e6f7a8b9-4567-4890-5678-901234567890",
            user_id: 1,
            app_id: 1,
            template_id: 1,
            to_email: "peter@example.com",
            subject: "CMS App | Verification | Please verify your email",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-08T14:45:00.000000Z",
            created_at: "2026-07-08T14:44:55.000000Z"
        },
        {
            id: 10,
            uuid: "f7a8b9c0-5678-4901-6789-012345678901",
            user_id: 2,
            app_id: 3,
            template_id: 3,
            to_email: "quinn@userportal.com",
            subject: "Welcome to User Portal",
            status: "sent",
            error_message: null,
            sentAt: "2026-07-07T22:10:10.000000Z",
            created_at: "2026-07-07T22:10:05.000000Z"
        }
    ];

    const [toEmail, setToEmail] = useState("");
    const [appId, setAppId] = useState("");
    const [templateId, setTemplateId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);

    const formatDateTime = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        return d.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            if (toEmail && !log.to_email.toLowerCase().includes(toEmail.toLowerCase())) {
                return false;
            }
            if (appId && String(log.app_id) !== String(appId)) {
                return false;
            }
            if (templateId && String(log.template_id) !== String(templateId)) {
                return false;
            }
            if (startDate) {
                const sd = new Date(startDate);
                if (new Date(log.sentAt) < sd) return false;
            }
            if (endDate) {
                const ed = new Date(endDate);
                if (new Date(log.sentAt) > ed) return false;
            }
            return true;
        });
    }, [toEmail, appId, templateId, startDate, endDate, logs]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pagedLogs = useMemo(() => {
        const start = (safePage - 1) * ITEMS_PER_PAGE;
        return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredLogs, safePage]);

    const handleSearch = () => {
        setPage(1);
    };

    const handleReset = () => {
        setToEmail("");
        setAppId("");
        setTemplateId("");
        setStartDate("");
        setEndDate("");
        setPage(1);
    };

    return (
        <>
            <Navbar />

            <div className="container mx-auto mt-5 w-full px-4">
                {/* Title */}
                <div className="flex justify-start mb-4">
                    <p className="text-2xl px-2">EMAIL LOGS</p>
                </div>

                {/* Filter bar */}
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                    <input
                        type="text"
                        className="input input-bordered w-full md:flex-1"
                        placeholder="Filter by email"
                        value={toEmail}
                        onChange={(e) => setToEmail(e.target.value)}
                    />
                    <select
                        className="select select-bordered w-full md:w-48"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                    >
                        <option value="">All Apps</option>
                        {apps.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="select select-bordered w-full md:w-48"
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                    >
                        <option value="">All Templates</option>
                        {templates.map((t) => (
                            <option key={t.template_id} value={t.template_id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="datetime-local"
                        className="input input-bordered w-full md:w-56"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        aria-label="Start date"
                    />
                    <input
                        type="datetime-local"
                        className="input input-bordered w-full md:w-56"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        aria-label="End date"
                    />
                    <button className="btn btn-ghost" onClick={handleReset}>
                        <i className="bi bi-arrow-counterclockwise"></i> Reset
                    </button>
                    <button className="btn btn-primary" onClick={handleSearch}>
                        <i className="bi bi-search"></i> Search
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-neutral text-neutral-content rounded-box">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>UUID</th>
                                <th>User</th>
                                <th>App</th>
                                <th>Template</th>
                                <th>To Email</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Error</th>
                                <th>Sent At</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-6">
                                        No email logs match the current filters.
                                    </td>
                                </tr>
                            ) : (
                                pagedLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td>{log.id}</td>
                                        <td className="font-mono text-xs opacity-80">
                                            {log.uuid}
                                        </td>
                                        <td>{log.user_id}</td>
                                        <td>{log.app_id}</td>
                                        <td>{log.template_id}</td>
                                        <td>{log.to_email}</td>
                                        <td className="max-w-xs truncate" title={log.subject}>
                                            {log.subject}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${log.status === "sent"
                                                    ? "badge-success"
                                                    : "badge-error"
                                                    }`}
                                            >
                                                {log.status}
                                            </span>
                                        </td>
                                        <td
                                            className="text-xs max-w-xs truncate"
                                            title={log.error_message || ""}
                                        >
                                            {log.error_message || "-"}
                                        </td>
                                        <td className="text-xs whitespace-nowrap">
                                            {formatDateTime(log.sentAt)}
                                        </td>
                                        <td className="text-xs whitespace-nowrap">
                                            {formatDateTime(log.created_at)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="col-span-1 text-sm opacity-70 flex items-center">
                        Showing {pagedLogs.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}
                        {"-"}
                        {(safePage - 1) * ITEMS_PER_PAGE + pagedLogs.length} of {filteredLogs.length}
                    </div>
                    <div className="col-span-1 text-center">
                        <div className="join">
                            <button
                                className="join-item btn"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={safePage <= 1}
                            >
                                «
                            </button>
                            <button className="join-item btn">
                                Page {safePage} of {totalPages}
                            </button>
                            <button
                                className="join-item btn"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={safePage >= totalPages}
                            >
                                »
                            </button>
                        </div>
                    </div>
                    <div className="col-span-1"></div>
                </div>
            </div>
        </>
    );
};

export default EmailLogs;