import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import api from "../config/axiosConfig";

export default function UpdateStoryScreen({ route, navigation }) {
  const { story } = route.params || {};

  const [title, setTitle] = useState(story?.title || "");
  const [slug, setSlug] = useState(story?.slug || "");
  const [description, setDescription] = useState(story?.description || "");
  const [coverImage, setCoverImage] = useState(story?.coverImage || "");
  const [authorId, setAuthorId] = useState(story?.authorId?._id || "");
  const [categoryIds, setCategoryIds] = useState(story?.categoryIds?.map(c => c._id) || []);
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // Category được chọn trong Picker
  const [status, setStatus] = useState(story?.status || "ongoing");
  const [loading, setLoading] = useState(false);

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [authorRes, categoryRes] = await Promise.all([
        api.get("/api/authors"),
        api.get("/api/categories"),
      ]);
      // Axios interceptor trả về response.data
      setAuthors(authorRes.data || authorRes.data?.data || []);
      setCategories(categoryRes.data || categoryRes.data?.data || []);
    } catch (error) {
      console.error("Không thể tải dữ liệu:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách tác giả và thể loại");
    }
  };


  // Xóa category khỏi danh sách
  const handleRemoveCategory = (categoryId) => {
    const newCategoryIds = categoryIds.filter(id => id !== categoryId);
    setCategoryIds(newCategoryIds);

    // Cập nhật slug từ category đầu tiên còn lại
    if (newCategoryIds.length > 0) {
      const firstCategory = categories.find(c => c._id === newCategoryIds[0]);
      if (firstCategory) {
        setSlug(firstCategory.slug || "");
      }
    } else {
      setSlug("");
    }
  };

  // Load slug từ category đã chọn khi mở màn hình
  useEffect(() => {
    if (categoryIds.length > 0 && categories.length > 0) {
      const selectedCategory = categories.find(c => c._id === categoryIds[0]);
      if (selectedCategory && selectedCategory.slug) {
        setSlug(selectedCategory.slug);
      }
    }
  }, [categories]);

  const handleUpdateStory = async () => {
    if (!title || !slug || !authorId || categoryIds.length === 0) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const payload = { title, slug, description, coverImage, authorId, categoryIds, status };
      const res = await api.put(`/api/stories/update/${story._id}`, payload);

      // Axios interceptor trả về response.data, nên res = { success: true, message: "...", data: ... }
      if (res.success || res.data?.success) {
        Alert.alert("Thành công", "Đã cập nhật truyện!", [
          {
            text: "OK",
            onPress: () => {
              // Chuyển về adminDetail và trigger reload dữ liệu
              navigation.navigate("adminDetail", { storyId: story._id, reload: true });
            },
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", error.message || "Không thể cập nhật truyện. Thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Thể loại * (Chọn nhiều)</Text>
      
      {/* Picker để chọn thể loại - tự động thêm khi chọn */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategoryId}
          onValueChange={(value) => {
            setSelectedCategoryId(value);
            // Tự động thêm vào danh sách khi chọn
            if (value && !categoryIds.includes(value)) {
              const selectedCategory = categories.find(c => c._id === value);
              if (selectedCategory) {
                const newCategoryIds = [...categoryIds, value];
                setCategoryIds(newCategoryIds);
                
                // Lấy slug từ category đầu tiên được chọn
                if (newCategoryIds.length > 0) {
                  const firstCategory = categories.find(c => c._id === newCategoryIds[0]);
                  if (firstCategory) {
                    setSlug(firstCategory.slug || "");
                  }
                }
                
                // Reset Picker
                setSelectedCategoryId("");
              }
            }
          }}
          style={styles.picker}
        >
          <Picker.Item label="-- Chọn thể loại --" value="" />
          {categories
            .filter(c => !categoryIds.includes(c._id)) // Chỉ hiển thị các thể loại chưa được chọn
            .map(c => (
              <Picker.Item key={c._id} label={c.slug} value={c._id} />
            ))}
        </Picker>
      </View>

      {/* Danh sách thể loại đã chọn */}
      {categoryIds.length > 0 && (
        <View style={styles.selectedCategoriesContainer}>
          <Text style={styles.selectedLabel}>Thể loại đã chọn:</Text>
          <View style={styles.selectedCategoriesList}>
            {categoryIds.map(categoryId => {
              const category = categories.find(c => c._id === categoryId);
              if (!category) return null;
              return (
                <View key={categoryId} style={styles.selectedCategoryTag}>
                  <Text style={styles.selectedCategorySlug}>{category.slug}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveCategory(categoryId)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={18} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {slug && (
        <Text style={styles.slugPreview}>Slug (từ thể loại đầu tiên): {slug}</Text>
      )}

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Link ảnh bìa</Text>
      <TextInput style={styles.input} value={coverImage} onChangeText={setCoverImage} />
      {coverImage && <Image source={{ uri: coverImage }} style={styles.previewImage} />}

      <Text style={styles.label}>Tác giả</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={authorId} onValueChange={setAuthorId} style={styles.picker}>
          <Picker.Item label="-- Chọn tác giả --" value="" />
          {authors.map(a => <Picker.Item key={a._id} label={a.name} value={a._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Trạng thái</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={setStatus}
          style={styles.picker}
        >
          <Picker.Item label="Đang ra" value="ongoing" />
          <Picker.Item label="Hoàn thành" value="completed" />
          <Picker.Item label="Tạm dừng" value="paused" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdateStory} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Đang xử lý..." : "Cập nhật truyện"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  label: { color: "#fff", marginBottom: 4 },
  input: { backgroundColor: "#111", color: "#fff", padding: 10, marginBottom: 12, borderRadius: 8 },
  previewImage: { width: "100%", height: 200, borderRadius: 10, marginBottom: 16 },
  pickerContainer: { backgroundColor: "#111", borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "#333" },
  picker: { color: "#fff" },
  selectedCategoriesContainer: {
    marginBottom: 12,
  },
  selectedLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  selectedCategoriesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedCategoryTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2E9AFE",
    gap: 6,
  },
  selectedCategorySlug: {
    color: "#2E9AFE",
    fontSize: 13,
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: 4,
  },
  slugPreview: {
    color: "#2E9AFE",
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
    fontStyle: "italic",
  },
  button: { backgroundColor: "#2E9AFE", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
