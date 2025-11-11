import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import api from "../config/axiosConfig";
import { Ionicons } from "@expo/vector-icons";

export default function ChapterManagementScreen({ route, navigation }) {
  const { storyId, storyTitle } = route.params || {};
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const isFocused = useIsFocused();

  const [chapterNumber, setChapterNumber] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isFocused && storyId) {
      fetchChapters();
    }
  }, [isFocused, storyId]);

  const fetchChapters = async () => {
    if (!storyId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/chapters/${storyId}`);
      if (res.data?.success && res.data.data?.chapters) {
        const sortedChapters = res.data.data.chapters.sort(
          (a, b) => a.chapterNumber - b.chapterNumber
        );
        setChapters(sortedChapters);
      } else {
        setChapters([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách chương:", err);
      Alert.alert("Lỗi", "Không thể tải danh sách chương");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingChapter(null);
    setChapterNumber("");
    setTitle("");
    setContent("");
    setModalVisible(true);
  };

  const openEditModal = (chapter) => {
    setEditingChapter(chapter);
    setChapterNumber(chapter.chapterNumber.toString());
    setTitle(chapter.title || "");
    setContent(chapter.content || "");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingChapter(null);
    setChapterNumber("");
    setTitle("");
    setContent("");
  };

  const handleSaveChapter = async () => {
    if (!chapterNumber || !title) {
      Alert.alert("Lỗi", "Vui lòng điền số chương và tiêu đề!");
      return;
    }

    const chapterNum = parseInt(chapterNumber);
    if (isNaN(chapterNum) || chapterNum <= 0) {
      Alert.alert("Lỗi", "Số chương phải là số nguyên dương!");
      return;
    }

    try {
      const payload = {
        storyId,
        chapterNumber: chapterNum,
        title,
        content,
      };

      if (editingChapter) {
        // Update
        const res = await api.put(`/api/chapters/update/${editingChapter._id}`, payload);
        if (res.success || res.data?.success) {
          Alert.alert("Thành công", "Đã cập nhật chương!");
          closeModal();
          fetchChapters();
        }
      } else {
        // Create
        const res = await api.post("/api/chapters/create", payload);
        if (res.success || res.data?.success) {
          Alert.alert("Thành công", "Đã thêm chương mới!");
          closeModal();
          fetchChapters();
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu chương:", error);
      Alert.alert("Lỗi", error.message || "Không thể lưu chương. Thử lại.");
    }
  };

  const handleDeleteChapter = (chapter) => {
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc muốn xóa chương ${chapter.chapterNumber}: ${chapter.title}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/api/chapters/delete/${chapter._id}`);
              Alert.alert("Thành công", "Đã xóa chương!");
              fetchChapters();
            } catch (error) {
              console.error("Lỗi khi xóa chương:", error);
              Alert.alert("Lỗi", error.message || "Không thể xóa chương. Thử lại.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {storyTitle ? `Quản lý chương: ${storyTitle}` : "Quản lý chương"}
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Thêm chương mới</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.chapterItem}>
              <View style={styles.chapterInfo}>
                <Text style={styles.chapterNumber}>Chương {item.chapterNumber}</Text>
                <Text style={styles.chapterTitle}>{item.title || "Không có tiêu đề"}</Text>
              </View>
              <View style={styles.chapterActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(item)}
                >
                  <Ionicons name="create-outline" size={20} color="#2E9AFE" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteChapter(item)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có chương nào</Text>
            </View>
          }
        />
      )}

      {/* Modal thêm/sửa chương */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingChapter ? "Sửa chương" : "Thêm chương mới"}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Số chương *</Text>
              <TextInput
                style={styles.input}
                value={chapterNumber}
                onChangeText={setChapterNumber}
                placeholder="Nhập số chương"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Tiêu đề *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề chương"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Nội dung</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={content}
                onChangeText={setContent}
                placeholder="Nhập nội dung chương"
                placeholderTextColor="#666"
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChapter}>
                <Text style={styles.saveButtonText}>
                  {editingChapter ? "Cập nhật" : "Thêm mới"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28a745",
    padding: 14,
    margin: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  chapterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#222",
  },
  chapterInfo: {
    flex: 1,
    marginRight: 12,
  },
  chapterNumber: {
    color: "#2E9AFE",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  chapterTitle: {
    color: "#fff",
    fontSize: 16,
  },
  chapterActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalBody: {
    padding: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#2E9AFE",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

