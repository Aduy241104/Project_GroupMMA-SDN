import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  FlatList,
} from "react-native";
import api from "../config/axiosConfig";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function AdminStoryDetailScreen({ route, navigation }) {
  const { data, storyId, reload } = route.params || {};
  const [story, setStory] = useState(data || null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocus = useIsFocused();

  const fetchFullStory = async () => {
    const id = storyId || data?._id;
    if (!id) return;
    setLoading(true);
    try {
      const storyRes = await api.get(`/api/stories/${id}`);
      // Axios interceptor trả về response.data, nên storyRes = { success: true, data: story }
      if (storyRes.success) {
        setStory(storyRes.data);
      }

      const resChapters = await api.get(`/api/chapters/${id}`);
      // Axios interceptor trả về response.data, nên resChapters = { success: true, data: { chapters: [...] } }
      if (resChapters.success && resChapters.data?.chapters) {
        const sortedChapters = resChapters.data.chapters.sort(
          (a, b) => a.chapterNumber - b.chapterNumber
        );
        setChapters(sortedChapters);
      } else {
        setChapters([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu truyện:", err);
      Alert.alert("Lỗi", "Không thể tải dữ liệu truyện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocus || reload) {
      fetchFullStory();
    }
  }, [isFocus, reload]);

  const handleEditStory = () => {
    if (!story) return;
    navigation.navigate("UpdateStory", { story });
  };

  const handleDeleteStory = async () => {
    if (!story?._id) return;
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa truyện này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/stories/delete/${story._id}`);
            Alert.alert("Thành công", "Đã xóa truyện.");
            navigation.goBack();
          } catch (error) {
            console.error("Lỗi khi xóa truyện:", error);
            Alert.alert("Lỗi", error.message || "Không thể xóa truyện, thử lại sau.");
          }
        },
      },
    ]);
  };

  // Chapter CRUD functions
  const handleAddChapter = () => {
    const currentStoryId = story?._id || storyId;
    if (!currentStoryId) {
      Alert.alert("Lỗi", "Không tìm thấy ID truyện!");
      return;
    }
    navigation.navigate("CreateChapter", { storyId: currentStoryId });
  };

  const handleEditChapter = (chapter) => {
    navigation.navigate("UpdateChapter", { chapter });
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
              fetchFullStory(); // Reload chapters
            } catch (error) {
              console.error("Lỗi khi xóa chương:", error);
              Alert.alert("Lỗi", error.message || "Không thể xóa chương. Thử lại.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>{story?.title || "Không có dữ liệu"}</Text>
        <Text style={styles.author}>Tác giả: {story?.authorId?.name || "Unknown"}</Text>

        <Image source={{ uri: story?.coverImage || "https://via.placeholder.com/150" }} style={styles.coverImage} />

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Thể loại:</Text>
          {story?.categoryIds?.map(cat => <Text key={cat._id} style={styles.tag}>{cat.name}</Text>)}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Trạng thái:</Text>
          <Text style={styles.normalText}>{story?.status === "completed" ? "Hoàn thành" : "Đang ra"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Lượt xem:</Text>
          <Text style={styles.normalText}>{story?.views || 0}</Text>
          <Text style={[styles.infoText, { marginLeft: 10 }]}>Lượt thích:</Text>
          <Text style={styles.normalText}>{story?.totalLikes || 0}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButtonEdit} onPress={handleEditStory}>
            <Ionicons name="create-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Sửa truyện</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonDelete} onPress={handleDeleteStory}>
            <Ionicons name="trash-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Xóa truyện</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.description}>{story?.description || ""}</Text>

        <View style={styles.chapterSectionHeader}>
          <Text style={styles.sectionTitle}>Danh sách chương ({chapters.length})</Text>
          <TouchableOpacity
            style={styles.addChapterButton}
            onPress={handleAddChapter}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.addChapterButtonText}>Thêm</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={chapters}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.chapterItem}>
              <View style={styles.chapterInfo}>
                <Text style={styles.chapterNumber}>Chương {item.chapterNumber}</Text>
                <Text style={styles.chapterTitle}>{item.title || "Không có tiêu đề"}</Text>
              </View>
              <View style={styles.chapterActions}>
                <TouchableOpacity
                  style={styles.chapterActionButton}
                  onPress={() => handleEditChapter(item)}
                >
                  <Ionicons name="create-outline" size={20} color="#2E9AFE" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.chapterActionButton}
                  onPress={() => handleDeleteChapter(item)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyChaptersContainer}>
              <Text style={styles.emptyChaptersText}>Chưa có chương nào</Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  author: { fontSize: 14, color: "#aaa", marginBottom: 16 },
  coverImage: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  infoText: { color: "#bbb", fontWeight: "bold", marginRight: 6 },
  normalText: { color: "#fff" },
  tag: {
    color: "#fff",
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 6,
  },
  chapterSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  addChapterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addChapterButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  description: { color: "#ddd", lineHeight: 22, fontSize: 14 },
  chapterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 8,
    marginVertical: 6,
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
  chapterActionButton: {
    padding: 8,
  },
  emptyChaptersContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyChaptersText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    gap: 10,
  },
  actionButtonEdit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E9AFE",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
  },
  actionButtonDelete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B22222",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
  },
  actionButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
