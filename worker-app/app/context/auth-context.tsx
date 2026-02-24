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
    loading: boolean
    login: (token: string) => void;
    logout: () => void;
    getUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [worker, setWorker] = useState<Worker | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const getUser = async () => {
        try {
            const token = await AsyncStorage.getItem("workercitytoken");
            const response = await axios({
                url: `${API_BASE_URL}/api/worker/isValid`,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(response.data)
            if (response.data.success) {
                setWorker(response.data.user)
            } else {
                setWorker(null)
            }
        } catch (error) {
            setWorker(null)
        } finally {
            setLoading(false)
        }


    }

    useEffect(() => {
        getUser();
    }, [])

    const login = async (token: string) => {
        await AsyncStorage.setItem("workercitytoken", token);
        getUser();

    };

    const logout = () => {
        AsyncStorage.removeItem("workercitytoken");
    }

    return (
        <AuthContext.Provider value={{ worker, login, logout, getUser, loading }}>
            {children}
        </AuthContext.Provider>
    );

}


export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}