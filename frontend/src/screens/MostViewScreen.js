import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from '../config/axiosConfig'; // axios đã config sẵn
import { useNavigation } from '@react-navigation/native';

const MostViewScreen = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchMostViewed = async () => {
            try {
                const result = await axios.get('/api/stories/most-view');
                setStories(result.data.mostViewedStory); // không cần .data nữa
            } catch (error) {
                console.log('Lỗi khi lấy most viewed stories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMostViewed();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={ styles.card }
            onPress={ () => navigation.navigate('detail', { data: item }) }
        >
            <Image source={ { uri: item.coverImage } } style={ styles.coverImage } />
            <View style={ styles.info }>
                <Text style={ styles.title } numberOfLines={ 2 }>{ item.title }</Text>
                <Text style={ styles.author }>Tác giả: { item.authorId?.name }</Text>
                <Text style={ styles.views }>Lượt xem: { item.views }</Text>
                <Text style={ styles.categories }>
                    Thể loại: { item.categoryIds?.map(c => c.name).join(', ') }
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={ styles.loadingContainer }>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={ styles.container }>
            <FlatList
                data={ stories }
                keyExtractor={ (item) => item._id }
                renderItem={ renderItem }
                contentContainerStyle={ { paddingBottom: 20 } }
            />
        </View>
    );
};

export default MostViewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000ff',
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#000',
        marginVertical: 8,
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    coverImage: {
        width: 100,
        height: 140,
    },
    info: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    author: {
        color: '#ccc',
        fontSize: 14,
    },
    views: {
        color: '#ccc',
        fontSize: 12,
    },
    categories: {
        color: '#ccc',
        fontSize: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
