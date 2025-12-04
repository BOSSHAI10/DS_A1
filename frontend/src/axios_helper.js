import axios from 'axios';

// 1. Configurare de bază
axios.defaults.baseURL = 'http://localhost:8084';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 2. Interceptor pentru Token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token && token !== "mock-token") {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Funcția principală de Login (AICI AM FĂCUT SCHIMBUL)
export const loginUser = async (email, password) => {
    try {
        console.log("1. Trimit cerere login...");
        // Pasul 1: Verificăm credențialele (POST /auth/login)
        const authResponse = await axios.post('/auth/login', { email, password });
        console.log("2. Raspuns Login:", authResponse.data);

        // Backend-ul returnează true dacă parola e corectă
        if (authResponse.data === true) {
            console.log("3. Login OK. Cer detalii user pentru:", email);

            // Pasul 2: Luăm detaliile userului (GET /people/by-email/{email})
            // Notă: Am adăugat prefixul '/api' dacă gateway-ul tău îl cere, dar conform logurilor tale anterioare
            // Gateway-ul mapează direct /people/**, deci '/people/by-email/' este corect.
            const userResponse = await axios.get(`/people/by-email/${email}`);

            console.log("4. Raspuns User Details:", userResponse.data);
            const user = userResponse.data;

            if (!user || !user.role) {
                throw new Error("Datele utilizatorului sunt incomplete!");
            }

            // 4. Salvăm datele în browser
            localStorage.setItem("auth_token", "mock-token"); // Token fictiv pentru moment
            localStorage.setItem("user_id", user.id);
            localStorage.setItem("user_role", user.role); // Important: salvăm ca user_role
            localStorage.setItem("user_name", user.name);
            localStorage.setItem("is_logged_in", "true");

            return user;
        } else {
            throw new Error("Credențiale invalide (Serverul a răspuns false)");
        }
    } catch (error) {
        console.error("EROARE LOGIN:", error);
        throw error;
    }
};

// 4. Funcții ajutătoare (Getters & Logout)
export const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
};

export const getRole = () => {
    return localStorage.getItem("user_role"); // Trebuie să corespundă cu ce salvăm mai sus
};

export const getUserId = () => {
    return localStorage.getItem("user_id");
};

export const isLoggedIn = () => {
    return localStorage.getItem("is_logged_in") === "true";
};

// (Opțional) Exportă și setAuthToken dacă îl folosești în altă parte,
// dar loginUser se ocupă deja de salvare.
export const setAuthToken = (token) => {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
};

// Funcție pentru actualizarea utilizatorului (PUT)
export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`/people/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};