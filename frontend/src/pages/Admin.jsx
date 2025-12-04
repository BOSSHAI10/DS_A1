// src/pages/Admin.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { logout } from '../axios_helper';

export default function Admin() {
    const [users, setUsers] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedUser, setSelectedUser] = useState({}); // Pentru mapare

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const uRes = await axios.get("/people");   // Users Service
            const dRes = await axios.get("/devices"); // Devices Service
            setUsers(uRes.data);
            setDevices(dRes.data);
        } catch (e) {
            alert("Eroare la încărcarea datelor: " + e.message);
        }
    };

    // MAPARE: Endpoint-ul adăugat de tine: POST /devices/{id}/assign/{userId}
    const handleAssign = async (deviceId) => {
        const userId = selectedUser[deviceId];
        if (!userId) return alert("Selectează un utilizator!");

        try {
            await axios.post(`/devices/${deviceId}/assign/${userId}`);
            alert("Dispozitiv atribuit cu succes!");
            fetchData(); // Reîmprospătare
        } catch (e) {
            alert("Eroare la mapare: " + e.message);
        }
    };

    // CREATE USER (Simplificat)
    const handleCreateUser = async () => {
        const name = prompt("Nume utilizator:");
        const email = prompt("Email:");
        const age = prompt("Varsta:");
        if(name && email) {
            await axios.post("/people", { name, email, age: parseInt(age), role: "USER" });
            fetchData();
        }
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>Admin Dashboard</h2>
                <button className="btn btn-danger" onClick={logout}>Logout</button>
            </div>

            <div className="row">
                {/* --- USERS SECTION --- */}
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <h5>Utilizatori</h5>
                            <button className="btn btn-sm btn-success" onClick={handleCreateUser}>+ Adaugă</button>
                        </div>
                        <ul className="list-group list-group-flush">
                            {users.map(u => (
                                <li key={u.id} className="list-group-item d-flex justify-content-between">
                                    <div>
                                        <strong>{u.name}</strong><br/>
                                        <small>{u.email} ({u.role})</small>
                                    </div>
                                    <button className="btn btn-sm btn-outline-danger"
                                            onClick={() => axios.delete(`/people/${u.id}`).then(fetchData)}>Șterge</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* --- DEVICES & MAPPING SECTION --- */}
                <div className="col-md-7">
                    <div className="card">
                        <div className="card-header">
                            <h5>Dispozitive & Mapare</h5>
                        </div>
                        <div className="card-body">
                            {devices.map(d => (
                                <div key={d.id} className="border-bottom pb-2 mb-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>
                                            <strong>{d.name}</strong> <span className="badge bg-info">{d.consumption} kW</span>
                                        </span>

                                        {/* LOGICA DE MAPARE */}
                                        <div className="d-flex gap-2">
                                            <select className="form-select form-select-sm"
                                                    style={{width: '150px'}}
                                                    value={selectedUser[d.id] || ""}
                                                    onChange={e => setSelectedUser({...selectedUser, [d.id]: e.target.value})}>
                                                <option value="">Alocă user...</option>
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                            <button className="btn btn-sm btn-primary"
                                                    onClick={() => handleAssign(d.id)}>Save</button>
                                        </div>
                                    </div>
                                    <small className="text-muted">
                                        Status mapare: {d.userId ? <span className="text-success">Atribuit ({d.userId})</span> : <span className="text-warning">Neatribuit</span>}
                                    </small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}