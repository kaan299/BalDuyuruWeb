import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import React from "react";
import FullLayout from "./layouts/FullLayout";
import Home from "./views/Home";
import Login from "./views/Login";
import {academicianUserKey, adminUserKey, studentUserKey} from "./constants";
import StudentAnnouncements from "./views/student/Announcements";
import AcademicianAnnouncements from "./views/academician/Announcements";
import CreateAnnouncement from "./views/academician/Create";
import AdminCreateAnnouncement from "./views/admin/Create";
import Announcements from "./views/admin/Announcements";
import AcademicianManagement from "./views/admin/Management";
import CreateAcademician from "./views/admin/CreateAcademician";

const PrivateRoute = ({element}) => {
    return checkLogin() ? element : <Navigate to="/login" replace/>;
};

const checkLogin = () => {
    return !(!localStorage.getItem(studentUserKey) && !localStorage.getItem(adminUserKey) && !localStorage.getItem(academicianUserKey));
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRoute element={<FullLayout/>}/>}>
                    <Route index element={<Home/>}/>
                    <Route path="student">
                        <Route path="announcements" element={<StudentAnnouncements/>}/>
                    </Route>
                    <Route path="academician">
                        <Route path="announcements" element={<AcademicianAnnouncements/>}/>
                        <Route path="create" element={<CreateAnnouncement/>}/>
                    </Route>
                    <Route path="administrator">
                        <Route path="announcements" element={<Announcements/>}/>
                        <Route path="create" element={<AdminCreateAnnouncement/>}/>
                        <Route path="academicians" element={<AcademicianManagement/>}/>
                        <Route path="academicians/create" element={<CreateAcademician/>}/>
                    </Route>
                </Route>
                <Route path="login" element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    )
};

export default App;
