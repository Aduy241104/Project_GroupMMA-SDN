import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoryButton from "../components/CategoryButton";

import ListUserScreen from "../screens/ListUserScreen";
import AddUserScreen from "../screens/AddUserScreen";
import EditUserScreen from "../screens/EditUserScreen";
import ManageCommentsScreen from "../screens/ManageCommentsScreen.js";

const Stack = createNativeStackNavigator();

// --- AdminHome với 4 nút ---
const AdminHome = ({ navigation }) => {
    const onComing = () => Alert.alert("Thông báo", "Tính năng sẽ sớm có.");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Page</Text>
            <View style={styles.grid}>
                {["Category", "User", "Comment", "Author"].map((title) => (
                    <CategoryButton
                        key={title}
                        title={title}
                        onPress={
                            title === "User"
                                ? () => navigation.navigate("ListUser")
                                : title === "Comment"
                                ? () => navigation.navigate("ManageComments")
                                : onComing
                        }
                    />
                ))}
            </View>
        </View>
    );
};

const AdminNavigation = () => {
    return (
        <Stack.Navigator
            initialRouteName="AdminHome"
            screenOptions={{
                headerStyle: { backgroundColor: "#000" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "700" }
            }}
        >
            <Stack.Screen
                name="AdminHome"
                component={AdminHome}
                options={{ title: "Admin Page" }}
            />
            <Stack.Screen
                name="ListUser"
                component={ListUserScreen}
                options={{ title: "Quản lý người dùng" }}
            />
            <Stack.Screen
                name="AddUser"
                component={AddUserScreen}
                options={{ title: "Thêm người dùng" }}
            />
            <Stack.Screen
                name="EditUser"
                component={EditUserScreen}
                options={{ title: "Chỉnh sửa người dùng" }}
            />
            <Stack.Screen
                name="ManageComments"
                component={ManageCommentsScreen}
                options={{ title: "Quản lý Comments" }}
            />
        </Stack.Navigator>
    );
};

export default AdminNavigation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        padding: 16,
        justifyContent: "center"
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
        alignSelf: "center"
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    }
});
