import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from 'react-hot-toast'


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, [token])

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            // toast.success("Login Successful");
            return true;
        } catch (e) {
            toast.error(e.response?.data?.message || "Login Failed");
            return false;

        }
    }

    const signup = async (name, email, password) => {
        try {
            const { data } = await api.post("/auth/register", { name, email, password });
            console.log("Created successfully");
            return true;
        } catch (e) {
            toast.error(e.response?.data?.message || e.message || "Signup failed");
            return false;
        }
    };


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        console.log("Logged out");
        toast.success("Logged Out Successfully");
    }

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}