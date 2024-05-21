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
import {academicianUserKey, departmentType, facultyType} from "../../constants";
import {database} from "../../firebase";
import {bolumRole, fakulteRole} from "../../roles";

const Announcements = () => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const [facultyAnnouncements, setFacultyAnnouncements] = useState([]);
    const [departmentAnnouncements, setDepartmentAnnouncements] = useState([]);
    const user = JSON.parse(localStorage.getItem(academicianUserKey));

    //akademisyenin fakültesine göre fakülte tipindeki duyuruları getirir
    const getFacultyAnnouncements = () => {
        const q = query(collection(database, 'announcement'),
            where('type', '==', facultyType), where("userId", "==", user.id));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            setFacultyAnnouncements(data);
        });
    }

    //akademisyenin bölümüne göre bölüm tipindeki duyuruları getirir
    const getDepartmentAnnouncements = () => {
        const q = query(collection(database, 'announcement'),
            where('type', '==', departmentType), where("userId", "==", user.id));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            setDepartmentAnnouncements(data);
        });
    }

    //sayfa açıldığı ilk anda duyuruları getirir
    useEffect(() => {
        if (user != null && user.roles.includes(fakulteRole)) {
            getFacultyAnnouncements();
            getDepartmentAnnouncements();
        } else if (user != null && user.roles.includes(bolumRole)) {
            getDepartmentAnnouncements();
        }
    });

    return (
        <Card>
            <Nav tabs>
                {user != null && user.roles.includes(fakulteRole) &&
                    <>
                        <NavItem>
                            <NavLink
                                className={activeTab === '1' ? "active" : ''}
                                href="#"
                                onClick={() => {
                                    toggle('1');
                                }}
                            >
                                Fakülte
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
                                Bölüm
                            </NavLink>
                        </NavItem>
                    </>
                }
                {user != null && user.roles.includes(bolumRole) &&
                    <NavItem>
                        <NavLink
                            className={activeTab === '1' ? "active" : ''}
                            href="#"
                            onClick={() => {
                                toggle('1');
                            }}
                        >
                            Bölüm
                        </NavLink>
                    </NavItem>
                }
            </Nav>
            <TabContent activeTab={activeTab}>
                {user != null && user.roles.includes(fakulteRole) &&
                    <>
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
                    </>
                }
                {user != null && user.roles.includes(bolumRole) &&
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
                }
            </TabContent>
        </Card>
    );
};

export default Announcements;
