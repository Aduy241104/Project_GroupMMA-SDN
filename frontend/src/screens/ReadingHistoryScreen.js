import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import axios from '../config/axiosConfig';
import { useIsFocused } from '@react-navigation/native';

const ReadingHistoryScreen = ({ navigation }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const isFocused = useIsFocused();

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/history');
            setHistory(res || []);
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử đọc:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchHistory();
        }
    }, [isFocused, reload]);

    const deleteHistory = (id) => {
        Alert.alert('Xóa lịch sử', 'Bạn có chắc muốn xóa mục này?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await axios.delete(`/api/history/delete/${id}`);
                        setReload(prev => !prev); // chỉ cần toggle reload để tự fetch lại
                    } catch (error) {
                        console.error('Lỗi khi xóa lịch sử:', error);
                        Alert.alert('Lỗi', 'Không thể xóa lịch sử. Vui lòng thử lại sau.');
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={ [styles.center, styles.container] }>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!history || history.length === 0) {
        return (
            <View style={ [styles.center, styles.container] }>
                <Text style={ { color: '#ccc' } }>Không có lịch sử đọc nào</Text>
            </View>
        );
    }

    return (
        <ScrollView style={ styles.container } contentContainerStyle={ styles.list }>
            { history.map((item) => {
                const story = item.storyId;
                return (
                    <TouchableOpacity key={ item._id } onPress={ () => navigation.navigate("detail", { data: item.storyId }) }>
                        <View style={ styles.card }>
                            <TouchableOpacity
                                style={ styles.deleteButton }
                                onPress={ () => deleteHistory(item._id) }
                            >
                                <Text style={ styles.deleteText }>✕</Text>
                            </TouchableOpacity>

                            <Image source={ { uri: story.coverImage } } style={ styles.image } />
                            <View style={ styles.info }>
                                <Text style={ styles.title }>{ story.title }</Text>
                                <Text style={ styles.date }>
                                    Lần đọc gần nhất:{ ' ' }
                                    { new Date(item.lastReadAt).toLocaleString('vi-VN') }
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }) }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    list: {
        padding: 10,
    },
    card: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        flexDirection: 'row',
        elevation: 2,
        shadowColor: '#fff',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        position: 'relative',
    },
    deleteButton: {
        position: 'absolute',
        right: 8,
        top: 8,
        zIndex: 1,
        backgroundColor: '#ff4444',
        borderRadius: 50,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    image: {
        width: 70,
        height: 90,
        borderRadius: 8,
        marginRight: 10,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff', // ✅ chữ trắng
        marginBottom: 6,
    },
    date: {
        color: '#bbb',
        fontSize: 13,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ReadingHistoryScreen;