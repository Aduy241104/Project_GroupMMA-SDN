// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load dữ liệu từ AsyncStorage khi app khởi động
    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                const storedToken = await AsyncStorage.getItem("token");

                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                }
            } catch (error) {
                console.log("Error loading auth data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAuthData();
    }, []);

    // Hàm đăng nhập
    const login = async (userData, tokenValue) => {
        setUser(userData);
        setToken(tokenValue);

        console.log("❤️‍🔥USER DATA: ", userData);
        console.log("👌TOKEN: ", tokenValue);


        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("token", tokenValue);
    };

    // Hàm đăng xuất
    const logout = async () => {
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={ { user, token, login, logout, loading } }>
            { children }
        </AuthContext.Provider>
    );
};
