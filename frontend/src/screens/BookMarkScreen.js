import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../config/axiosConfig";
import { AuthContext } from "../context/AuthContext";

export default function BookMarkScreen() {
  const { token } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách bookmark
  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookmark/list");
      console.log("Bookmarks fetched:", res);
      setBookmarks(res?.data || []); // res.data là mảng bookmarks
    } catch (err) {
      console.error("Lỗi khi lấy bookmark:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Hàm xoá bookmark
  const handleDelete = async (storyId) => {
    try {
      Alert.alert(
        "Xác nhận",
        "Bạn có chắc muốn xóa truyện này khỏi bộ sưu tập?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
              const res = await api.delete(`/api/bookmark/remove`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { storyId }, // ⚠️ Gửi storyId trong body
              });

              console.log("Xóa bookmark:", res.data);
              // Cập nhật lại danh sách hiển thị
              setBookmarks((prev) =>
                prev.filter((item) => item.storyId !== storyId)
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Lỗi khi xóa bookmark:", error);
    }
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          Bạn chưa có truyện nào trong bộ sưu tập.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.storyId}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.coverImage }} style={styles.cover} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.status}>{item.status}</Text>
              <Text style={styles.status}>
                {item.bookmarkedAt
                  ? new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(new Date(item.bookmarkedAt))
                  : "Chưa có ngày"}
              </Text>


            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.storyId)}
            >
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#fff", fontSize: 16 },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  cover: { width: 80, height: 100, borderRadius: 8, marginRight: 12 },
  info: { flex: 1, justifyContent: "center" },
  title: { color: "#fff", fontSize: 16 },
  status: { color: "#aaa", fontSize: 14, marginTop: 4 },
  deleteBtn: {
    backgroundColor: "#ff3b30",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
});
