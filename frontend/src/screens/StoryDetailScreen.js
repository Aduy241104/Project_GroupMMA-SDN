import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../config/axiosConfig'; // ✅ import axios instance của bạn
import ActionButtons from '../components/ActionsButtons';

function StoryDetailScreen({ route, navigation }) {
    const { data } = route.params;
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const res = await api.get(`/api/chapters/${data._id}`);
                const result = res;

                if (result.success && result.data?.chapters) {
                    const sortedChapters = result.data.chapters.sort(
                        (a, b) => a.chapterNumber - b.chapterNumber
                    );

                    // console.log("SPRRT: ", sortedChapters);
                    // console.log("result.data.chapters", result.data.chapters);

                    setChapters(sortedChapters);
                } else {
                    // console.log("HELLO");

                    setChapters([]);
                }
            } catch (err) {
                console.error("Fetch chapters error:", err);
                setChapters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChapters();
    }, [data._id]);

    return (
        <View style={ { flex: 1, backgroundColor: "#000" } }>
            <ScrollView
                style={ styles.container }
                contentContainerStyle={ { paddingBottom: 100 } } // chừa khoảng trống cho nút
            >
                {/* Tiêu đề */ }
                <Text style={ styles.title }>{ data.title }</Text>

                {/* Tác giả */ }
                <Text style={ styles.author }>Tác giả: { data.authorId?.name }</Text>

                {/* Ảnh bìa */ }
                <Image source={ { uri: data.coverImage } } style={ styles.coverImage } />

                {/* Thông tin phụ */ }
                <View style={ styles.infoRow }>
                    <Text style={ styles.infoText }>Thể loại:</Text>
                    { data.categoryIds.map((cat) => (
                        <Text key={ cat._id } style={ styles.tag }>{ cat.name }</Text>
                    )) }
                </View>

                <View style={ styles.infoRow }>
                    <Text style={ styles.infoText }>Trạng thái: </Text>
                    <Text style={ styles.normalText }>
                        { data.status === "completed" ? "Hoàn thành" : "Đang ra" }
                    </Text>
                </View>

                <View style={ styles.infoRow }>
                    <Text style={ styles.infoText }>Lượt xem:</Text>
                    <Text style={ styles.normalText }>{ data.views }</Text>
                    <Text style={ [styles.infoText, { marginLeft: 10 }] }>Lượt thích:</Text>
                    <Text style={ styles.normalText }>{ data.totalLikes }</Text>
                </View>

                <ActionButtons />

                {/* Mô tả */ }
                <Text style={ styles.sectionTitle }>Giới thiệu</Text>
                <Text style={ styles.description }>{ data.description }</Text>

                {/* Danh sách chương */ }
                <Text style={ styles.sectionTitle }>Danh sách chương</Text>
                { loading ? (
                    <ActivityIndicator size="large" color="#fff" style={ { marginTop: 10 } } />
                ) : chapters.length > 0 ? (
                    chapters.map((ch) => (
                        <TouchableOpacity
                            key={ ch._id }
                            style={ styles.chapterItem }
                            onPress={ () => navigation.navigate("read", { chapter: ch }) }
                        >
                            <Text style={ styles.chapterTitle }>
                                Chương { ch.chapterNumber }: { ch.title }
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={ { color: "#aaa", fontStyle: "italic" } }>Chưa có chương nào.</Text>
                ) }
            </ScrollView>

            {/* Nút hành động cố định ở dưới */ }
            <View style={ styles.fixedButtonContainer }>
                <TouchableOpacity
                    style={ styles.button }
                    disabled={ chapters.length === 0 }
                    onPress={ () => navigation.navigate("chapterDetail", { chapter: chapters[0], story: data }) }
                >
                    <Text style={ styles.buttonText }>Đọc Truyện</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

export default StoryDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
    fixedButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: "#222",
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    author: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 16,
    },
    coverImage: {
        width: '100%',
        height: 220,
        borderRadius: 10,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    infoText: {
        color: '#bbb',
        fontWeight: 'bold',
        marginRight: 6,
    },
    normalText: {
        color: '#fff',
    },
    tag: {
        color: '#fff',
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 6,
    },
    description: {
        color: '#ddd',
        lineHeight: 22,
        fontSize: 14,
    },
    chapterItem: {
        backgroundColor: '#111',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginVertical: 4,
    },
    chapterTitle: {
        color: '#fff',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 30,
    },
    button: {
        flex: 1,
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
