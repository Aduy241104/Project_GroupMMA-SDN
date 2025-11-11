import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import api from "../config/axiosConfig"; // instance axios đã cấu hình

const CatelogyScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const isFocused = useIsFocused();

  // 🔹 Load category khi mở màn hình
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories"); // endpoint lấy danh sách category
      // Backend trả về { success: true, data: categories }
      // Axios interceptor trả về response.data, nên res = { success: true, data: categories }
      setCategories(res.data || res);
    } catch (err) {
      console.log("Fetch categories error:", err);
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách thể loại");
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchCategories();
    }
  }, [isFocused]);

  // 🔹 Thêm category
  const handleAddCategory = async () => {
    try {
      if (!newCategory.name || !newCategory.slug) {
        Alert.alert("Lỗi", "Tên và slug không được bỏ trống!");
        return;
      }
      const res = await api.post("/api/categories", newCategory);
      // Backend trả về { success: true, message: "...", data: newCategory }
      // Axios interceptor trả về response.data, nên res = { success: true, message: "...", data: newCategory }
      const addedCategory = res.data || res;
      setCategories([...categories, addedCategory]);
      setNewCategory({ name: "", slug: "", description: "" });
      Alert.alert("Thành công", "Đã thêm thể loại mới!");
    } catch (err) {
      console.log("Add category error:", err);
      Alert.alert("Lỗi", err.message || "Không thể thêm thể loại");
    }
  };

  // 🔹 Sửa category
  const handleEditCategory = (category) => {
    setEditingId(category._id);
    setNewCategory({ 
      name: category.name, 
      slug: category.slug,
      description: category.description || ""
    });
  };

  const handleUpdateCategory = async () => {
    try {
      if (!newCategory.name || !newCategory.slug) {
        Alert.alert("Lỗi", "Tên và slug không được bỏ trống!");
        return;
      }
      const res = await api.put(`/api/categories/${editingId}`, newCategory);
      // Backend trả về { success: true, message: "...", data: category }
      const updatedCategory = res.data || res;
      setCategories(categories.map(cat => cat._id === editingId ? updatedCategory : cat));
      setEditingId(null);
      setNewCategory({ name: "", slug: "", description: "" });
      Alert.alert("Thành công", "Đã cập nhật thể loại!");
    } catch (err) {
      console.log("Update category error:", err);
      Alert.alert("Lỗi", err.message || "Không thể cập nhật thể loại");
    }
  };

  // 🔹 Xóa category
  const handleDeleteCategory = (id) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa thể loại này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/api/categories/${id}`);
              setCategories(categories.filter(cat => cat._id !== id));
              Alert.alert("Thành công", "Đã xóa thể loại!");
            } catch (err) {
              console.log("Delete category error:", err);
              Alert.alert("Lỗi", err.message || "Không thể xóa thể loại");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Admin - Quản lý Thể loại</Text>
        {editingId && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditingId(null);
              setNewCategory({ name: "", slug: "", description: "" });
            }}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Tên thể loại *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên thể loại"
          placeholderTextColor="#666"
          value={newCategory.name}
          onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
        />
        <Text style={styles.label}>Slug *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập slug (ví dụ: tien-hiep)"
          placeholderTextColor="#666"
          value={newCategory.slug}
          onChangeText={(text) => setNewCategory({ ...newCategory, slug: text })}
        />
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập mô tả (tùy chọn)"
          placeholderTextColor="#666"
          value={newCategory.description}
          onChangeText={(text) => setNewCategory({ ...newCategory, description: text })}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={editingId ? handleUpdateCategory : handleAddCategory}
        >
          <Text style={styles.buttonText}>{editingId ? "Cập nhật" : "Thêm mới"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Danh sách thể loại ({categories.length})</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              {item.slug && <Text style={styles.itemSlug}>{item.slug}</Text>}
              <Text style={styles.itemText}>{item.name}</Text>
              {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEditCategory(item)} style={styles.actionButton}>
                <Text style={styles.editButtonText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCategory(item._id)} style={styles.actionButton}>
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có thể loại nào</Text>
          </View>
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#000" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#333",
  },
  cancelButtonText: { color: "#fff", fontSize: 14 },
  form: { marginBottom: 20 },
  label: { color: "#fff", marginBottom: 6, fontSize: 14, fontWeight: "500" },
  input: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2E9AFE",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#111",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemSlug: { color: "#2E9AFE", fontSize: 16, fontWeight: "600", marginBottom: 4 },
  itemText: { color: "#888", fontSize: 12, marginBottom: 4 },
  itemDescription: { color: "#aaa", fontSize: 13 },
  itemActions: { flexDirection: "row", gap: 10 },
  actionButton: { paddingHorizontal: 8 },
  editButtonText: { color: "#2E9AFE", fontSize: 14, fontWeight: "500" },
  deleteButtonText: { color: "#ff4444", fontSize: 14, fontWeight: "500" },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: { color: "#666", fontSize: 14 },
});

export default CatelogyScreen;
