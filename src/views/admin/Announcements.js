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

    //tüm duyuru listesini getirir
    const getAnnouncements = () => {
        const q = query(collection(database, 'announcement'));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            setAnnouncements(data);
        });
    }

    //sayfa açıldığı ilk anda duyuruları getirir
    useEffect(() => {
        getAnnouncements();
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
            </TabContent>
        </Card>
    );
};

export default Announcements;
