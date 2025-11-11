//Add user
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,View
} from "react-native";
import api from "../config/axiosConfig";

const AddUserScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !email || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đủ username, email và password.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/users", {
        username,
        email,
        password,
        role,
        avatarUrl,
        bio
      });
      Alert.alert("Thành công", "Đã tạo người dùng mới.", [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      console.error("Create user error:", error);
      Alert.alert(
        "Lỗi",
        error?.message ||
          "Không thể tạo người dùng. Vui lòng kiểm tra lại dữ liệu hoặc thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Tên người dùng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập username"
        placeholderTextColor="#555"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        placeholderTextColor="#555"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        placeholderTextColor="#555"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Quyền</Text>
      <View style={styles.roleContainer}>
        {["user", "admin"].map((item) => {
          const isSelected = role === item;
          return (
            <TouchableOpacity
              key={item}
              style={[styles.roleOption, isSelected && styles.roleSelected]}
              onPress={() => setRole(item)}
            >
              <Text style={[styles.roleText, isSelected && styles.roleTextSelected]}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>


      <Text style={styles.label}>Bio (tùy chọn)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Giới thiệu ngắn..."
        placeholderTextColor="#555"
        multiline
        value={bio}
        onChangeText={setBio}
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Tạo người dùng</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  content: {
    padding: 16,
    paddingBottom: 32
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f"
  },
  multiline: {
    height: 100,
    textAlignVertical: "top"
  },
  roleContainer: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    padding: 6
  },
  roleOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8
  },
  roleSelected: {
    backgroundColor: "#1a73e8"
  },
  roleText: {
    color: "#888",
    fontWeight: "600"
  },
  roleTextSelected: {
    color: "#fff"
  },
  submitButton: {
    backgroundColor: "#07c3e9ff",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  },
  buttonDisabled: {
    opacity: 0.7
  }
});

export default AddUserScreen;

