//Edit user
import React, { useEffect, useState } from "react";
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

const EditUserScreen = ({ navigation, route }) => {
  const { userId } = route.params || {};
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!userId) {
        Alert.alert("Lỗi", "Không tìm thấy người dùng.");
        navigation.goBack();
        return;
      }

      try {
        setLoading(true);
        const data = await api.get(`/api/auth/users/${userId}`);
        setUsername(data.username || "");
        setEmail(data.email || "");
        setRole(data.role || "user");
        setAvatarUrl(data.avatarUrl || "");
        setBio(data.bio || "");
        setIsActive(data.isActive);
      } catch (error) {
        console.error("Fetch user detail error:", error);
        Alert.alert("Lỗi", error?.message || "Không thể tải thông tin người dùng.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [navigation, userId]);

  const handleSave = async () => {
    if (!username || !email) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ username và email.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        username,
        email,
        role,
        avatarUrl,
        bio
      };

      if (password) {
        payload.password = password;
      }

      await api.put(`/api/auth/users/${userId}`, payload);
      Alert.alert("Thành công", "Đã cập nhật thông tin người dùng.", [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      console.error("Update user error:", error);
      Alert.alert(
        "Lỗi",
        error?.message ||
          "Không thể cập nhật người dùng. Vui lòng kiểm tra lại dữ liệu hoặc thử lại sau."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#07c3e9ff" size="large" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.status}>
        <Text style={styles.statusLabel}>Trạng thái:</Text>
        <View
          style={[styles.statusBadge, isActive ? styles.badgeActive : styles.badgeBlocked]}
        >
          <Text style={styles.statusText}>{isActive ? "Active" : "Blocked"}</Text>
        </View>
      </View>

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

      <Text style={styles.label}>Mật khẩu mới (nếu muốn đổi)</Text>
      <TextInput
        style={styles.input}
        placeholder="Để trống nếu giữ nguyên"
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
        style={[styles.submitButton, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Lưu thay đổi</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  },
  loadingText: {
    marginTop: 12,
    color: "#fff"
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  statusLabel: {
    color: "#bbb",
    marginRight: 8
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  badgeActive: {
    backgroundColor: "rgba(39, 174, 96, 0.2)",
    borderWidth: 1,
    borderColor: "#27ae60"
  },
  badgeBlocked: {
    backgroundColor: "rgba(231, 76, 60, 0.2)",
    borderWidth: 1,
    borderColor: "#e74c3c"
  },
  statusText: {
    color: "#fff",
    fontWeight: "600"
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

export default EditUserScreen;

