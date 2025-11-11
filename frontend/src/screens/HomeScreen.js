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

const HomeScreen = ({ navigation }) => {
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
        <TouchableOpacity style={ styles.storyCard } onPress={ () => navigation.navigate("detail", { data: item }) }>
            <Image source={ { uri: item.coverImage } } style={ styles.storyImage } />
            <Text style={ styles.storyTitle } numberOfLines={ 1 }>
                { item.title }
            </Text>
        </TouchableOpacity>
    );

    const renderStoryItemUpdated = ({ item }) => (
        <TouchableOpacity style={ styles.storyCard }>
            <Image source={ { uri: item.storyId.coverImage } } style={ styles.storyImage } />
            <Text style={ styles.storyTitle } numberOfLines={ 1 }>
                { item.storyId.title }
            </Text>
        </TouchableOpacity>
    );

    if (!data) {
        return (
            <View style={ styles.loadingContainer }>
                <Text style={ { color: "#fff" } }>Đang tải...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={ styles.container }>
            {/* Header */ }
            <Text style={ styles.headerTitle }>TYT</Text>

            <View style={ { flex: 1, flexDirection: "row", justifyContent: "space-between" } }>
                { ["Đánh Giá", "Yêu Thích", "Xem Nhiều", "Thịnh Hành"].map((title) => (
                    <CategoryButton key={ title } title={ title } />
                )) }
            </View>

            {/* Mới đăng */ }
            <View style={ styles.sectionHeader }>
                <Text style={ styles.sectionTitle }>Mới đăng</Text>
                <TouchableOpacity>
                    <Text style={ styles.moreText }>Xem Thêm ›</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                data={ data.addedRecentlyStories }
                renderItem={ renderStoryItem }
                keyExtractor={ (item) => item._id }
                showsHorizontalScrollIndicator={ false }
            />

            {/* Mới đăng */ }
            <View style={ styles.sectionHeader }>
                <Text style={ styles.sectionTitle }>Xem nhiều</Text>
                <TouchableOpacity onPress={ () => navigation.navigate("mostView") }>
                    <Text style={ styles.moreText }>Xem Thêm ›</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                data={ data.mostViewedStories }
                renderItem={ renderStoryItem }
                keyExtractor={ (item) => item._id }
                showsHorizontalScrollIndicator={ false }
            />


            {/* Truyện Full - Hoàn */ }
            <Text style={ styles.sectionTitle }>Truyện Full - Hoàn</Text>
            <View style={ styles.fullRow }>
                <TouchableOpacity style={ styles.fullButton }>
                    <Text style={ styles.fullText }>Full - Mới Cập Nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ styles.fullButton }>
                    <Text style={ styles.fullText }>Full - Đánh Giá Cao</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: "#111",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: "center",
    },
    filterText: {
        color: "#fff",
        fontSize: 14,
    },
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
        justifyContent: "space-between",
        marginTop: 15,
        marginBottom: 40,
        paddingBottom: 100
    },
    fullButton: {
        backgroundColor: "#111",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        width: "48%",
        alignItems: "center",
    },
    fullText: {
        color: "#fff",
        fontSize: 14,
    },
});

export default HomeScreen;
