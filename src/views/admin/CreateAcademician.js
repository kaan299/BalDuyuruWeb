import {
    Button,
    Card, CardBody, CardTitle,
    Col, Form, FormGroup, Input, Label,
    Row,
} from "reactstrap";
import {useEffect, useState} from "react";
import {addDoc, collection, getDocs, query, Timestamp, where} from "firebase/firestore";
import {academicianUserKey, adminUserKey, apiURL, departmentType, facultyType, generalType} from "../../constants";
import {database} from "../../firebase";
import {bolumRole, fakulteRole} from "../../roles";
import {Bounce, toast} from "react-toastify";

const Create = () => {
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState();
    const [selectedDepartment, setSelectedDepartment] = useState();
    const [displayName, setDisplayName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const onSave = () => {
        if (!selectedFaculty) {
            toast.error('Fakülte seçin', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                transition: Bounce
            });
            return;
        }

        if (!displayName) {
            toast.error('Ad soyad girin', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                transition: Bounce
            });
            return;
        }

        if (!email) {
            toast.error('Eposta girin', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                transition: Bounce
            });
            return;
        }

        if (!password) {
            toast.error('Şifre girin', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                transition: Bounce
            });
            return;
        }


        const data = {
            displayName: displayName,
            email: email,
            password: password,
            facultyId: selectedFaculty.id
        };

        if (selectedFaculty) {
            data.role = fakulteRole;
        }

        if (selectedDepartment) {
            data.departmentId = selectedDepartment.id;
            data.role = bolumRole;
        }

        fetch(apiURL + "/academicians", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => {
            toast.success('Akademisyen başarıyla eklendi.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                transition: Bounce
            });
        }).catch(error => console.log(error));
    }

    //fakülteler listelenir
    const getFaculties = () => {
        const q = query(collection(database, 'faculties'));
        getDocs(q).then(snapshot => {
            const faculties = snapshot.docs.map(x => x.data());
            setFaculties(faculties);
            getDepartments(faculties[0].id);
        });
    }

    //fakülteye bağlı bölümler listelenir
    const getDepartments = (facultyId) => {
        const q = query(collection(database, 'departments'),
            where("facultyId", "==", facultyId));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            setDepartments(data);
        });
    }

    //öğrencinin seçmesi için fakülte listesini sayfa yüklendiğinde getirir
    useEffect(() => {
        getFaculties();
    }, []);


    //fakülte seçimini state'te saklanır
    //bölüm listesi önceden fakülte seçilmişse temizlenir
    //seçilen fakülteye göre bölümler tekrar getirilir
    const onSelectFaculty = (id) => {
        const selectedItem = faculties.find(x => x.id == id);
        setSelectedFaculty(selectedItem);
        getDepartments(selectedItem.id);
    }

    //seçilen bölüm bilgisi state'de saklanır
    const onSelectDepartment = (selectedItem) => {
        setSelectedDepartment(selectedItem);
        setSelectedDepartment(selectedItem);
    }
    
    return (
        <Row>
            <Col>
                {/* --------------------------------------------------------------------------------*/}
                {/* Card-1*/}
                {/* --------------------------------------------------------------------------------*/}
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        Akademisyen Ekle
                    </CardTitle>
                    <CardBody>
                        <Form autoComplete='none'>
                            <FormGroup>
                                <Label>Fakülte</Label>
                                <Input
                                    type="select"
                                    value={selectedFaculty?.id}
                                    onChange={(event) => onSelectFaculty(event.currentTarget.value)}
                                >
                                    <option selected>Seçiniz</option>
                                    {faculties.map(item => <option value={item.id}>{item.name}</option>)}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Bölüm
                                </Label>
                                <Input type="select" onChange={(event) => onSelectDepartment(event.currentTarget.value)}>
                                    <option selected>Bölüm Seçiniz</option>
                                    {departments.map(item => <option value={item.id}>{item.name}</option>)}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>Ad soyad</Label>
                                <Input
                                    onChange={(event) => setDisplayName(event.target.value)}
                                    type="text"
                                    autoComplete="new-password"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Eposta</Label>
                                <Input
                                    onChange={(event) => setEmail(event.target.value)}
                                    type="email"
                                    autoComplete="new-password"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Şifre</Label>
                                <Input
                                    onChange={(event) => setPassword(event.target.value)}
                                    type="password"
                                    autoComplete="new-password"
                                />
                            </FormGroup>
                            <Button onClick={onSave}>Kaydet</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default Create;
