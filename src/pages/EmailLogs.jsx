import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import useAuthStore from "../context/AuthContext";
import apiCaller from "../utils/apiCaller";

const ITEMS_PER_PAGE = 10;
const FILTER_OPTIONS_LIMIT = 30;

const EmailLogs = () => {
    const logs = [];

    const [apps, setApps] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [toEmail, setToEmail] = useState("");
    const [appId, setAppId] = useState("");
    const [templateId, setTemplateId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [appliedFilters, setAppliedFilters] = useState({
        toEmail: "",
        appId: "",
        templateId: "",
        startDate: "",
        endDate: ""
    });
    const [serverLogs, setServerLogs] = useState(() => logs.slice(0, 0));
    const [totalLogs, setTotalLogs] = useState(0);
    const [loading, setLoading] = useState(false);
    const { clearUser } = useAuthStore();

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

    useEffect(() => {
        let isMounted = true;

        const getEmailLogs = async () => {
            setLoading(true);

            try {
                const params = {
                    limit: ITEMS_PER_PAGE,
                    skip: (page - 1) * ITEMS_PER_PAGE,
                    to_email: appliedFilters.toEmail,
                    template_id: appliedFilters.templateId,
                    app_id: appliedFilters.appId,
                    startDateTime: appliedFilters.startDate,
                    endDateTime: appliedFilters.endDate
                };
                const { res, data } = await apiCaller("GET", "/api/v1/email/logs", {}, params);

                if (res.status === 401) {
                    clearUser();
                    throw new Error("Session expired. Please login again.");
                }

                if (!res.ok) {
                    throw new Error(data?.message || "Failed to load email logs.");
                }

                const responseData = data?.data;
                const responseLogs = Array.isArray(responseData)
                    ? responseData
                    : responseData?.logs || responseData?.items || [];
                const responseTotal = data?.total ?? responseData?.total ?? responseLogs.length;

                if (isMounted) {
                    setServerLogs(Array.isArray(responseLogs) ? responseLogs : []);
                    setTotalLogs(Number(responseTotal) || 0);
                }
            } catch (error) {
                if (isMounted) {
                    setServerLogs([]);
                    setTotalLogs(0);
                    toast.error(error.message || "Something went wrong while loading email logs");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        getEmailLogs();

        return () => {
            isMounted = false;
        };
    }, [appliedFilters, clearUser, page]);

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
        </>
    );
};

export default EmailLogs;