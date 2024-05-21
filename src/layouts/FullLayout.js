import {Outlet} from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {Container} from "reactstrap";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const FullLayout = () => {
    return (
        <main>
            <ToastContainer/>
            {/********header**********/}
            <Header/>
            <div className="pageWrapper d-lg-flex">
                {/********Sidebar**********/}
                <aside className="sidebarArea shadow" id="sidebarArea">
                    <Sidebar/>
                </aside>
                {/********Content Area**********/}
                <div className="w-100">
                    {/********Middle Content**********/}
                    <Container className="p-4" fluid>
                        <Outlet/>
                    </Container>
                </div>
            </div>
        </main>
    );
};

export default FullLayout;
