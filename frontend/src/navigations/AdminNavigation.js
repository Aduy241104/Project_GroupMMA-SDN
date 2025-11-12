import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
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
import ManageCommentsScreen from "../screens/ManageCommentsScreen";
import ManageAuthorsScreen from "../screens/ManageAuthorsScreen";

const Stack = createNativeStackNavigator();

const AdminHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Admin Page</Text>

      <View style={styles.filterRow}>
        <CategoryButton
          title="Category"
          onPress={() => navigation.navigate("CategoryManagement")}
        />
        <CategoryButton
          title="Create Story"
          onPress={() => navigation.navigate("CreateStory")}
        />
        <CategoryButton
          title="User"
          onPress={() => navigation.navigate("ListUser")}
        />
        <CategoryButton
          title="Comments"
          onPress={() => navigation.navigate("ManageComments")}
        />
      </View>

      <View style={styles.filterRow}>
        <CategoryButton
          title="Authors"
          onPress={() => navigation.navigate("ManageAuthors")} // ← dẫn đến màn hình quản lý tác giả
        />
      </View>

      <AdminScreen navigation={navigation} />
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
      <Stack.Screen name="main Admin" component={AdminScreen} />
      <Stack.Screen name="adminDetail" component={AdminStoryDetailScreen} />
      <Stack.Screen
        name="UpdateStory"
        component={UpdateStoryScreen}
        options={{ title: "Sửa truyện" }}
      />
      <Stack.Screen
        name="CreateStory"
        component={CreateStoryScreen}
        options={{ title: "Thêm truyện mới" }}
      />
      <Stack.Screen
        name="CreateChapter"
        component={CreateChapterScreen}
        options={{ title: "Thêm chương mới" }}
      />
      <Stack.Screen
        name="UpdateChapter"
        component={UpdateChapterScreen}
        options={{ title: "Sửa chương" }}
      />
      <Stack.Screen
        name="CategoryManagement"
        component={CatelogyScreen}
        options={{ title: "Quản lý Thể loại" }}
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
        name="ManageAuthors" // ← thêm màn hình ManageAuthors
        component={ManageAuthorsScreen}
        options={{ title: "Quản lý tác giả" }}
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
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
