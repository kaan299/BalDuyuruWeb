import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Container,
    FormGroup,
    Label,
    Input, CardImg
} from "reactstrap";
import {useEffect, useState} from "react";
import logo from "../assets/images/balikesir-universitesi-logo.png";
import {academicianUserKey, adminUserKey, studentUserKey} from "../constants";
import {auth, database} from '../firebase'
import {collection, getDocs, query, where} from "firebase/firestore";
import {signInWithEmailAndPassword} from "firebase/auth";
import {Navigate, useNavigate,} from "react-router-dom";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {adminRole, bolumRole, fakulteRole} from "../roles";

const RenderSelection = ({selection, setSelection}) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState();
    const [selectedDepartment, setSelectedDepartment] = useState();

    //öğrencinin seçmesi için fakülte listesi getirir
    const getFaculties = () => {
        const q = query(collection(database, 'faculties'));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            setFaculties(data);
        });
    }

    //öğrencinin seçmesi için fakülte listesini sayfa yüklendiğinde getirir
    useEffect(() => {
        getFaculties();
    }, []);

    //öğrencinin seçmesi için bölüm listesi getirir
    const getDepartments = (facultyId) => {
        const q = query(collection(database, 'departments'),
            where("facultyId", "==", parseInt(facultyId)));
        getDocs(q).then(snapshot => {
            const data = snapshot.docs.map(x => x.data());
            setDepartments(data);
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

        if (!selectedDepartment) {
            toast.error('Bölüm seçin', {
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
            facultyId: selectedFaculty.id,
            facultyName: selectedFaculty.name,
            departmentId: selectedDepartment.id,
            departmentName: selectedDepartment.name,
        };

        localStorage.setItem(studentUserKey, JSON.stringify(data));
        navigate("/student/announcements");
    }

    const onLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                const q = query(collection(database, 'roles'), where('userId', '==', user.uid));
                getDocs(q).then(snapshot => {
                    const userRoles = snapshot.docs[0].data().roles;
                    if (userRoles.includes(adminRole)) {
                        const userInfo = JSON.stringify({
                            id: user.uid,
                            email: user.email,
                            name: user.displayName,
                            roles: userRoles,
                        });
                        localStorage.setItem(adminUserKey, userInfo);
                        navigate("/administrator/announcements");
                    } else if (userRoles.includes(fakulteRole) || userRoles.includes(bolumRole)) {
                        const userRole = snapshot.docs[0].data();
                        const userInfo = JSON.stringify({
                            id: user.uid,
                            email: user.email,
                            name: user.displayName,
                            roles: userRoles,
                            facultyId: userRole.facultyId,
                            departmentId: userRole.departmentId
                        });
                        localStorage.setItem(academicianUserKey, userInfo);
                        navigate("/academician/announcements");
                    } else {
                        toast.error('Yetki bulunamadı', {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            theme: "light",
                            transition: Bounce
                        });
                    }
                }).catch(error => {
                    toast.error('Bir hata oluştu', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: "light",
                        transition: Bounce
                    });
                });
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                    toast.error('E-posta geçersiz', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: "light",
                        transition: Bounce
                    });
                }

                if (error.code === 'auth/missing-password') {
                    toast.error('Şifre geçersiz', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: "light",
                        transition: Bounce
                    });
                }

                if (error.code === 'auth/invalid-credential') {
                    toast.error('Kullanıcı bulunamadı', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: "light",
                        transition: Bounce
                    });
                }
                console.log(error);
            });
    }

    if (selection.type == studentUserKey) {
        return (
            <>
                <h4 className="text-center">Öğrenci Girişi</h4>
                <FormGroup className="pb-2 w-75 mx-auto">
                    <Label className="mr-sm-2">
                        Fakülte
                    </Label>
                    <Input type="select" onChange={(event) => onSelectFaculty(event.currentTarget.value)}>
                        <option selected>Fakülte Seçiniz</option>
                        {faculties.map(item => <option value={item.id}>{item.name}</option>)}
                    </Input>
                </FormGroup>
                <FormGroup className="pb-2 w-75 mx-auto">
                    <Label className="mr-sm-2">
                        Bölüm
                    </Label>
                    <Input type="select" onChange={(event) => onSelectDepartment(event.currentTarget.value)}>
                        <option selected>Bölüm Seçiniz</option>
                        {departments.map(item => <option value={item.id}>{item.name}</option>)}
                    </Input>
                </FormGroup>
                <FormGroup className="pb-2 w-75 mx-auto">
                    <Row>
                        <Col>
                            <Button color="warning"
                                    onClick={() => setSelection({opened: false, type: ""})}>
                                Geri Dön
                            </Button>
                        </Col>
                        <Col>
                            <Button color="primary" className="w-100" onClick={onSave}>
                                Seçimleri Kaydet
                            </Button>
                        </Col>
                    </Row>
                </FormGroup>
            </>
        )
    }

    return (
        <>
            <h4 className="text-center">{selection.type == adminUserKey ? "Yönetici Girişi" : "Akademisyen Girişi"}</h4>
            <FormGroup className="pb-2 w-75 mx-auto">
                <Label className="mr-sm-2">
                    Eposta
                </Label>
                <Input
                    type="email"
                    name="email"
                    onChange={(ev) => setEmail(ev.currentTarget.value)}
                />
            </FormGroup>
            <FormGroup className="pb-2 w-75 mx-auto">
                <Label className="mr-sm-2">
                    Şifre
                </Label>
                <Input
                    type="password"
                    name="password"
                    onChange={(ev) => setPassword(ev.currentTarget.value)}
                />
            </FormGroup>
            <FormGroup className="pb-2 w-75 mx-auto">
                <Row>
                    <Col>
                        <Button color="warning"
                                onClick={() => setSelection({opened: false, type: ""})}>
                            Geri Dön
                        </Button>
                    </Col>
                    <Col>
                        <Button color="primary" className="w-100" onClick={onLogin}>
                            Giriş Yap
                        </Button>
                    </Col>
                </Row>
            </FormGroup>
        </>
    )
}
const Login = () => {
    const [selection, setSelection] = useState({opened: false, type: ""});

    return (
        <Container>
            <ToastContainer/>
            <Row className="mx-auto w-50">
                <Col>
                    <Card className="mt-5">
                        <CardBody>
                            <Row>
                                <Col>
                                    <CardImg alt="" src={logo} style={{width: "40%"}}
                                             className="mx-auto d-block p-2 mb-4"/>
                                </Col>
                            </Row>
                            <Row className={selection.opened ? "d-none" : ""}>
                                <Col>
                                    <Button
                                        onClick={() => setSelection({opened: true, type: studentUserKey})}
                                        color="default"
                                        style={{backgroundColor: "#008884", color: "#fff"}}
                                        className="w-75 mx-auto d-block p-2 mb-4">
                                        Öğrenci
                                    </Button>
                                </Col>
                            </Row>
                            <Row className={selection.opened ? "d-none" : ""}>
                                <Col>
                                    <Button
                                        onClick={() => setSelection({opened: true, type: academicianUserKey})}
                                        color="default"
                                        style={{backgroundColor: "#30b8be", color: "#fff"}}
                                        className="w-75 mx-auto d-block p-2 mb-4">
                                        Akademisyen
                                    </Button>
                                </Col>
                            </Row>
                            <Row className={selection.opened ? "d-none" : ""}>
                                <Col>
                                    <Button
                                        onClick={() => setSelection({opened: true, type: adminUserKey})}
                                        color="default"
                                        style={{backgroundColor: "#2aabde", color: "#fff"}}
                                        className="w-75 mx-auto d-block p-2 mb-4">
                                        Yönetici
                                    </Button>
                                </Col>
                            </Row>
                            <Row className={selection.opened ? "" : "d-none"}>
                                <Col>
                                    <RenderSelection selection={selection} setSelection={setSelection}/>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
        ;
};

export default Login;
