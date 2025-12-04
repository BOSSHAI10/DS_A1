import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8084';
axios.defaults.headers.post['Content-Type'] = 'application/json';

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

export const loginUser = async (email, password) => {
    try {
        const authResponse = await axios.post('/auth/login', { email, password });

        if (authResponse.data === true) {
            // Cerem detaliile utilizatorului
            const userResponse = await axios.get(`/people/by-email/${email}`);
            const user = userResponse.data;

            if (!user || !user.role) {
                throw new Error("Datele utilizatorului sunt incomplete!");
            }

            localStorage.setItem("auth_token", "mock-token");
            localStorage.setItem("user_id", user.id);
            localStorage.setItem("user_role", user.role);
            localStorage.setItem("user_name", user.name);
            localStorage.setItem("is_logged_in", "true");

            return user;
        } else {
            throw new Error("Credențiale invalide");
        }
    } catch (error) {
        throw error;
    }
};

// Funcție pentru update user (folosită în Admin)
export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`/people/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
};

export const getRole = () => localStorage.getItem("user_role");
export const getUserId = () => localStorage.getItem("user_id");
export const isLoggedIn = () => localStorage.getItem("is_logged_in") === "true";