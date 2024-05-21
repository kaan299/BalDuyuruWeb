import {Button, Nav, NavItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {adminRole, bolumRole, fakulteRole} from "../roles";
import {academicianUserKey, adminUserKey, studentUserKey} from "../constants";

const Sidebar = () => {
    const showMobilemenu = () => {
        document.getElementById("sidebarArea").classList.toggle("showSidebar");
    };
    let location = useLocation();

    let user = localStorage.getItem(adminUserKey);
    if (user == null) {
        user = localStorage.getItem(academicianUserKey);
    }

    if (user != null) {
        user = JSON.parse(user);
    }

    let student = localStorage.getItem(studentUserKey);
    if (student != null) {
        student = JSON.parse(student);
    }

    return (
        <div className="bg-dark">
            <div className="d-flex">
                <Button
                    color="white"
                    className="ms-auto text-white d-lg-none"
                    onClick={() => showMobilemenu()}
                >
                    <i className="bi bi-x"></i>
                </Button>
            </div>
            <div className="p-3 mt-2">
                <Nav vertical className="sidebarNav">
                    {user != null && user.roles.includes(adminRole) &&
                        <>
                            <NavItem className="sidenav-bg">
                                <Link
                                    to="/administrator/announcements"
                                    className={
                                        location.pathname === "/administrator/announcements"
                                            ? "active nav-link py-3"
                                            : "nav-link py-3"
                                    }
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span className="ms-3 d-inline-block">Duyurular</span>
                                </Link>
                            </NavItem>
                            <NavItem className="sidenav-bg">
                                <Link
                                    to="/administrator/create"
                                    className={
                                        location.pathname === "/administrator/create"
                                            ? "active nav-link py-3"
                                            : "nav-link py-3"
                                    }
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span className="ms-3 d-inline-block">Duyuru Ekle</span>
                                </Link>
                            </NavItem>
                            <NavItem className="sidenav-bg">
                                <Link
                                    to="/administrator/academicians"
                                    className={
                                        location.pathname === "/administrator/academicians"
                                            ? "active nav-link py-3"
                                            : "nav-link py-3"
                                    }
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span className="ms-3 d-inline-block">Akademisyenler</span>
                                </Link>
                            </NavItem>
                            <NavItem className="sidenav-bg">
                                <Link
                                    to="/administrator/academicians/create"
                                    className={
                                        location.pathname === "/administrator/academicians/create"
                                            ? "active nav-link py-3"
                                            : "nav-link py-3"
                                    }
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span className="ms-3 d-inline-block">Akademisyen Ekle</span>
                                </Link>
                            </NavItem>
                        </>
                    }
                    {user != null && (user.roles.includes(fakulteRole) || user.roles.includes(bolumRole)) &&
                        <>
                            <NavItem className="sidenav-bg">
                                <Link
                                    to="/academician/announcements"
                                    className={
                                        location.pathname === "/academician/announcements"
                                            ? "active nav-link py-3"
                                            : "nav-link py-3"
                                    }
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span className="ms-3 d-inline-block">Duyurular</span>
                                </Link>
                            </NavItem>
                            <NavItem className="sidenav-bg">
                                <Link
                                    to="/academician/create"
                                    className={
                                        location.pathname === "/academician/create"
                                            ? "active nav-link py-3"
                                            : "nav-link py-3"
                                    }
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span className="ms-3 d-inline-block">Duyuru Ekle</span>
                                </Link>
                            </NavItem>
                        </>
                    }
                    {student != null &&
                        <NavItem className="sidenav-bg">
                            <Link
                                to="/student/announcements"
                                className={
                                    location.pathname === "/student/announcements"
                                        ? "active nav-link py-3"
                                        : "nav-link py-3"
                                }
                            >
                                <i className="bi bi-speedometer2"></i>
                                <span className="ms-3 d-inline-block">Duyurular</span>
                            </Link>
                        </NavItem>
                    }
                </Nav>
            </div>
        </div>
    );
};

export default Sidebar;
