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

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-5 w-full px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <aside className="md:col-span-1">
                        {loading || !templateData ? (<div className="flex w-[80%] flex-col gap-4">
                            <div className="skeleton h-10 w-full"></div>
                            <div className="skeleton h-40 w-full"></div>
                            <div className="skeleton h-40 w-full"></div>
                        </div>) : (
                            <TemplateViewSidebar
                                templateData={templateData}
                                setTemplateDataRefresh={setTemplateDataRefresh}
                            />
                        )}
                    </aside>
                    <main className="md:col-span-3">
                        {loading || !templateData ? (<div className="container mx-auto mt-5 w-full flex items-center justify-center">
                            <div className="flex w-[80%] flex-col gap-4">
                                <div className="skeleton h-20 w-full"></div>
                                <div className="skeleton h-120 w-full"></div>
                            </div>
                        </div>) : (
                            <TemplateViewMain key={templateData.template_id} templateData={templateData} />
                        )}
                    </main>
                </div>
            </div>
        </>
    )
}

export default TemplateView;