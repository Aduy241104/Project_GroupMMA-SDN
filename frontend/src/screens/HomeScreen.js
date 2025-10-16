

import { View, Text, FlatList, Image, StyleSheet, ScrollView } from "react-native";

const newPosted = [
    {
        id: "1",
        title: "Tháng Hai Sâu Đậm",
        image: "https://picsum.photos/id/1018/200/300",
    },
    {
        id: "2",
        title: "Bốn Mùa Lên Núi",
        image: "https://picsum.photos/id/1025/200/300",
    },
    {
        id: "3",
        title: "Sau Khi Mang Thai",
        image: "https://picsum.photos/id/1037/200/300",
    },
    {
        id: "4",
        title: "Yêu Nhau Là Không Thể",
        image: "https://picsum.photos/id/1045/200/300",
    },
];

const newUpdated = [
    {
        id: "5",
        title: "Tục Nhân Hồi Đáng",
        image: "https://picsum.photos/id/1052/200/300",
    },
    {
        id: "6",
        title: "Trùng Đức Tham Gia",
        image: "https://picsum.photos/id/1060/200/300",
    },
    {
        id: "7",
        title: "Sau Khi Tan Tầm",
        image: "https://picsum.photos/id/1070/200/300",
    },
    {
        id: "8",
        title: "Âm Dương Biến",
        image: "https://picsum.photos/id/1084/200/300",
    },
];

const HomeScreen = () => {
    const renderItem = ({ item }) => (
        <View style={ styles.card }>
            <Image source={ { uri: item.image } } style={ styles.image } />
            <Text style={ styles.title } numberOfLines={ 1 }>
                { item.title }
            </Text>
        </View>
    );

    return (
        <ScrollView style={ styles.container }>
            {/* --- Mới đăng --- */ }
            <Text style={ styles.sectionTitle }>Mới đăng</Text>
            <FlatList
                data={ newPosted }
                horizontal
                keyExtractor={ (item) => item.id }
                renderItem={ renderItem }
                showsHorizontalScrollIndicator={ false }
                contentContainerStyle={ { paddingHorizontal: 10 } }
            />

            {/* --- Mới cập nhật --- */ }
            <Text style={ styles.sectionTitle }>Mới cập nhật</Text>
            <FlatList
                data={ newUpdated }
                horizontal
                keyExtractor={ (item) => item.id }
                renderItem={ renderItem }
                showsHorizontalScrollIndicator={ false }
                contentContainerStyle={ { paddingHorizontal: 10 } }
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000", // nền đen giống app truyện
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginVertical: 12,
        marginLeft: 10,
    },
    card: {
        width: 120,
        marginRight: 10,
    },
    image: {
        width: 120,
        height: 160,
        borderRadius: 8,
    },
    title: {
        color: "#fff",
        fontSize: 13,
        marginTop: 4,
    },
});

export default HomeScreen;
