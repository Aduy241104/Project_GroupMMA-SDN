import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CategoryButton from "../components/CategoryButton";
import ListUserScreen from "../screens/ListUserScreen";
import AddUserScreen from "../screens/AddUserScreen";
import EditUserScreen from "../screens/EditUserScreen";
import ManageCommentsScreen from "../screens/ManageCommentsScreen.js";
import ManageAuthorsScreen from "../screens/ManageAuthorsScreen";

const Stack = createNativeStackNavigator();

// Màn hình Admin Home inline: 4 nút Category, User, Comment, Author
const AdminHome = ({ navigation }) => {
  const onComing = () => Alert.alert("Thông báo", "Tính năng sẽ sớm có.");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin page</Text>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {["Category", "User", "Comment", "Author"].map((title) => (
          <CategoryButton
            key={title}
            title={title}
            onPress={
              title === "User"
                ? () => navigation.navigate("ListUser")
                : title === "Comment"
                ? () => navigation.navigate("ManageComments")
                : title === "Author"
                ? () => navigation.navigate("ManageAuthors")
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
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{ title: "Admin page" }}
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
        options={{ title: "Quản lý Comment" }}
      />
      <Stack.Screen
        name="ManageAuthors"
        component={ManageAuthorsScreen}
        options={{ title: "Quản lý tác giả" }}
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
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    alignSelf: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDesc: {
    color: "#bbb",
    fontSize: 13,
  },
});
