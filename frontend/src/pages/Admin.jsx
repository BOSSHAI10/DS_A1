import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { logout } from '../axios_helper';

export default function Admin() {
    // --- STĂRI ---
    const [users, setUsers] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedUserForDevice, setSelectedUserForDevice] = useState({});

    // Stări Modale
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateDeviceModal, setShowCreateDeviceModal] = useState(false);

    const [currentUser, setCurrentUser] = useState({
        id: '', name: '', email: '', age: 0, role: 'USER'
    });
    const [newDevice, setNewDevice] = useState({ name: '', consumption: '' });

    // --- INITIALIZARE ---
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const uRes = await axios.get("/people");
            const dRes = await axios.get("/devices");
            setUsers(uRes.data);
            setDevices(dRes.data);
        } catch (e) {
            console.error("Eroare load data:", e);
        }
    };

    // --- LOGICA DISPOZITIVE ---

    const handleAssign = async (deviceId) => {
        const selectedValue = selectedUserForDevice[deviceId];
        if (!selectedValue) return alert("Selectează o opțiune!");

        try {
            if (selectedValue === "unassign") {
                await axios.post(`/devices/${deviceId}/unassign`);
            } else {
                await axios.post(`/devices/${deviceId}/assign/${selectedValue}`);
            }
            alert("Actualizat cu succes!");
            fetchData();
            setSelectedUserForDevice(prev => ({...prev, [deviceId]: ""}));
        } catch (e) {
            alert("Eroare la mapare: " + e.message);
        }
    };

    // HANDLER NOU: ȘTERGERE DISPOZITIV
    const handleDeleteDevice = async (id) => {
        if (confirm("Sigur ștergi acest dispozitiv?")) {
            try {
                await axios.delete(`/devices/${id}`);
                fetchData(); // Reîmprospătăm lista
            } catch (e) {
                alert("Eroare la ștergerea dispozitivului.");
            }
        }
    };

    const handleSaveNewDevice = async () => {
        if (!newDevice.name || !newDevice.consumption) return alert("Completează datele!");
        try {
            await axios.post('/devices', {
                name: newDevice.name,
                consumption: parseInt(newDevice.consumption),
                active: true
            });
            setShowCreateDeviceModal(false);
            fetchData();
            setNewDevice({ name: '', consumption: '' });
        } catch (e) { alert("Eroare la creare."); }
    };

    // --- LOGICA UTILIZATORI ---
    const handleCreateUser = async () => {
        const name = prompt("Nume utilizator:");
        const email = prompt("Email:");
        const age = prompt("Varsta:");
        if(name && email) {
            try {
                await axios.post("/people", { name, email, age: parseInt(age), role: "USER" });
                fetchData();
            } catch (e) { alert("Eroare la creare user."); }
        }
    };

    const handleDeleteUser = async (id) => {
        if (confirm("Sigur ștergi utilizatorul?")) {
            try {
                await axios.delete(`/people/${id}`);
                fetchData();
            } catch (e) { alert("Eroare."); }
        }
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`/people/${currentUser.id}`, currentUser);
            alert("Utilizator actualizat!");
            setShowEditModal(false);
            fetchData();
        } catch (e) { alert("Eroare update."); }
    };

    // --- HELPERS ---
    const getStatusText = (userId) => {
        if (!userId) return <span className="text-warning fw-bold">Neatribuit</span>;

        const user = users.find(u => u.id === userId);
        const userName = user ? user.name : "Utilizator șters";

        return <span className="text-success fw-bold">Atribuit userului - {userName}</span>;
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="fw-normal">Admin Dashboard</h1>
                <button className="btn btn-danger px-4" onClick={logout}>Logout</button>
            </div>

            <div className="row gx-5">
                {/* === COL 1: UTILIZATORI === */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
                            <h5 className="mb-0 text-secondary">Utilizatori</h5>
                            <button className="btn btn-success btn-sm px-3 fw-bold" onClick={handleCreateUser}>+ Adaugă</button>
                        </div>
                        <div className="list-group list-group-flush">
                            {users.map(u => (
                                <div key={u.id} className="list-group-item py-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0 fw-bold">{u.name}</h6>
                                            <small className="text-muted">{u.email} ({u.role})</small>
                                        </div>
                                        <div className="btn-group">
                                            <button className="btn btn-outline-info btn-sm" onClick={() => {setCurrentUser(u); setShowViewModal(true)}}>Vezi</button>
                                            <button className="btn btn-outline-warning btn-sm" onClick={() => {setCurrentUser(u); setShowEditModal(true)}}>Edit</button>
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>Șterge</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* === COL 2: DISPOZITIVE & MAPARE === */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
                            <h5 className="mb-0 text-secondary">Dispozitive & Mapare</h5>
                            <button className="btn btn-success btn-sm px-3 fw-bold" onClick={() => setShowCreateDeviceModal(true)}>+ Adaugă</button>
                        </div>
                        <div className="card-body p-0">
                            {devices.map(d => (
                                <div key={d.id} className="p-3 border-bottom">
                                    {/* Header Device: Nume + Buton Șterge */}
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-bold">{d.name}</span>
                                            <span className="badge bg-info text-white">{d.consumption} kW</span>
                                        </div>
                                        {/* BUTON NOU DE ȘTERGERE DEVICE */}
                                        <button
                                            className="btn btn-outline-danger btn-sm py-0"
                                            style={{fontSize: '0.8rem'}}
                                            onClick={() => handleDeleteDevice(d.id)}
                                        >
                                            Șterge
                                        </button>
                                    </div>

                                    {/* Selector Mapare */}
                                    <div className="d-flex gap-2 align-items-center" style={{maxWidth: '100%'}}>
                                        <select
                                            className="form-select form-select-sm"
                                            value={selectedUserForDevice[d.id] || ""}
                                            onChange={e => setSelectedUserForDevice({...selectedUserForDevice, [d.id]: e.target.value})}
                                        >
                                            <option value="">Schimbă atribuirea...</option>
                                            <option value="unassign" className="text-danger fw-bold">-- Neatribuit --</option>
                                            {users.filter(u => u.role === 'USER').map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                        <button className="btn btn-primary btn-sm" onClick={() => handleAssign(d.id)}>Save</button>
                                    </div>

                                    {/* Status Text Actualizat */}
                                    <div className="small mt-2">
                                        <span className="text-muted">Status mapare: </span>
                                        {getStatusText(d.userId)}
                                    </div>
                                </div>
                            ))}
                            {devices.length === 0 && <div className="p-4 text-center text-muted">Niciun dispozitiv găsit.</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALELE (VIEW, EDIT USER, CREATE DEVICE) */}

            {/* Modal View User */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Detalii Utilizator</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p><strong>Nume:</strong> {currentUser.name}</p>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                    <p><strong>Vârstă:</strong> {currentUser.age}</p>
                    <p><strong>Rol:</strong> {currentUser.role}</p>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowViewModal(false)}>Închide</Button></Modal.Footer>
            </Modal>

            {/* Modal Edit User */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Editare Utilizator</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nume</Form.Label>
                            <Form.Control value={currentUser.name} onChange={e => setCurrentUser({...currentUser, name: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vârstă</Form.Label>
                            <Form.Control type="number" value={currentUser.age} onChange={e => setCurrentUser({...currentUser, age: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Anulează</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Salvează</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Create Device */}
            <Modal show={showCreateDeviceModal} onHide={() => setShowCreateDeviceModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Adaugă Dispozitiv</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nume Dispozitiv</Form.Label>
                            <Form.Control placeholder="ex: Contor Gaz" value={newDevice.name} onChange={e => setNewDevice({...newDevice, name: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Consum Maxim</Form.Label>
                            <Form.Control type="number" placeholder="ex: 100" value={newDevice.consumption} onChange={e => setNewDevice({...newDevice, consumption: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateDeviceModal(false)}>Anulează</Button>
                    <Button variant="success" onClick={handleSaveNewDevice}>Creează</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}