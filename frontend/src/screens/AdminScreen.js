import CategoryButton from "../components/CategoryButton";
import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../config/axiosConfig";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const AdminScreen = ({ navigation }) => {
    const { user, loading } = useContext(AuthContext);
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

    if (loading || !data) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: "#fff" }}>Đang tải...</Text>
            </View>
        );
    }

    if (!user || (user.role !== "admin" && user.role !== "ADMIN")) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: "#fff", marginBottom: 10 }}>
                    Bạn không có quyền truy cập trang này.
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.replace("MainTab")}
                    style={{
                        backgroundColor: "#1a1a1a",
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: "#fff" }}>Về trang chính</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.container}
            data={[]}
            keyExtractor={() => "empty"}
            ListHeaderComponent={(
                <View>
                    {/* Bỏ các nút chức năng ở AdminScreen, chuyển sang AdminNavigation */}

                    {/* Mới đăng */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Mới đăng</Text>
                        <TouchableOpacity>
                            <Text style={styles.moreText}>Xem Thêm ›</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.flatListContainer}>
                        <FlatList
                            horizontal
                            data={data.addedRecentlyStories}
                            renderItem={renderStoryItem}
                            keyExtractor={(item) => item._id}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                        />
                    </View>

                    {/* Xem nhiều */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Xem nhiều</Text>
                        <TouchableOpacity>
                            <Text style={styles.moreText}>Xem Thêm ›</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.flatListContainer}>
                        <FlatList
                            horizontal
                            data={data.mostViewedStories}
                            renderItem={renderStoryItem}
                            keyExtractor={(item) => item._id}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                        />
                    </View>

                    {/* Mới cập nhật */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Mới cập nhật</Text>
                        <TouchableOpacity>
                            <Text style={styles.moreText}>Xem Thêm ›</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.flatListContainer}>
                        <FlatList
                            horizontal
                            data={data.updatedRecentlyStories}
                            renderItem={renderStoryItemUpdated}
                            keyExtractor={(item) => item._id}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                        />
                    </View>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        flex: 1,
        paddingHorizontal: 10,
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
    // removed admin action buttons; navigation buttons live in AdminNavigation
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 30,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    moreText: {
        color: "#2E9AFE",
    },
    flatListContainer: {
        height: 180, // Fixed height để tránh lỗi VirtualizedList
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
});

export default AdminScreen;
