// src/screens/ManageCommentsScreen.js
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
import { Ionicons } from "@expo/vector-icons";
import api from "../config/axiosConfig.js";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManageCommentsScreen = () => {
  const { token, loading: authLoading, user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const getUserDisplayName = (user) => {
    if (!user) return "Người dùng";
    return user.username || user.name || user._id || "Người dùng";
  };

  const fetchComments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/api/admin/comments", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const commentsData = res.data?.data?.comments || res.data?.comments || [];
      setComments(commentsData);
    } catch (err) {
      console.error("Fetch comments error:", err);
      Alert.alert("Lỗi", "Không thể lấy danh sách comment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && token) {
      fetchComments();
    }
  }, [token, authLoading]);

  const handleDelete = async (commentId) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa comment này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await api.delete(`/api/admin/comments/${commentId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setComments((prev) => prev.filter((c) => c._id !== commentId));
            Alert.alert("Thành công", "Đã xóa comment.");
          } catch (err) {
            console.error("Error deleting comment:", err);
            Alert.alert("Lỗi", "Không thể xóa comment.");
          }
        },
      },
    ]);
  };

  const openEditModal = (comment) => {
    setEditingComment(comment);
    setEditText(comment.content);
    setModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editingComment) return;
    try {
      await api.put(
        `/api/admin/comments/${editingComment._id}`,
        { content: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) =>
        prev.map((c) =>
          c._id === editingComment._id ? { ...c, content: editText } : c
        )
      );
      setModalVisible(false);
      setEditingComment(null);
      setEditText("");
      Alert.alert("Thành công", "Đã cập nhật comment.");
    } catch (err) {
      console.error("Error updating comment:", err);
      Alert.alert("Lỗi", "Không thể chỉnh sửa comment.");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          Bạn không có quyền truy cập trang này.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#07c3e9ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.text}>
              User: {getUserDisplayName(item.userId)}
            </Text>
            <Text style={styles.text}>Content: {item.content}</Text>
            <Text style={styles.text}>Created At: {item.createdAt}</Text>
            <Text style={styles.text}>Updated At: {item.updatedAt}</Text>

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
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.text}>Không có comment nào.</Text>
          </View>
        }
      />

      {/* Modal chỉnh sửa */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { color: "#07c3e9ff" }]}>
              Chỉnh sửa comment
            </Text>
            <TextInput
              style={styles.input}
              value={editText}
              onChangeText={setEditText}
              multiline
              placeholder="Nhập nội dung mới"
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

export default ManageCommentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000" },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  permissionText: { color: "#fff", fontSize: 16, textAlign: "center" },
  text: { color: "#fff", marginBottom: 2 },
  commentItem: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
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
  editButton: {
    backgroundColor: "#34495e",
  },
  deleteButton: {
    backgroundColor: "#c0392b",
  },
  cancelButton: {
    backgroundColor: "#333",
  },
  saveButton: {
    backgroundColor: "#27ae60",
  },
  actionText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
    fontSize: 13,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
  },
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
