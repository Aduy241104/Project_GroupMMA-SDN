import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DiscoverNavigation from "./DiscoverNavigation";
import SearchNavigation from "./SearchNavigation";
import MenuNavigation from "./MenuNavigation";
import AdminNavigation from "./AdminNavigation";

const Tab = createBottomTabNavigator();

const ProfileScreen = () => (
    <View style={ { flex: 1, justifyContent: "center", alignItems: "center" } }>
        <Text>👤 Profile Screen</Text>
    </View>
);

const SettingsScreen = () => (
    <View style={ { flex: 1, justifyContent: "center", alignItems: "center" } }>
        <Text>⚙️ Settings Screen</Text>
    </View>
);

// --- Tạo Bottom Tab ---
function MainTab() {
    return (
        <Tab.Navigator
            screenOptions={ ({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Home") iconName = focused ? "home" : "home-outline";
                    else if (route.name === "Search") iconName = focused ? "search" : "search-outline";
                    else if (route.name === "Settings") iconName = focused ? "settings" : "settings-outline";
                    else if (route.name === "Admin") iconName = focused ? "shield" : "shield-outline";
                    return <Ionicons name={ iconName } size={ 18 } color={ "#07c3e9ff" } />;
                },
                tabBarActiveTintColor: "#07c3e9ff",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: "#222222ff",
                    height: 86,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: "absolute",
                    borderTopWidth: 0
                },
                tabBarLabelStyle: { fontSize: 13, marginBottom: 5 },
            }) }
        >
            <Tab.Screen name="Home" component={ DiscoverNavigation } />
            <Tab.Screen name="Search" component={ SearchNavigation } />
            <Tab.Screen name="Settings" component={ MenuNavigation } />
            <Tab.Screen name="Admin" component={ AdminNavigation } />
        </Tab.Navigator>
    );
}

export default MainTab;