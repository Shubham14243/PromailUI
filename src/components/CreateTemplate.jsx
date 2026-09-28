import { useState } from "react";
import useCreateTemplate from "../hooks/useCreateTemplate";
import toast from "react-hot-toast";

const CreateTemplate = ({ setAppDataRefresh, appID }) => {

    const [inputs, setInputs] = useState({
        name: '',
        slug: '',
        subject: '',
        contentType: 'empty',
    });

    const { loading, createTemplate } = useCreateTemplate(appID);

    const handleSubmit = async (e) => {
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
            toast.success("Template Created Successfully");
        }
    }

    return (
        <>
            <div className="card bg-neutral text-neutral-content w-96">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Create your First Template!</h2>
                    <fieldset className="fieldset rounded-box w-full p-4">
                        <input type="text" className="input" placeholder="Template Name"
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                        />
                        <input type="text" className="input" placeholder="Slug (e.g. verify-email-user)"
                            value={inputs.slug}
                            onChange={(e) => setInputs({ ...inputs, slug: e.target.value })} />
                        <input type="text" className="input" placeholder="Subject"
                            value={inputs.subject}
                            onChange={(e) => setInputs({ ...inputs, subject: e.target.value })} />
                        <select className="select"
                            value={inputs.contentType}
                            onChange={(e) => setInputs({ ...inputs, contentType: e.target.value })}>
                            <option disabled={true} value="empty">Content Type</option>
                            <option value="html">HTML</option>
                            <option value="text">TEXT</option>
                        </select>
                    </fieldset>
                    <div className="card-actions justify-end w-full">
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {loading ? (<span className="loading loading-spinner text-success"></span>) : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateTemplate;