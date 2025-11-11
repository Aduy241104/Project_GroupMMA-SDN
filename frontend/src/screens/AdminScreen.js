import CategoryButton from "../components/CategoryButton";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import api from "../config/axiosConfig";
import { useIsFocused } from "@react-navigation/native";

const AdminScreen = ({ navigation }) => {
    const [data, setData] = useState(null);
    const isFocus = useIsFocused();

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await api.get("/api/stories/home");
                setData(res.data);
            } catch (err) {
                console.error("Fetch home data error:", err);
            }
        };

        fetchHomeData();
    }, [isFocus]);

    const renderStoryItem = ({ item }) => (
  <TouchableOpacity
    style={styles.storyCard}
    onPress={() => navigation.navigate("adminDetail", { data: item })}
  >
    {item.coverImage ? (
      <Image source={{ uri: item.coverImage }} style={styles.storyImage} />
    ) : null}
    <Text style={styles.storyTitle} numberOfLines={1}>
      {item.title}
    </Text>
  </TouchableOpacity>
);

    const renderStoryItemUpdated = ({ item }) => (
  <TouchableOpacity style={styles.storyCard}>
    {item.storyId?.coverImage ? (
      <Image
        source={{ uri: item.storyId.coverImage }}
        style={styles.storyImage}
      />
    ) : null}
    <Text style={styles.storyTitle} numberOfLines={1}>
      {item.storyId?.title || "Không có tiêu đề"}
    </Text>
  </TouchableOpacity>
);

    if (!data) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: "#fff" }}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <Text style={styles.headerTitle}>Menu Admin</Text>

            {/* Admin Actions */}
            <View style={styles.adminActionsContainer}>
                <TouchableOpacity
                    style={styles.adminActionButton}
                    onPress={() => navigation.navigate("CategoryManagement")}
                >
                    <Text style={styles.adminActionButtonText}>📚 Quản lý Thể loại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.adminActionButton, styles.createButton]}
                    onPress={() => navigation.navigate("CreateStory")}
                >
                    <Text style={styles.adminActionButtonText}>➕ Thêm truyện mới</Text>
                </TouchableOpacity>
            </View>

            {/* <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                {["Đánh Giá", "Yêu Thích", "Xem Nhiều", "Thịnh Hành"].map((title) => (
                    <CategoryButton key={title} title={title} />
                ))}
            </View> */}

            {/* Mới đăng */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mới đăng</Text>
                <TouchableOpacity>
                    <Text style={styles.moreText}>Xem Thêm ›</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                data={data.addedRecentlyStories}
                renderItem={renderStoryItem}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
            />

            {/* Xem nhiều */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Xem nhiều</Text>
                <TouchableOpacity>
                    <Text style={styles.moreText}>Xem Thêm ›</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                data={data.mostViewedStories}
                renderItem={renderStoryItem}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
            />

            {/* Mới cập nhật */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mới cập nhật</Text>
                <TouchableOpacity>
                    <Text style={styles.moreText}>Xem Thêm ›</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                data={data.updatedRecentlyStories}
                renderItem={renderStoryItemUpdated}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
            />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 40,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 10,
    },
    adminActionsContainer: {
        marginBottom: 20,
        gap: 10,
    },
    adminActionButton: {
        backgroundColor: "#2E9AFE",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    createButton: {
        backgroundColor: "#28a745",
    },
    adminActionButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
        marginTop: 10,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    moreText: {
        color: "#2E9AFE",
    },
    storyCard: {
        width: 110,
        marginRight: 12,
    },
    storyImage: {
        width: 110,
        height: 150,
        borderRadius: 8,
        backgroundColor: "#222",
    },
    storyTitle: {
        color: "#fff",
        fontSize: 13,
        marginTop: 5,
    },
    fullRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
        marginBottom: 40,
    },
    fullButton: {
        backgroundColor: "#111",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        width: "60%",
        alignItems: "center",
    },
    fullButtonBlue: {
        backgroundColor: "#2E9AFE", // 💙 Nút xanh
    },
    fullText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default AdminScreen;
