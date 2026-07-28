const CreateApp = () => {
    return (
        <>
            <div className="card bg-neutral text-neutral-content w-96">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Create your First App!</h2>
                    <fieldset className="fieldset rounded-box w-xs p-4">
                        <input type="text" className="input" placeholder="App Name" />
                        <textarea className="textarea" placeholder="App Short Description"></textarea>
                    </fieldset>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateApp;