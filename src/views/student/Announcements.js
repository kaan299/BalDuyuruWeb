import {
    Card,
    Col,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    Table,
    TabPane
} from "reactstrap";
import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {departmentType, facultyType, generalType, studentUserKey} from "../../constants";
import {database} from "../../firebase";

const Announcements = () => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const [announcements, setAnnouncements] = useState([]);
    const [facultyAnnouncements, setFacultyAnnouncements] = useState([]);
    const [departmentAnnouncements, setDepartmentAnnouncements] = useState([]);
    const facultyDepartment = JSON.parse(localStorage.getItem(studentUserKey));

    //genel tipindeki duyuru listesini getirir
    const getAnnouncements = () => {
        const q = query(collection(database, 'announcement'),
            where('type', '==', generalType));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            setAnnouncements(data);
        });
    }

    //öğrencinin fakültesine göre fakülte tipindeki duyuruları getirir
    const getFacultyAnnouncements = () => {
        const q = query(collection(database, 'announcement'),
            where('type', '==', facultyType), where("facultyId", "==", facultyDepartment.facultyId));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            setFacultyAnnouncements(data);
        });
    }

    //öğrencinin bölümüne göre bölüm tipindeki duyuruları getirir
    const getDepartmentAnnouncements = () => {
        const q = query(collection(database, 'announcement'),
            where('type', '==', departmentType), where("departmentId", "==", facultyDepartment.departmentId));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            setDepartmentAnnouncements(data);
        });
    }

    //sayfa açıldığı ilk anda duyuruları getirir
    useEffect(() => {
        getAnnouncements();
        getFacultyAnnouncements();
        getDepartmentAnnouncements();
    });

    return (
        <Card>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={activeTab === '1' ? "active" : ''}
                        href="#"
                        onClick={() => {
                            toggle('1');
                        }}
                    >
                        Genel
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={activeTab === '2' ? "active" : ''}
                        href="#"
                        onClick={() => {
                            toggle('2');
                        }}
                    >
                        Fakülte
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={activeTab === '3' ? "active" : ''}
                        href="#"
                        onClick={() => {
                            toggle('3');
                        }}
                    >
                        Bölüm
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <Row>
                        <Col sm="12" className="p-4">
                            <Table bordered>
                                <thead>
                                <tr>
                                    <th>Başlık</th>
                                    <th>İçerik</th>
                                </tr>
                                </thead>
                                <tbody>
                                {announcements.map(item => {
                                    return (
                                        <tr>
                                            <td>{item.title}</td>
                                            <td>{item.content}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col sm="12" className="p-4">
                            <Table bordered>
                                <thead>
                                <tr>
                                    <th>Başlık</th>
                                    <th>İçerik</th>
                                </tr>
                                </thead>
                                <tbody>
                                {facultyAnnouncements.map(item => {
                                    return (
                                        <tr>
                                            <td>{item.title}</td>
                                            <td>{item.content}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="3">
                    <Row>
                        <Col sm="12" className="p-4">
                            <Table bordered>
                                <thead>
                                <tr>
                                    <th>Başlık</th>
                                    <th>İçerik</th>
                                </tr>
                                </thead>
                                <tbody>
                                {departmentAnnouncements.map(item => {
                                    return (
                                        <tr>
                                            <td>{item.title}</td>
                                            <td>{item.content}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </Card>
    );
};

export default Announcements;
