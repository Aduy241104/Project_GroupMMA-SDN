import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../config/axiosConfig";

export default function CreateStoryScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [status, setStatus] = useState("ongoing");
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
      setAuthors(authorRes.data?.data || authorRes.data || []);
      setCategories(categoryRes.data?.data || categoryRes.data || []);
    } catch (error) {
      console.error("Không thể tải dữ liệu:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách tác giả và thể loại");
    }
  };

  const handleCreateStory = async () => {
    if (!title || !slug || !authorId || categoryIds.length === 0) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const payload = { 
        title, 
        slug, 
        description, 
        coverImage, 
        authorId, 
        categoryIds, 
        status,
        type: "novel" // Chỉ cho phép tạo novel
      };
      const res = await api.post("/api/stories/create", payload);

      if (res.success || res.data?.success) {
        Alert.alert("Thành công", "Đã tạo truyện mới!", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("adminDetail", { storyId: res.data?._id || res.data?.data?._id, reload: true });
            },
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", error.message || "Không thể tạo truyện. Thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Thêm truyện mới</Text>

      <Text style={styles.label}>Tiêu đề *</Text>
      <TextInput 
        style={styles.input} 
        value={title} 
        onChangeText={setTitle}
        placeholder="Nhập tiêu đề truyện"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Slug *</Text>
      <TextInput 
        style={styles.input} 
        value={slug} 
        onChangeText={setSlug}
        placeholder="Nhập slug (ví dụ: truyen-tien-hiep)"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Nhập mô tả truyện"
        placeholderTextColor="#666"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Link ảnh bìa</Text>
      <TextInput 
        style={styles.input} 
        value={coverImage} 
        onChangeText={setCoverImage}
        placeholder="Nhập URL ảnh bìa"
        placeholderTextColor="#666"
      />
      {coverImage && <Image source={{ uri: coverImage }} style={styles.previewImage} />}

      <Text style={styles.label}>Tác giả *</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={authorId} onValueChange={setAuthorId} style={styles.picker}>
          <Picker.Item label="-- Chọn tác giả --" value="" />
          {authors.map(a => <Picker.Item key={a._id} label={a.name} value={a._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Thể loại *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryIds[0] || ""}
          onValueChange={value => setCategoryIds(value ? [value] : [])}
          style={styles.picker}
        >
          <Picker.Item label="-- Chọn thể loại --" value="" />
          {categories.map(c => <Picker.Item key={c._id} label={c.name} value={c._id} />)}
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

      <TouchableOpacity style={styles.button} onPress={handleCreateStory} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Đang xử lý..." : "Tạo truyện"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  header: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 20,
    textAlign: "center"
  },
  label: { color: "#fff", marginBottom: 6, fontSize: 14, fontWeight: "500" },
  input: { 
    backgroundColor: "#111", 
    color: "#fff", 
    padding: 12, 
    marginBottom: 12, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333"
  },
  textArea: {
    height: 100,
    textAlignVertical: "top"
  },
  previewImage: { width: "100%", height: 200, borderRadius: 10, marginBottom: 16 },
  pickerContainer: { backgroundColor: "#111", borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "#333" },
  picker: { color: "#fff" },
  button: { 
    backgroundColor: "#2E9AFE", 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 10 
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

