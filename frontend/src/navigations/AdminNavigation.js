import React from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoryButton from "../components/CategoryButton";
import ListUserScreen from "../screens/ListUserScreen";
import AddUserScreen from "../screens/AddUserScreen";
import EditUserScreen from "../screens/EditUserScreen";
import AdminScreen from "../screens/AdminScreen";
import AdminStoryDetailScreen from "../screens/AdminStoryDetailScreen";
import UpdateStoryScreen from "../screens/UpdateStoryScreen";
import CreateStoryScreen from "../screens/CreateStoryScreen";
import CreateChapterScreen from "../screens/CreateChapterScreen";
import UpdateChapterScreen from "../screens/UpdateChapterScreen";
import CatelogyScreen from "../screens/CatelogyScreen";

const Stack = createNativeStackNavigator();

// AdminHome: 4 nút phía trên + phía dưới hiển thị AdminScreen
const AdminHome = ({ navigation }) => {
    const onComing = () => Alert.alert("Thông báo", "Tính năng sẽ sớm có.");

    return (
        <View style={ styles.container }>
            <View style={ styles.filterRow }>
                <CategoryButton title="Category" onPress={ () => navigation.navigate("CategoryManagement") } />
                <CategoryButton title="Create Story" onPress={ () => navigation.navigate("CreateStory") } />
                <CategoryButton title="Create Chapter" onPress={ () => navigation.navigate("CreateChapter") } />
                <CategoryButton title="User" onPress={ () => navigation.navigate("ListUser") } />
            </View>

            <AdminScreen navigation={ navigation } />
        </View>
    );
};

const AdminNavigation = () => {
    return (
        <Stack.Navigator
            initialRouteName="AdminHome"
            screenOptions={ {
                headerStyle: { backgroundColor: "#000" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "700" }
            } }
        >
            <Stack.Screen
                name="AdminHome"
                component={ AdminHome }
                options={ { title: "Admin page" } }
            />
            <Stack.Screen name="main Admin" component={ AdminScreen } />
            <Stack.Screen name="adminDetail" component={ AdminStoryDetailScreen } />
            <Stack.Screen name="UpdateStory" component={ UpdateStoryScreen } options={ { title: "Sửa truyện" } } />
            <Stack.Screen name="CreateStory" component={ CreateStoryScreen } options={ { title: "Thêm truyện mới" } } />
            <Stack.Screen name="CreateChapter" component={ CreateChapterScreen } options={ { title: "Thêm chương mới" } } />
            <Stack.Screen name="UpdateChapter" component={ UpdateChapterScreen } options={ { title: "Sửa chương" } } />
            <Stack.Screen name="CategoryManagement" component={ CatelogyScreen } options={ { title: "Quản lý Thể loại" } } />
            <Stack.Screen
                name="ListUser"
                component={ ListUserScreen }
                options={ { title: "Quản lý người dùng" } }
            />
            <Stack.Screen
                name="AddUser"
                component={ AddUserScreen }
                options={ { title: "Thêm người dùng" } }
            />
            <Stack.Screen
                name="EditUser"
                component={ EditUserScreen }
                options={ { title: "Chỉnh sửa người dùng" } }
            />
        </Stack.Navigator>
    );
};

export default AdminNavigation;

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
        height: 180,
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

