// screens/ManageAuthorsScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../config/axiosConfig.js";
import { AuthContext } from "../context/AuthContext";

const ManageAuthorsScreen = () => {
  const { token, loading: authLoading, user } = useContext(AuthContext);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");

  const fetchAuthors = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/api/admin/author", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      setAuthors(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error fetching authors:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        Alert.alert("Phiên hết hạn", "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
      } else {
        Alert.alert("Lỗi", "Không thể lấy danh sách tác giả.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && token) fetchAuthors();
  }, [token, authLoading]);

  const openEditModal = (author) => {
    setEditingAuthor(author);
    setEditName(author.name);
    setEditBio(author.bio || "");
    setEditAvatarUrl(author.avatarUrl || "");
    setModalVisible(true);
  };

  const handleDelete = (authorId) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa tác giả này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/admin/author/${authorId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setAuthors((prev) => prev.filter((a) => a._id !== authorId));
          } catch (err) {
            console.error("Error deleting author:", err.response?.data || err.message);
            Alert.alert("Lỗi", "Không thể xóa tác giả.");
          }
        },
      },
    ]);
  };

  const saveEdit = async () => {
    if (!editingAuthor) return;
    try {
      await api.put(
        `/api/admin/author/${editingAuthor._id}`,
        { name: editName, bio: editBio, avatarUrl: editAvatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAuthors((prev) =>
        prev.map((a) =>
          a._id === editingAuthor._id
            ? { ...a, name: editName, bio: editBio, avatarUrl: editAvatarUrl }
            : a
        )
      );

      setModalVisible(false);
      setEditingAuthor(null);
      setEditName("");
      setEditBio("");
      setEditAvatarUrl("");
    } catch (err) {
      console.error("Error updating author:", err.response?.data || err.message);
      Alert.alert("Lỗi", "Không thể chỉnh sửa tác giả.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00bfff" />
      </View>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Bạn không có quyền truy cập trang này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={authors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{
                uri: item.avatarUrl || "https://via.placeholder.com/80",
              }}
              style={styles.avatar}
              resizeMode="cover"
            />

            <View style={styles.textContainer}>
              <Text style={styles.text}>ID: {item._id}</Text>
              <Text style={styles.text}>Tên: {item.name}</Text>
              <Text style={styles.text}>Bio: {item.bio || "Chưa có"}</Text>
              <Text style={styles.text}>Tạo lúc: {item.createdAt}</Text>
              <Text style={styles.text}>Cập nhật: {item.updatedAt}</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => openEditModal(item)}
                >
                  <Ionicons name="create-outline" size={16} color="#fff" />
                  <Text style={styles.actionText}>Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item._id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                  <Text style={styles.actionText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.text}>Không có tác giả nào.</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { color: "#00bfff" }]}>Chỉnh sửa tác giả</Text>

            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Tên tác giả"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Bio"
              placeholderTextColor="#888"
              multiline
            />
            <TextInput
              style={styles.input}
              value={editAvatarUrl}
              onChangeText={setEditAvatarUrl}
              placeholder="Avatar URL"
              placeholderTextColor="#888"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-outline" size={16} color="#fff" />
                <Text style={styles.actionText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={saveEdit}
              >
                <Ionicons name="checkmark-outline" size={16} color="#fff" />
                <Text style={styles.actionText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageAuthorsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000" },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  textContainer: { flex: 1, marginLeft: 12 },
  text: { color: "#fff", marginBottom: 2 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  editButton: { backgroundColor: "#34495e" },
  deleteButton: { backgroundColor: "#c0392b" },
  cancelButton: { backgroundColor: "#333" },
  saveButton: { backgroundColor: "#27ae60" },
  actionText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
    fontSize: 13,
  },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  permissionText: { color: "#fff", fontSize: 16, textAlign: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: { backgroundColor: "#111", borderRadius: 12, padding: 16 },
  modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#07c3e9ff",
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 12,
    color: "#fff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
