import { useState } from "react";
import CreateApp from "../components/CreateApp";
import ListApp from "../components/ListApp";
import Navbar from "../components/Navbar";
import useGetApps from "../hooks/useGetApps";


const Home = () => {

    const [refresh, setRefresh] = useState(0);
    const { loading, appsData } = useGetApps(refresh);

    return (
        <>
            <Navbar />

            {loading ? (
                <div className="container mx-auto mt-5 w-full flex items-center justify-center">
                    <div className="flex w-[80%] flex-col gap-4">
                        <div className="skeleton h-20 w-full"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                            <div className="col-span-1 flex justify-start">
                                <div className="skeleton h-60 w-full"></div>
                            </div>
                            <div className="col-span-1 flex justify-start">
                                <div className="skeleton h-60 w-full"></div>
                            </div>
                            <div className="col-span-1 flex justify-start">
                                <div className="skeleton h-60 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : appsData === null ? (
                <div className="container mx-auto mt-5 w-full flex items-center justify-center">
                    <CreateApp setRefresh={setRefresh} />
                </div>
            ) : (<div className="container mx-auto mt-5 w-full flex items-center justify-center px-4">
                <ListApp appsData={appsData} setRefresh={setRefresh} />
            </div>
            )
            }
        </>
    )

}

export default Home;