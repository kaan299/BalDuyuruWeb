import {
    Button,
    Card, CardBody, CardTitle,
    Col, Form, FormGroup, Input, Label,
    Row,
} from "reactstrap";
import {useEffect, useState} from "react";
import {addDoc, collection, getDocs, query, Timestamp, where} from "firebase/firestore";
import {academicianUserKey, departmentType, facultyType} from "../../constants";
import {database} from "../../firebase";
import {bolumRole, fakulteRole} from "../../roles";
import {Bounce, toast} from "react-toastify";

const Create = () => {
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState();
    const [selectedDepartment, setSelectedDepartment] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const user = JSON.parse(localStorage.getItem(academicianUserKey));

    const onSave = () => {
        if (!title) {
            toast.error('Başlık girin', {
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

        if (!content) {
            toast.error('İçerik girin', {
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
            title: title,
            content: content,
            createdDate: Timestamp.fromDate(new Date()),
            userId: user.id
        };

        if (selectedFaculty) {
            data.facultyId = selectedFaculty.id;
            data.type = facultyType;
        }

        if (selectedDepartment) {
            data.facultyId = selectedFaculty.id;
            data.departmentId = selectedDepartment.id;
            data.type = departmentType;
        }

        addDoc(collection(database, "announcement"), data).then(() => {
            setTitle(null);
            setContent(null);

            toast.success('Duyuru Başarıyla Gönderildi', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                transition: Bounce
            });
        });
    }

    //öğrencinin seçmesi için fakülte listesi getirir
    const getFaculties = () => {
        const q = query(collection(database, 'faculties'));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            const faculties = data.filter(f => f.id == user.facultyId);
            setSelectedFaculty(faculties[0]);
            setFaculties(data);
        });
    }

    //öğrencinin seçmesi için fakülte listesini sayfa yüklendiğinde getirir
    useEffect(() => {
        getFaculties();
    }, []);

    //öğrencinin seçmesi için fakülte listesini sayfa yüklendiğinde getirir
    useEffect(() => {
        if (selectedFaculty) {
            getDepartments(selectedFaculty.id);
        }
    }, [selectedFaculty]);

    //öğrencinin seçmesi için bölüm listesi getirir
    const getDepartments = (facultyId) => {
        const q = query(collection(database, 'departments'),
            where("facultyId", "==", parseInt(facultyId)));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            if (user.roles.includes(bolumRole)) {
                const departments = data.filter(d => d.id == user.departmentId);
                setDepartments(departments);
                setSelectedDepartment(departments[0]);
            } else if (user.roles.includes(fakulteRole)) {
                setDepartments(data);
            }
        });
    }

    //seçilen fakülteyle ilişkili bölümleri getirir ve seçilen fakülteyi state'de saklar
    // önceden seçilmiş fakülte varsa seçilen fakülte değişeceği için bölüm listesini boşaltır
    const onSelectFaculty = (id) => {
        const selectedItem = faculties.find(x => x.id == id);
        setSelectedFaculty(selectedItem);
        setDepartments([]);
        getDepartments(selectedItem.id);
    }

    //seçilen bölümünü state'de saklar
    const onSelectDepartment = (id) => {
        const selectedItem = departments.find(x => x.id == id);
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
                        Duyuru Ekle
                    </CardTitle>
                    <CardBody>
                        <Form>
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
                                <Label>Bölüm</Label>
                                <Input
                                    type="select"
                                    value={selectedDepartment?.id}
                                    disabled={(user && user.roles.includes(bolumRole)) || !selectedFaculty}
                                    onChange={(event) => onSelectDepartment(event.currentTarget.value)}
                                >
                                    <option selected>Seçiniz</option>
                                    {departments.map(item => <option value={item.id}>{item.name}</option>)}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>Başlık</Label>
                                <Input
                                    onChange={(event) => setTitle(event.target.value)}
                                    type="text"
                                    autoComplete="off"
                                    value={title}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>İçerik</Label>
                                <Input
                                    onChange={(event) => setContent(event.target.value)}
                                    type="textarea"
                                    valid={content}
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
