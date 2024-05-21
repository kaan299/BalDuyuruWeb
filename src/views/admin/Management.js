import {
    Button,
    Card,
    Col, Modal, ModalBody, ModalFooter, ModalHeader,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    Table,
    TabPane
} from "reactstrap";
import {useEffect, useState} from "react";
import {apiURL} from "../../constants";
import {Bounce, toast} from "react-toastify";

const Announcements = () => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const [academicians, setAcademicians] = useState([]);

    //akademisyenleri listeler
    const getAcademicians = () => {
        fetch(apiURL + "/academicians", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(response => {
                setAcademicians(response);
            });
    }

    useEffect(() => {
        getAcademicians();
    }, []);

    const onDelete = (id) => {
        fetch(apiURL + "/academicians/" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            toggleModal(null);
            toast.success('Akademisyen Silindi', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                transition: Bounce
            });
            getAcademicians();
        }).catch(err => {
            toast.success('Akademisyen silinirken bir hata oluştu.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                transition: Bounce
            });
        });
    };

    const [modalOpen, setModalOpen] = useState({id: null, open: false});

    const toggleModal = (id) => setModalOpen({id: id, open: !modalOpen.open});

    const handleConfirm = (id) => {
        onDelete(id);
        toggleModal();
    };

    const ConfirmModal = ({isOpen, toggle, title, message, onConfirm}) => {
        return (
            <Modal isOpen={isOpen.open} toggle={toggle}>
                <ModalHeader toggle={toggle}>{title}</ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=> onConfirm(isOpen.id)}>Evet</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Hayır</Button>
                </ModalFooter>
            </Modal>
        );
    };

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
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {academicians.map(item => {
                                    return (
                                        <tr>
                                            <td>{item.displayName}</td>
                                            <td>{item.email}</td>
                                            <td>
                                                <button onClick={() => toggleModal(item.id)}>Sil</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
            <ConfirmModal
                isOpen={modalOpen}
                toggle={toggleModal}
                title="Onay"
                message="Bu işlemi yapmak istediğinize emin misiniz?"
                onConfirm={handleConfirm}
            />
        </Card>
    );
};

export default Announcements;
