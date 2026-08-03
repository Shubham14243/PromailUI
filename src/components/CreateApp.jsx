import { useState } from "react";
import toast from "react-hot-toast";
import useCreateApp from "../hooks/useCreateApp";

const CreateApp = ({ setRefresh }) => {

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
            <div className="card bg-neutral text-neutral-content w-96">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Create your First App!</h2>
                    <fieldset className="fieldset rounded-box w-xs p-4">
                        <input
                            type="text"
                            className="input"
                            placeholder="App Name"
                            value={inputs.name}
                            onChange={(e) => setInputs({...inputs, name: e.target.value})}
                        />
                        <textarea
                            className="textarea"
                            placeholder="App Short Description"
                            value={inputs.description}
                            onChange={(e) => setInputs({...inputs, description: e.target.value})}
                        ></textarea>
                    </fieldset>
                    <div className="card-actions justify-end" onClick={handleSubmit}>
                        <button className="btn btn-primary">
                            {loading ? (<span className="loading loading-spinner text-success"></span>) : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateApp;