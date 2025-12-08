import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../axios_helper';

export default function Client() {
    const navigate = useNavigate();
    const [myDevices, setMyDevices] = useState([]);
    const [userName, setUserName] = useState(''); // Stare pentru nume

    const userEmail = localStorage.getItem("user_email");

    useEffect(() => {
        if (userEmail) {
            // 1. Cerem dispozitivele
            axios.get(`/devices/user/${userEmail}`)
                .then(res => setMyDevices(res.data))
                .catch(e => console.error("Eroare la preluare dispozitive:", e));

            // 2. Cerem detaliile utilizatorului pentru a afla NUMELE
            // (Presupunând că endpoint-ul /people/by-email există în users-service)
            axios.get(`/people/by-email/${userEmail}`)
                .then(res => {
                    if (res.data && res.data.name) {
                        setUserName(res.data.name);
                    }
                })
                .catch(e => console.log("Nu s-a putut prelua numele utilizatorului."));
        }
    }, [userEmail]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dispozitivele Mele</h2>
                <div>
                    {/* AICI AFIȘĂM NUMELE */}
                    <span className="me-3 fw-bold text-secondary">
                        Ești logat ca: {userName || userEmail}
                    </span>
                    <button className="btn btn-danger px-4" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="row mt-3">
                {myDevices.length === 0 && (
                    <div className="col-12 text-center text-muted mt-5">
                        <h4>Nu ai niciun dispozitiv atribuit.</h4>
                        <p>Contactează administratorul pentru alocare.</p>
                    </div>
                )}

                {myDevices.map(d => (
                    <div key={d.id} className="col-md-4 mb-4">
                        <div
                            className="card h-100"
                            style={{
                                border: "2px solid black",
                                boxShadow: "5px 5px 5px black"
                            }}
                        >
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <h5 className="card-title fw-bold text-dark">{d.name}</h5>
                                <h2 className="text-primary my-3">{d.consumption} kW</h2>
                                <div>
                                    <span className={`badge px-3 py-2 ${d.active ? 'bg-success' : 'bg-danger'}`}>
                                        {d.active ? 'ACTIV' : 'INACTIV'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}