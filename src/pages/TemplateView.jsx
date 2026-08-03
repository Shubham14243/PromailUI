import Navbar from "../components/Navbar";
import TemplateViewMain from "../components/TemplateViewMain";
import TemplateViewSidebar from "../components/TemplateViewSidebar";

const TemplateView = () => {
    return (
        <>
            <Navbar />

            <div className="container mx-auto mt-5 w-full px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <aside className="md:col-span-1">
                        <TemplateViewSidebar />
                    </aside>
                    <main className="md:col-span-3">
                        <TemplateViewMain />
                    </main>
                </div>
            </div>
        </>
    )
}

export default TemplateView;