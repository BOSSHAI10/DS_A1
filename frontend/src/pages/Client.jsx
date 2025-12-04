// src/pages/Client.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { logout } from '../axios_helper';

export default function Client() {
    const [myDevices, setMyDevices] = useState([]);
    const userId = localStorage.getItem("user_id"); // ID-ul salvat la login

    useEffect(() => {
        if (userId) {
            // Apelăm endpoint-ul creat de tine: /devices/user/{id}
            axios.get(`/devices/user/${userId}`)
                .then(res => setMyDevices(res.data))
                .catch(e => console.error(e));
        }
    }, [userId]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between">
                <h2>Dispozitivele Mele</h2>
                <button className="btn btn-secondary" onClick={logout}>Logout</button>
            </div>
            <hr/>
            <div className="row mt-3">
                {myDevices.length === 0 && <p>Nu ai niciun dispozitiv atribuit.</p>}

                {myDevices.map(d => (
                    <div key={d.id} className="col-md-4 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <h5 className="card-title">{d.name}</h5>
                                <h2 className="text-primary">{d.consumption} kWh</h2>
                                <p className={`badge ${d.active ? 'bg-success' : 'bg-danger'}`}>
                                    {d.active ? 'ACTIV' : 'INACTIV'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}