import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { logout } from '../axios_helper';

export default function Admin() {
    // --- STĂRI (STATE) ---
    const [users, setUsers] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedUserForDevice, setSelectedUserForDevice] = useState({});

    // Stări pentru Modale (Useri)
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        id: '', name: '', email: '', age: 0, role: 'USER'
    });

    // Stări Modale DISPOZITIVE
    const [showCreateDeviceModal, setShowCreateDeviceModal] = useState(false);
    const [showViewDeviceModal, setShowViewDeviceModal] = useState(false);
    const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);

    const [currentDevice, setCurrentDevice] = useState({
        id: '', name: '', consumption: 0, active: true
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
            console.error("Eroare la preluarea datelor:", e);
        }
    };

    // ==============================
    // HANDLERS UTILIZATORI
    // ==============================
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
            } catch (e) { alert("Eroare la ștergere."); }
        }
    };

    const handleViewClick = (user) => { setCurrentUser(user); setShowViewModal(true); };
    const handleEditClick = (user) => { setCurrentUser(user); setShowEditModal(true); };

    const handleSaveUserChanges = async () => {
        try {
            await axios.put(`/people/${currentUser.id}`, currentUser);
            alert("Utilizator actualizat!");
            setShowEditModal(false);
            fetchData();
        } catch (e) { alert("Eroare la actualizare user."); }
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
    };

    // ==============================
    // HANDLERS DISPOZITIVE
    // ==============================
    const handleSaveNewDevice = async () => {
        if (!newDevice.name || !newDevice.consumption) return alert("Date incomplete!");
        try {
            await axios.post('/devices', {
                name: newDevice.name,
                consumption: parseInt(newDevice.consumption),
                active: true
            });
            setShowCreateDeviceModal(false);
            fetchData();
            setNewDevice({ name: '', consumption: '' });
        } catch (e) { alert("Eroare la creare device."); }
    };

    const handleDeleteDevice = async (id) => {
        if (confirm("Sigur ștergi acest dispozitiv?")) {
            try {
                await axios.delete(`/devices/${id}`);
                fetchData();
            } catch (e) { alert("Eroare la ștergere device."); }
        }
    };

    const handleDeviceViewClick = (device) => { setCurrentDevice(device); setShowViewDeviceModal(true); };
    const handleDeviceEditClick = (device) => { setCurrentDevice(device); setShowEditDeviceModal(true); };

    const handleSaveDeviceChanges = async () => {
        try {
            await axios.put(`/devices/${currentDevice.id}`, {
                name: currentDevice.name,
                consumption: parseInt(currentDevice.consumption),
                active: currentDevice.active
            });
            alert("Dispozitiv actualizat!");
            setShowEditDeviceModal(false);
            fetchData();
        } catch (e) { alert("Eroare la actualizare device."); }
    };

    const handleDeviceEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentDevice(prev => ({ ...prev, [name]: value }));
    };

    // --- HANDLER MAPARE ---
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
        } catch (e) { alert("Eroare la mapare."); }
    };

    // --- HELPER PENTRU AFIȘARE STATUS (Funcția care lipsea!) ---
    const getStatusText = (userId) => {
        if (!userId) return <span className="text-warning fw-bold">Neatribuit</span>;

        const user = users.find(u => u.id === userId);
        const userName = user ? user.name : "Necunoscut";

        return <span className="text-success fw-bold">Atribuit lui: {userName}</span>;
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
                                            <button className="btn btn-outline-info btn-sm" onClick={() => handleViewClick(u)}>Vezi</button>
                                            <button className="btn btn-outline-warning btn-sm" onClick={() => handleEditClick(u)}>Edit</button>
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
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-bold">{d.name}</span>
                                            <span className="badge bg-info text-white">{d.consumption} kW</span>
                                        </div>

                                        <div className="btn-group">
                                            <button className="btn btn-outline-info btn-sm" onClick={() => handleDeviceViewClick(d)}>Vezi</button>
                                            <button className="btn btn-outline-warning btn-sm" onClick={() => handleDeviceEditClick(d)}>Edit</button>
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteDevice(d.id)}>Șterge</button>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 align-items-center mb-2">
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
                                        <button className="btn btn-primary btn-sm px-3" onClick={() => handleAssign(d.id)}>Save</button>
                                    </div>

                                    <div className="small text-muted">
                                        Status mapare: {getStatusText(d.userId)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALELE (Sunt aceleași, le includ pentru completitudine) */}

            {/* View User */}
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

            {/* Edit User */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Modificare Utilizator</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nume</Form.Label>
                            <Form.Control name="name" value={currentUser.name} onChange={handleUserChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" value={currentUser.email} onChange={handleUserChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vârstă</Form.Label>
                            <Form.Control name="age" type="number" value={currentUser.age} onChange={handleUserChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select name="role" value={currentUser.role} onChange={handleUserChange}>
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Anulează</Button>
                    <Button variant="primary" onClick={handleSaveUserChanges}>Salvează</Button>
                </Modal.Footer>
            </Modal>

            {/* Create Device */}
            <Modal show={showCreateDeviceModal} onHide={() => setShowCreateDeviceModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Adaugă Dispozitiv</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nume Dispozitiv</Form.Label>
                            <Form.Control placeholder="ex: Sensor X" value={newDevice.name} onChange={e => setNewDevice({...newDevice, name: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Consum</Form.Label>
                            <Form.Control type="number" value={newDevice.consumption} onChange={e => setNewDevice({...newDevice, consumption: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateDeviceModal(false)}>Anulează</Button>
                    <Button variant="success" onClick={handleSaveNewDevice}>Creează</Button>
                </Modal.Footer>
            </Modal>

            {/* View Device */}
            <Modal show={showViewDeviceModal} onHide={() => setShowViewDeviceModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Detalii Dispozitiv</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p><strong>ID:</strong> {currentDevice.id}</p>
                    <p><strong>Nume:</strong> {currentDevice.name}</p>
                    <p><strong>Consum Maxim:</strong> {currentDevice.consumption} kW</p>
                    <p><strong>Status:</strong> {currentDevice.active ? 'Activ' : 'Inactiv'}</p>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowViewDeviceModal(false)}>Închide</Button></Modal.Footer>
            </Modal>

            {/* Edit Device */}
            <Modal show={showEditDeviceModal} onHide={() => setShowEditDeviceModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Modificare Dispozitiv</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nume</Form.Label>
                            <Form.Control name="name" value={currentDevice.name} onChange={handleDeviceEditChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Consum Maxim</Form.Label>
                            <Form.Control name="consumption" type="number" value={currentDevice.consumption} onChange={handleDeviceEditChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditDeviceModal(false)}>Anulează</Button>
                    <Button variant="primary" onClick={handleSaveDeviceChanges}>Salvează</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}