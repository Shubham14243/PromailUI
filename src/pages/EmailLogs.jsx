import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuthStore from "../context/AuthContext";
import apiCaller from "../utils/apiCaller";
import useGetEmaillogs from "../hooks/useGetEmaillogs";
import useGetEmaiLogData from "../hooks/useGetEmaiLogData";

const ITEMS_PER_PAGE = 10;
const FILTER_OPTIONS_LIMIT = 30;

const EmailLogs = () => {
    const [apps, setApps] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [toEmail, setToEmail] = useState("");
    const [appId, setAppId] = useState("");
    const [templateId, setTemplateId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [selectedUuid, setSelectedUuid] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({
        toEmail: "",
        appId: "",
        templateId: "",
        startDate: "",
        endDate: ""
    });
    const { clearUser } = useAuthStore();
    const { loading, serverLogs, totalLogs } = useGetEmaillogs(page, appliedFilters);
    const { loading: detailLoading, logData } = useGetEmaiLogData(selectedUuid);

    useEffect(() => {
        let isMounted = true;

        const getFilterOptions = async () => {
            try {
                const { res, data } = await apiCaller(
                    "GET",
                    "/api/v1/apps",
                    {},
                    { limit: FILTER_OPTIONS_LIMIT, offset: 0 }
                );

                if (res.status === 401) {
                    clearUser();
                    throw new Error("Session expired. Please login again.");
                }

                if (!res.ok) {
                    throw new Error(data?.message || "Failed to load apps.");
                }

                const responseApps = Array.isArray(data?.data) ? data.data : [];
                if (isMounted) {
                    setApps(responseApps);
                }

            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Something went wrong while loading filter options");
                }
            }
        };

        getFilterOptions();

        return () => {
            isMounted = false;
        };
    }, [clearUser]);

    useEffect(() => {
        if (!appId) return undefined;

        let isMounted = true;

        const getAppTemplates = async () => {
            try {
                const { res, data } = await apiCaller(
                    "GET",
                    `/api/v1/apps/${appId}/templates`,
                    {},
                    { limit: FILTER_OPTIONS_LIMIT, offset: 0 }
                );

                if (res.status === 401) {
                    clearUser();
                    throw new Error("Session expired. Please login again.");
                }

                if (!res.ok) {
                    throw new Error(data?.message || "Failed to load templates.");
                }

                if (isMounted) {
                    setTemplates(Array.isArray(data?.data) ? data.data : []);
                }
            } catch (error) {
                if (isMounted) {
                    setTemplates([]);
                    toast.error(error.message || "Something went wrong while loading templates");
                }
            }
        };

        getAppTemplates();

        return () => {
            isMounted = false;
        };
    }, [appId, clearUser]);

    const formatDateTime = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        return d.toLocaleString("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    };

    const totalPages = Math.max(1, Math.ceil(totalLogs / ITEMS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pagedLogs = useMemo(() => serverLogs, [serverLogs]);

    const handleSearch = () => {
        setPage(1);
        setAppliedFilters({
            toEmail,
            appId,
            templateId,
            startDate,
            endDate
        });
    };

    const handleReset = () => {
        setToEmail("");
        setAppId("");
        setTemplateId("");
        setTemplates([]);
        setStartDate("");
        setEndDate("");
        setPage(1);
        setAppliedFilters({
            toEmail: "",
            appId: "",
            templateId: "",
            startDate: "",
            endDate: ""
        });
    };

    const handleOpenDetails = (uuid) => {
        setSelectedUuid(uuid);
        document.getElementById("emailLogDetailModal")?.showModal();
    };

    const detail = logData?.uuid === selectedUuid ? logData : null;
    let variables = detail?.variables;
    try {
        variables = typeof variables === "string" ? JSON.parse(variables) : variables;
    } catch {
        variables = detail?.variables;
    }

    return (
        <>
            <Navbar />

            {loading ? (<div className="container mx-auto mt-5 w-full px-4"><div className="flex w-[100%] flex-col gap-4">
                <div className="skeleton h-20 w-full"></div>
                <div className="skeleton h-120 w-full"></div>
            </div></div>) : (

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
                            placeholder="Filter by Email or Acknowledgement ID"
                            value={toEmail}
                            onChange={(e) => setToEmail(e.target.value)}
                        />
                        <select
                            className="select select-bordered w-full md:w-48"
                            value={appId}
                            onChange={(e) => {
                                setAppId(e.target.value);
                                setTemplateId("");
                                setTemplates([]);
                            }}
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
                                    <th>Acknowledgement ID</th>
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={11} className="text-center py-6">
                                            Loading email logs...
                                        </td>
                                    </tr>
                                ) : pagedLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="text-center py-6">
                                            No email logs match the current filters.
                                        </td>
                                    </tr>
                                ) : (
                                    pagedLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td>{log.id}</td>
                                            <td className="font-mono text-xs">
                                                <Link
                                                    to={`/logs/${log.uuid}`}
                                                    className="link link-primary opacity-80 hover:opacity-100"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        handleOpenDetails(log.uuid);
                                                    }}
                                                >
                                                    {log.uuid}
                                                </Link>
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
                            {(safePage - 1) * ITEMS_PER_PAGE + pagedLogs.length} of {totalLogs}
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

            )}

            <dialog id="emailLogDetailModal" className="modal">
                <div className="modal-box max-w-5xl">
                    <form method="dialog">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setSelectedUuid("")}
                        >
                            ✕
                        </button>
                    </form>
                    <h3 className="font-bold text-lg mb-4">Email Log Details</h3>

                    {detailLoading || !detail ? (
                        <div className="py-10 text-center">
                            <span className="loading loading-infinity loading-xl"></span>
                            <p className="mt-3">Loading email log details...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <p><strong>ID:</strong> {detail.id}</p>
                                <p><strong>Ack ID:</strong> {detail.uuid}</p>
                                <p><strong>User:</strong> {detail.user_id}</p>
                                <p><strong>App:</strong> {detail.app_id}</p>
                                <p><strong>Template:</strong> {detail.template_id}</p>
                                <p><strong>To:</strong> {detail.to_email}</p>
                                <p><strong>Status:</strong> {detail.status}</p>
                                <p><strong>Sent:</strong> {formatDateTime(detail.sentAt)}</p>
                                <p className="md:col-span-2"><strong>Subject:</strong> {detail.subject}</p>
                                {detail.error_message && (
                                    <p className="md:col-span-2 text-error"><strong>Error:</strong> {detail.error_message}</p>
                                )}
                            </div>

                            <div>
                                <h4 className="font-semibold mb-1">Variables</h4>
                                <pre className="bg-base-200 rounded-box p-3 text-xs overflow-x-auto">
                                    {JSON.stringify(variables, null, 2)}
                                </pre>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-1">Email Body</h4>
                                <iframe
                                    title="Email body preview"
                                    srcDoc={detail.body || ""}
                                    className="w-full h-72 bg-white rounded-box"
                                    sandbox=""
                                />
                            </div>

                            <div>
                                <h4 className="font-semibold mb-1">Tracking</h4>
                                {detail.tracking?.length ? (
                                    <div className="overflow-x-auto">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>URL</th>
                                                    <th>Opened</th>
                                                    <th>Clicked</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detail.tracking.map((event) => (
                                                    <tr key={event.id}>
                                                        <td>{event.type}</td>
                                                        <td className="max-w-xs truncate">{event.url || "-"}</td>
                                                        <td>{formatDateTime(event.opened_at)}</td>
                                                        <td>{formatDateTime(event.clicked_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm opacity-70">No tracking events.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </dialog>
        </>
    );
};

export default EmailLogs;