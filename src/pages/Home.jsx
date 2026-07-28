import CreateApp from "../components/CreateApp";
import ListApp from "../components/ListApp";
import Navbar from "../components/Navbar";


const Home = () => {

    return (
        <>
            <Navbar />

            <div className="container mx-auto mt-5 w-full flex items-center justify-center">
                <CreateApp />
            </div>

            <div className="container mx-auto mt-5 w-full flex items-center justify-center px-4">
                <ListApp />
            </div>
        </>
    )

}

export default Home;