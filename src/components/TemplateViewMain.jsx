const TemplateViewMain = () => {
    return (
        <>
            {/* name of each tab group should be unique */}
            <div className="tabs tabs-box  bg-neutral">
                <label className="tab">
                <input type="radio" name="my_tabs_6" className="tab" aria-label="HTML" defaultChecked/>
                <i className="bi bi-code"></i> <span className="px-2">HTML</span>
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-6">HTML</div>
                
                <label className="tab">
                <input type="radio" name="my_tabs_6" className="tab" aria-label="Variables" />
                <i className="bi bi-terminal"></i> <span className="px-2">Variables</span>
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-6">Variables</div>

                <label className="tab">
                <input type="radio" name="my_tabs_6" className="tab" aria-label="Preview" />
                <i className="bi bi-image"></i> <span className="px-2">Preview</span>
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-6">Preview</div>
            </div>
        </>
    )
}

export default TemplateViewMain;