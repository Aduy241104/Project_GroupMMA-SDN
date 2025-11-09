import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import api from "../config/axiosConfig"; 


function ReadStoryScreen({ route }) {
    const { chapter } = route.params; // nhận từ navigation.navigate("read", { chapter })
    const [chapterDetail, setChapterDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChapterDetail = async () => {
            try {
                const res = await api.get(`/api/chapters/chapter-detail/${chapter._id}`);
                const result = res;
                console.log("CHAPTER DETAIL:", result);

                if (result.success && result.data?.chapterDetail) {
                    setChapterDetail(result.data.chapterDetail);
                }
            } catch (err) {
                console.error("Fetch chapter detail error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChapterDetail();
    }, [chapter._id]);

    if (loading) {
        return (
            <View style={ styles.loadingContainer }>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!chapterDetail) {
        return (
            <View style={ styles.loadingContainer }>
                <Text style={ { color: "#aaa" } }>Không tìm thấy nội dung chương.</Text>
            </View>
        );
    }

    const { title, content, images } = chapterDetail;

    return (
        <View style={ { flex: 1, backgroundColor: "#000" } }>
            <ScrollView style={ styles.container } contentContainerStyle={ { paddingBottom: 50 } }>
                <Text style={ styles.chapterTitle }>Chương { chapter.chapterNumber }: { title }</Text>

                {/* Nếu có content (truyện chữ) */ }
                { content ? (
                    <Text style={ styles.chapterContent }>
                        { content.replace(/\\n/g, '\n') }
                    </Text>
                ) : images && images.length > 0 ? (
                    // Nếu không có content mà có images (truyện tranh)
                    images.map((img, idx) => (
                        <Image
                            key={ idx }
                            source={ { uri: img } }
                            style={ styles.chapterImage }
                            resizeMode="contain"
                        />
                    ))
                ) : (
                    <Text style={ { color: "#aaa", textAlign: "center" } }>Chương này chưa có nội dung.</Text>
                ) }
            </ScrollView>
        </View>
    );
}

export default ReadStoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },
    chapterTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    chapterContent: {
        color: "#ddd",
        fontSize: 16,
        lineHeight: 26,
        textAlign: "justify",
    },
    chapterImage: {
        width: "100%",
        height: 500,
        marginBottom: 16,
        borderRadius: 10,
    },
});
