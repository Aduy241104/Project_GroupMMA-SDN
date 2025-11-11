import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import AdminScreen from "../screens/AdminScreen";
import AdminStoryDetailScreen from "../screens/AdminStoryDetailScreen";
import UpdateStoryScreen from "../screens/UpdateStoryScreen";
import CreateStoryScreen from "../screens/CreateStoryScreen";
import CreateChapterScreen from "../screens/CreateChapterScreen";
import UpdateChapterScreen from "../screens/UpdateChapterScreen";
import CatelogyScreen from "../screens/CatelogyScreen";

const Stack = createNativeStackNavigator();

const AdminNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="main Admin" component={ AdminScreen } />
            <Stack.Screen name="adminDetail" component={AdminStoryDetailScreen}/>
            <Stack.Screen name="UpdateStory" component={UpdateStoryScreen} options={{ title: "Sửa truyện" }}/>
            <Stack.Screen name="CreateStory" component={CreateStoryScreen} options={{ title: "Thêm truyện mới" }}/>
            <Stack.Screen name="CreateChapter" component={CreateChapterScreen} options={{ title: "Thêm chương mới" }}/>
            <Stack.Screen name="UpdateChapter" component={UpdateChapterScreen} options={{ title: "Sửa chương" }}/>
            <Stack.Screen name="CategoryManagement" component={CatelogyScreen} options={{ title: "Quản lý Thể loại" }}/>
        </Stack.Navigator>
    )
}

export default AdminNavigation;