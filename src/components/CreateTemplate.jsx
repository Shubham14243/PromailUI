const CreateTemplate = () => {
    return (
        <>
            <div className="card bg-neutral text-neutral-content w-96">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Create your First Template!</h2>
                    <fieldset className="fieldset rounded-box w-full p-4">
                        <input type="text" className="input" placeholder="Template Name" />
                        <input type="text" className="input" placeholder="Subject" />
                        <input type="text" className="input" placeholder="Slug (e.g. verify-email-user)" />
                        <select defaultValue="Content Type" className="select">
                            <option disabled={true} selected={true}>Content Type</option>
                            <option>HTML</option>
                            <option>TEXT</option>
                        </select>
                    </fieldset>
                    <div className="card-actions justify-end w-full">
                        <button className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateTemplate;