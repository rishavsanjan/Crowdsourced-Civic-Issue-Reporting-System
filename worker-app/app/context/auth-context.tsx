import API_BASE_URL from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react"

export type Worker = {
    id: number;
    name: string;
    phonenumber: string;
};

type AuthContextType = {
    worker: Worker | null
    login: (token: string) => void;
    logout: () => void;
    getUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [worker, setUser] = useState<Worker | null>(null);

    const getUser = async () => {
        const token = await AsyncStorage.getItem("citytoken");
        const response = await axios({
            url: `${API_BASE_URL}/api/worker/isValid`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        if (response.data.success) {
            setUser(response.data.worker)
        } else {
            setUser(null)
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    const login = async(token: string) => {
       await AsyncStorage.setItem("citytoken", token);
        getUser();

    };

    const logout = () => {
        AsyncStorage.removeItem("citytoken");
    }

    return (
        <AuthContext.Provider value={{ worker, login, logout, getUser }}>
            {children}
        </AuthContext.Provider>
    );

}


export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}