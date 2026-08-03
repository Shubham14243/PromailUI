import AppViewMain from "../components/AppViewMain";
import AppViewSidebar from "../components/AppViewSidebar";
import Navbar from "../components/Navbar";


const AppView = () => {

    return (
        <>
            <Navbar />

            <div className="container mx-auto mt-5 w-full px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <aside className="md:col-span-1">
                        <AppViewSidebar />
                    </aside>
                    <main className="md:col-span-3">
                        <AppViewMain />
                    </main>
                </div>
            </div>
        </>
    )

}

export default AppView;