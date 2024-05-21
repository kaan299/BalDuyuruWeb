import {Col, Row} from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import Feeds from "../components/dashboard/Feeds";
import ProjectTables from "../components/dashboard/ProjectTable";

import Blog from "../components/dashboard/Blog";
import bg1 from "../assets/images/bg/bg1.jpg";
import bg2 from "../assets/images/bg/bg2.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";
import {academicianUserKey, adminUserKey, studentUserKey} from "../constants";
import {Navigate} from "react-router-dom";

const BlogData = [
    {
        image: bg1,
        title: "This is simple blog",
        subtitle: "2 comments, 1 Like",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content.",
        btnbg: "primary",
    },
    {
        image: bg2,
        title: "Lets be simple blog",
        subtitle: "2 comments, 1 Like",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content.",
        btnbg: "primary",
    },
    {
        image: bg3,
        title: "Don't Lamp blog",
        subtitle: "2 comments, 1 Like",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content.",
        btnbg: "primary",
    },
    {
        image: bg4,
        title: "Simple is beautiful",
        subtitle: "2 comments, 1 Like",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content.",
        btnbg: "primary",
    },
];

const Home = () => {
    
    if (localStorage.getItem(adminUserKey)) {
        return Navigate({to: "/administrator/announcements"});
    } else if (localStorage.getItem(academicianUserKey)) {
        return Navigate({to: "/academician/announcements"});
    } else if (localStorage.getItem(studentUserKey)) {
        return Navigate({to: "/student/announcements"});
    }

    return (
        <div>
            Anasayfa
        </div>
    );
};

export default Home;
