import API_BASE_URL from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react"

export type User = {
    id: number;
    name: string;
    phonenumber: string;
};

type AuthContextType = {
    user: User | null
    login: (token: string) => void;
    logout: () => void;
    getUser: () => void;
    isVerifying: boolean
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isVerifying, setIsVerifying] = useState(true);
    const getUser = async () => {
        setIsVerifying(true)
        try {
            const token = await AsyncStorage.getItem("citytoken");
            const response = await axios({
                url: `${API_BASE_URL}/api/user/isValid`,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            setUser(response.data.user)
        } catch {
            setUser(null)
        } finally {
            setIsVerifying(false)
        }


    }

    useEffect(() => {
        getUser();
    }, [])

    const login = async (token: string) => {
        await AsyncStorage.setItem("citytoken", token);
        getUser();

    };

    const logout = () => {
        AsyncStorage.removeItem("citytoken");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, getUser, isVerifying }}>
            {children}
        </AuthContext.Provider>
    );

}


export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}