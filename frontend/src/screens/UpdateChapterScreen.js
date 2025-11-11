import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../config/axiosConfig";
import { Ionicons } from "@expo/vector-icons";

export default function UpdateChapterScreen({ route, navigation }) {
  const { chapter } = route.params || {};
  const [chapterNumber, setChapterNumber] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chapter) {
      setChapterNumber(chapter.chapterNumber?.toString() || "");
      setTitle(chapter.title || "");
      setContent(chapter.content || "");
    }
  }, [chapter]);

  const handleUpdateChapter = async () => {
    if (!chapter?._id) {
      Alert.alert("Lỗi", "Không tìm thấy chương!");
      return;
    }

    if (!chapterNumber || !title) {
      Alert.alert("Lỗi", "Vui lòng điền số chương và tiêu đề!");
      return;
    }

    const chapterNum = parseInt(chapterNumber);
    if (isNaN(chapterNum) || chapterNum <= 0) {
      Alert.alert("Lỗi", "Số chương phải là số nguyên dương!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        storyId: chapter.storyId,
        chapterNumber: chapterNum,
        title,
        content,
      };

      const res = await api.put(`/api/chapters/update/${chapter._id}`, payload);
      if (res.success || res.data?.success) {
        Alert.alert("Thành công", "Đã cập nhật chương!", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật chương:", error);
      Alert.alert("Lỗi", error.message || "Không thể cập nhật chương. Thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sửa chương</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 20 }}>
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
          numberOfLines={15}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdateChapter}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Đang xử lý..." : "Cập nhật chương"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  body: {
    flex: 1,
    padding: 16,
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
    height: 300,
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

