const TemplateViewSidebar = () => {
    const template = {
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
                        <h2 className="card-title">{template.name}</h2>
                        <span
                            className={`badge ${template.status === "active" ? "badge-success" : "badge-error"
                                }`}
                        >
                            {template.status}
                        </span>
                    </div>
                    <p className="text-sm opacity-80">{template.slug}</p>
                    <p className="text-sm"><span className="opacity-80">Type: </span>{template.type.toUpperCase()}</p>
                    <p className="text-sm"><span className="opacity-80">Subject: </span>{template.subject}</p>
                    <div className="text-xs opacity-70 mt-2 space-y-1">
                        <p>Template ID: {template.template_id}</p>
                        <p>Created: {formatDate(template.created_at)}</p>
                        <p>Updated: {formatDate(template.updated_at)}</p>
                    </div>
                    <div className="card-actions justify-end mt-3">
                        <button className="btn btn-ghost btn-sm">Edit</button>
                        <button className="btn btn-primary btn-sm">Save Content</button>
                    </div>
                </div>
            </div>
            <div className="card bg-neutral text-neutral-content shadow-xl">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className="card-title">Danger Zone</h2>
                    </div>
                    <div className="card-actions justify-end mt-3">
                        <button className="btn btn-error btn-sm">Delete Template</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplateViewSidebar;