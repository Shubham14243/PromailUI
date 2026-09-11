import { useState } from "react";
import { useParams } from "react-router-dom";
import AppViewMain from "../components/AppViewMain";
import AppViewSidebar from "../components/AppViewSidebar";
import Navbar from "../components/Navbar";
import useGetAppSingle from "../hooks/useGetAppSingle";
import useGetTemplates from "../hooks/useGetTemplates";

const AppView = () => {
    const { appid } = useParams();

    const [pages, setPages] = useState({
        limit: 9,
        offset: 0,
    });

    const [appDataRefresh, setAppDataRefresh] = useState(0);
    const { loading, appData } = useGetAppSingle(appid, appDataRefresh);
    const { loading: templatesLoading, templateData } = useGetTemplates(appid, appDataRefresh, pages.limit, pages.offset);

    return (
        <>
            <Navbar />

            <div className="container mx-auto mt-5 w-full px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <AppViewSidebar appData={appData} loading={loading} setAppDataRefresh={setAppDataRefresh} />
                    </aside>
                    <main className="md:col-span-3">
                        <AppViewMain templateData={templateData} templatesLoading={templatesLoading} setAppDataRefresh={setAppDataRefresh} appID={appid}
                         pages={pages} setPages={setPages}  />
                    </main>
                </div>
            </div>
        </>
    )

}

export default AppView;