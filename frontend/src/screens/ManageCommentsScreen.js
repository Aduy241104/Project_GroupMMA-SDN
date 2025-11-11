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
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManageCommentsScreen = () => {
  const { token, loading: authLoading } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  // Hiển thị tên user hoặc fallback là _id
  const getUserDisplayName = (user) => {
    if (!user) return "Người dùng";
    return user.username || user.name || user._id || "Người dùng";
  };

  // ✅ Sửa: gọi API admin mới
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

      console.log("🔥 API response:", JSON.stringify(res.data, null, 2));

      // response chuẩn có thể là res.data.data.comments (tùy backend)
      const commentsData =
        res.data?.data?.comments || res.data?.comments || [];
      setComments(commentsData);
      console.log("💬 Comments state:", commentsData);
    } catch (err) {
      console.error(
        "Error fetching comments:",
        err.response?.data || err.message
      );
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

  // ✅ Sửa endpoint delete
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
          } catch (err) {
            console.error(
              "Error deleting comment:",
              err.response?.data || err.message
            );
            Alert.alert("Lỗi", "Không thể xóa comment.");
          }
        },
      },
    ]);
  };

  // ✅ Sửa endpoint update
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
    } catch (err) {
      console.error(
        "Error updating comment:",
        err.response?.data || err.message
      );
      Alert.alert("Lỗi", "Không thể chỉnh sửa comment.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
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
            <Text style={styles.text}>ID Comment: {item._id}</Text>
            <Text style={styles.text}>Story ID: {item.storyId}</Text>
            <Text style={styles.text}>
              User: {getUserDisplayName(item.userId)}
            </Text>
            <Text style={styles.text}>Content: {item.content}</Text>
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
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.text}>Không có comment nào.</Text>
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
                style={[styles.actionBtn, { flex: 1 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.actionText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { flex: 1, backgroundColor: "#00bfff" }]}
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

export default ManageCommentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000" },
  commentItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#222",
    backgroundColor: "#111",
    borderRadius: 6,
    marginBottom: 8,
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
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#00bfff",
    borderRadius: 6,
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