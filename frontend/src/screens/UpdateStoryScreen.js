import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../config/axiosConfig";

export default function UpdateStoryScreen({ route, navigation }) {
  const { story } = route.params || {};

  const [title, setTitle] = useState(story?.title || "");
  const [slug, setSlug] = useState(story?.slug || "");
  const [description, setDescription] = useState(story?.description || "");
  const [coverImage, setCoverImage] = useState(story?.coverImage || "");
  const [authorId, setAuthorId] = useState(story?.authorId?._id || "");
  const [categoryIds, setCategoryIds] = useState(story?.categoryIds?.map(c => c._id) || []);
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
      setAuthors(authorRes.data.data || authorRes.data);
      setCategories(categoryRes.data.data || categoryRes.data);
    } catch (error) {
      console.error("Không thể tải dữ liệu:", error);
    }
  };

  const handleUpdateStory = async () => {
    if (!title || !authorId || categoryIds.length === 0) {
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

      <Text style={styles.label}>Slug</Text>
      <TextInput style={styles.input} value={slug} onChangeText={setSlug} />

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

      <Text style={styles.label}>Thể loại</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryIds[0]}
          onValueChange={value => setCategoryIds([value])}
          style={styles.picker}
        >
          <Picker.Item label="-- Chọn thể loại --" value="" />
          {categories.map(c => <Picker.Item key={c._id} label={c.name} value={c._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Trạng thái</Text>
      <TextInput style={styles.input} value={status} onChangeText={setStatus} />

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
  pickerContainer: { backgroundColor: "#111", borderRadius: 8, marginBottom: 12 },
  picker: { color: "#fff" },
  button: { backgroundColor: "#2E9AFE", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
