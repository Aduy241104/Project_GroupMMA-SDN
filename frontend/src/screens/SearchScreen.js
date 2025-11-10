import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import axios from "../config/axiosConfig";

const SearchScreen = ({ navigation }) => {
    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState("title"); // title | author
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (!keyword.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập từ khóa tìm kiếm.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`/api/stories/search?type=${type}&keyword=${keyword}`);

            if (res.success) {
                setResults(res.data.stories || []);
            } else {
                Alert.alert("Không tìm thấy", res.message || "Không có kết quả nào.");
                setResults([]);
            }
        } catch (error) {
            console.log("Search error:", error);
            Alert.alert("Lỗi", "Không thể tìm kiếm. Vui lòng kiểm tra kết nối mạng.");
        } finally {
            setLoading(false);
        }
    };

    const toggleType = () => {
        setType((prev) => (prev === "title" ? "author" : "title"));
    };

    const renderStory = ({ item }) => (
        <TouchableOpacity
            style={ styles.storyCard }
            onPress={ () => navigation.navigate("detail", { data: item }) }
        >
            <Image source={ { uri: item.coverImage } } style={ styles.coverImage } />
            <View style={ styles.storyInfo }>
                <Text style={ styles.title }>{ item.title }</Text>
                <Text style={ styles.author }>Tác giả: { item.authorId?.name }</Text>
                <Text style={ styles.category }>
                    Thể loại: { item.categoryIds.map((c) => c.name).join(", ") }
                </Text>
                <View style={ styles.statsRow }>
                    <Text style={ styles.stat }>👁 { item.views }</Text>
                    <Text style={ styles.stat }>👍 { item.totalLikes }</Text>
                </View>
                <Text style={ styles.status }>
                    Trạng thái:{ " " }
                    <Text style={ { color: item.status === "ongoing" ? "#4da6ff" : "#6f6" } }>
                        { item.status === "ongoing" ? "Đang ra" : "Hoàn thành" }
                    </Text>
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={ styles.container }>
            {/* Thanh tìm kiếm */ }
            <View style={ styles.searchRow }>
                <TextInput
                    style={ styles.input }
                    placeholder={ `Tìm theo ${type === "title" ? "tiêu đề" : "tác giả"}...` }
                    placeholderTextColor="#888"
                    value={ keyword }
                    onChangeText={ setKeyword }
                />
                <TouchableOpacity style={ styles.searchBtn } onPress={ handleSearch }>
                    <Text style={ styles.searchText }>Tìm</Text>
                </TouchableOpacity>
            </View>

            {/* Nút chuyển trạng thái tìm kiếm */ }
            <TouchableOpacity style={ styles.toggleBtn } onPress={ toggleType }>
                <Text style={ styles.toggleText }>
                    🔄 Đang tìm theo: <Text style={ { color: "#4da6ff" } }>{ type === "title" ? "Tiêu đề" : "Tác giả" }</Text>
                </Text>
            </TouchableOpacity>

            {/* Kết quả tìm kiếm */ }
            { loading ? (
                <ActivityIndicator size="large" color="#4da6ff" style={ { marginTop: 20 } } />
            ) : results.length > 0 ? (
                <FlatList
                    data={ results }
                    keyExtractor={ (item) => item._id }
                    renderItem={ renderStory }
                    contentContainerStyle={ { paddingBottom: 20 } }
                />
            ) : (
                <Text style={ styles.noResult }>Không có kết quả hiển thị</Text>
            ) }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        padding: 15,
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: "#111",
        color: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 8,
    },
    searchBtn: {
        backgroundColor: "#1a73e8",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    searchText: {
        color: "#fff",
        fontWeight: "600",
    },
    toggleBtn: {
        marginBottom: 10,
        alignItems: "center",
    },
    toggleText: {
        color: "#ccc",
        fontSize: 14,
    },
    storyCard: {
        flexDirection: "row",
        backgroundColor: "#111",
        borderRadius: 10,
        marginBottom: 10,
        overflow: "hidden",
    },
    coverImage: {
        width: 90,
        height: 120,
    },
    storyInfo: {
        flex: 1,
        padding: 10,
    },
    title: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
        marginBottom: 3,
    },
    author: {
        color: "#ccc",
        fontSize: 13,
    },
    category: {
        color: "#aaa",
        fontSize: 12,
        marginVertical: 2,
    },
    statsRow: {
        flexDirection: "row",
        gap: 10,
        marginVertical: 2,
    },
    stat: {
        color: "#999",
        fontSize: 12,
    },
    status: {
        color: "#ccc",
        fontSize: 12,
        marginTop: 4,
    },
    noResult: {
        color: "#777",
        textAlign: "center",
        marginTop: 40,
    },
});

export default SearchScreen;
