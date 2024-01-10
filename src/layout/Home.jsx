import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";


const Home = () => {
    return (
        <div>
            <div>
                <Navbar></Navbar>
            </div>
            <Outlet></Outlet>
        </div>
    );
};

export default Home;