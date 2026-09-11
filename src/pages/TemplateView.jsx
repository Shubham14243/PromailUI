import Navbar from "../components/Navbar";
import TemplateViewMain from "../components/TemplateViewMain";
import TemplateViewSidebar from "../components/TemplateViewSidebar";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useGetTemplate from "../hooks/useGetTemplate";

const TemplateView = () => {

    const { templateid } = useParams();
    const [templateDataRefresh, setTemplateDataRefresh] = useState(0);

    const { loading, templateData } = useGetTemplate(templateid, templateDataRefresh);

    if (loading || !templateData) {
        return (
            <div className="card bg-neutral text-neutral-content shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">
                        {loading ? "Loading template..." : "Template unavailable"}
                    </h2>
                    <p className="text-sm opacity-80">
                        {loading
                            ? "Fetching template details."
                            : "The requested template could not be loaded."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container mx-auto mt-5 w-full px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <aside className="md:col-span-1">
                        <TemplateViewSidebar
                            templateData={templateData}
                            setTemplateDataRefresh={setTemplateDataRefresh}
                        />
                    </aside>
                    <main className="md:col-span-3">
                        <TemplateViewMain key={templateData.template_id} templateData={templateData} />
                    </main>
                </div>
            </div>
        </>
    )
}

export default TemplateView;