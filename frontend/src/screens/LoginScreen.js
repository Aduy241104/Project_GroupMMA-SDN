import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import axios from "../config/axiosConfig"; // đường dẫn tới file config axios của bạn
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post("/auth/login", { email, password });

            if (res.success) {
                const userData = {
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    role: res.data.role,
                    avatarUrl: res.data.avatarUrl,
                    bio: res.data.bio,
                };
                const token = res.data.token;
                
                await login(userData, token);
                Alert.alert("Thành công", "Đăng nhập thành công!");
                navigation.replace("MainTab");
            } else {
                Alert.alert("Đăng nhập thất bại", res.message || "Sai tài khoản hoặc mật khẩu.");
            }
        } catch (error) {
            console.log("ERROR: ", error);

            // Nếu server có trả về message
            if (error && error.message) {
                Alert.alert("Lỗi đăng nhập", error.message || "Có lỗi xảy ra khi đăng nhập.");
            } else {
                // Chỉ hiển thị "mất kết nối mạng" khi thật sự không có phản hồi
                Alert.alert("Lỗi mạng", "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.");
            }
            console.log("Login error:", error.response ? error.response.data : error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>Đăng nhập</Text>

            <TextInput
                style={ styles.input }
                placeholder="Tên đăng nhập"
                placeholderTextColor="#888"
                value={ email }
                onChangeText={ setEmail }
            />
            <TextInput
                style={ styles.input }
                placeholder="Mật khẩu"
                placeholderTextColor="#888"
                secureTextEntry
                value={ password }
                onChangeText={ setPassword }
            />

            <TouchableOpacity style={ styles.button } onPress={ handleLogin } disabled={ loading }>
                { loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={ styles.buttonText }>Đăng nhập</Text>
                ) }
            </TouchableOpacity>

            <TouchableOpacity onPress={ () => navigation.navigate("register") }>
                <Text style={ styles.registerText }>Chưa có tài khoản? Đăng ký ngay</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        padding: 25,
    },
    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: "#333",
        backgroundColor: "#111",
        color: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#1a73e8",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    registerText: {
        color: "#4da6ff",
        textAlign: "center",
        marginTop: 20,
    },
});

export default LoginScreen;
