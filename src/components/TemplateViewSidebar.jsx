
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import useTemplateUpdate from "../hooks/useTemplateUpdate";
import useDeleteTemplate from "../hooks/useDeleteTemplate";

const TemplateViewSidebar = ({ templateData, setTemplateDataRefresh }) => {
    const [updateInputs, setUpdateInputs] = useState({
        name: templateData?.name || '',
        slug: templateData?.slug || '',
        subject: templateData?.subject || '',
        status: templateData?.status === 'active',
    });

    const { loading: updateLoading, updateTemplate } = useTemplateUpdate();
    const { loading: deleteLoading, deleteTemplate } = useDeleteTemplate();
    const navigate = useNavigate();

    const handleTemplateUpdate = async (event) => {
        event.preventDefault();
        if (!templateData?.template_id) {
            toast.error('Template data is not ready yet.');
            return;
        }

        const success = await updateTemplate(templateData.template_id, updateInputs);
        if (success) {
            toast.success('Template updated successfully!');
            document.getElementById('UpdateTemplateModal').close();
            if (typeof setTemplateDataRefresh === 'function') {
                setTemplateDataRefresh((prev) => prev + 1);
            }
        }
    };

    const handleTemplateDelete = async (event) => {
        event.preventDefault();
        if (!templateData?.template_id) {
            toast.error('Template data is not ready yet.');
            return;
        }

        const navigateID = templateData.app_id ? `/app/${templateData.app_id}` : '/';

        const success = await deleteTemplate(templateData.template_id);
        if (success) {
            document.getElementById('templateDeleteModal').close();
            navigate(navigateID);
            toast.success('Template deleted successfully!');
        }
    };

    const formatDate = (iso) => {
        if (!iso) return "—";

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
                        <h2 className="card-title"><Link to="/">Home</Link> / <Link to={`/app/${templateData.app_id}`} >App</Link> / <Link to={`/template/${templateData.id}`} >{templateData.name}</Link></h2>
                    </div>
                </div>
            </div>
            <div className="card bg-neutral text-neutral-content shadow-xl mb-4">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className="card-title">{templateData.name}</h2>
                        <span
                            className={`badge ${templateData.status === "active" ? "badge-success" : "badge-error"
                                }`}
                        >
                            {templateData.status}
                        </span>
                    </div>
                    <p className="text-sm opacity-80">{templateData.slug}</p>
                    <p className="text-sm"><span className="opacity-80">Type: </span>{templateData.type.toUpperCase()}</p>
                    <p className="text-sm"><span className="opacity-80">Subject: </span>{templateData.subject}</p>
                    <div className="text-xs opacity-70 mt-2 space-y-1">
                        <p>Template ID: {templateData.template_id}</p>
                        <p>Created: {formatDate(templateData.created_at)}</p>
                        <p>Updated: {formatDate(templateData.updated_at)}</p>
                    </div>
                    <div className="card-actions justify-end mt-3">
                        <button className="btn btn-primary btn-sm" onClick={() => document.getElementById('UpdateTemplateModal').showModal()}>Edit</button>
                    </div>
                </div>
            </div>
            <div className="card bg-neutral text-neutral-content shadow-xl">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className="card-title">Danger Zone</h2>
                    </div>
                    <div className="card-actions justify-end mt-3">
                        <button className="btn btn-error btn-sm" onClick={() => document.getElementById('templateDeleteModal').showModal()}>Delete Template</button>
                    </div>
                </div>
            </div>
            <dialog id="UpdateTemplateModal" className="modal">
                <div className="modal-box p-1">
                    <div className="card bg-neutral text-neutral-content w-full">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Update your Template!</h2>
                            <fieldset className="fieldset rounded-box w-full p-4">
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="Template Name"
                                    value={updateInputs.name}
                                    onChange={(event) => setUpdateInputs({ ...updateInputs, name: event.target.value })}
                                />
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="Slug"
                                    value={updateInputs.slug}
                                    onChange={(event) => setUpdateInputs({ ...updateInputs, slug: event.target.value })}
                                />
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="Subject"
                                    value={updateInputs.subject}
                                    onChange={(event) => setUpdateInputs({ ...updateInputs, subject: event.target.value })}
                                />
                                <div className="flex items-center justify-around gap-2 mt-2">
                                    <label htmlFor="template-status"><span className="text-lg">Status</span></label>
                                    <input
                                        type="checkbox"
                                        id="template-status"
                                        className="toggle toggle-success"
                                        checked={Boolean(updateInputs.status)}
                                        onChange={(event) => setUpdateInputs({ ...updateInputs, status: event.target.checked })}
                                    />
                                </div>
                            </fieldset>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary" onClick={handleTemplateUpdate} disabled={updateLoading}>
                                    {updateLoading ? <span className="loading loading-spinner text-success"></span> : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>

            <dialog id="templateDeleteModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Delete Template!</h3>
                    <p className="py-4">Are you sure you want to delete this template? This action cannot be undone.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-error" onClick={handleTemplateDelete} disabled={deleteLoading}>
                            {deleteLoading ? <span className="loading loading-spinner"></span> : 'Yes, Delete!'}
                        </button>
                        <button className="btn btn-primary" onClick={() => document.getElementById('templateDeleteModal').close()}>
                            No, Cancel!
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default TemplateViewSidebar;