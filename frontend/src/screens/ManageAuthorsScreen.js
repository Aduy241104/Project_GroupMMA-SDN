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
import api from "../config/axiosConfig.js";
import { AuthContext } from "../context/AuthContext";
import { Image } from "react-native";

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
      console.error(
        "Error fetching authors:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401 || err.response?.status === 403) {
        Alert.alert(
          "Phiên hết hạn",
          "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn."
        );
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
            console.error(
              "Error deleting author:",
              err.response?.data || err.message
            );
            Alert.alert("Lỗi", "Không thể xóa tác giả.");
          }
        },
      },
    ]);
  };

  // Lưu chỉnh sửa
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
      console.error(
        "Error updating author:",
        err.response?.data || err.message
      );
      Alert.alert("Lỗi", "Không thể chỉnh sửa tác giả.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  if (!user || user.role !== "admin") {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          Bạn không có quyền truy cập trang này.
        </Text>
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
              <Text style={styles.text}>Name: {item.name}</Text>
              <Text style={styles.text}>Bio: {item.bio || "Chưa có"}</Text>
              <Text style={styles.text}>Created At: {item.createdAt}</Text>
              <Text style={styles.text}>Updated At: {item.updatedAt}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => openEditModal(item)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#ff4040" }]}
                  onPress={() => handleDelete(item._id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        s
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
            <Text style={[styles.modalTitle, { color: "#00bfff" }]}>
              Chỉnh sửa tác giả
            </Text>
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
                style={[styles.actionBtn, { flex: 1 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.actionText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { flex: 1, backgroundColor: "#00bfff" },
                ]}
                onPress={saveEdit}
              >
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
    flexDirection: "row", // xếp theo hàng
    alignItems: "center", // căn giữa theo chiều dọc
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#222",
    backgroundColor: "#111",
    borderRadius: 6,
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  textContainer: {
    flex: 1, // chiếm phần còn lại
    marginLeft: 12, // cách ảnh
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 8,
  },

  centered: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  permissionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  text: { color: "#fff", marginBottom: 2 },
  actionRow: { flexDirection: "row", marginTop: 8 },
  actionBtn: {
    backgroundColor: "#00bfff",
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#00bfff",
    borderRadius: 6,
    padding: 10,
    minHeight: 40,
    textAlignVertical: "top",
    marginBottom: 12,
    color: "#fff",
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
});
