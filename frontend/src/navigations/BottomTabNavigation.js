import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import DiscoverNavigation from "./DiscoverNavigation";
import SearchNavigation from "./SearchNavigation";
import MenuNavigation from "./MenuNavigation";
import AdminNavigation from "./AdminNavigation";
import { AuthContext } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

// --- Tạo Bottom Tab ---
function MainTab() {
    const { user } = useContext(AuthContext);
    const isAdmin = user && (user.role === "admin" || user.role === "ADMIN");

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
                    height: 60,
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
            { isAdmin && <Tab.Screen name="Admin" component={ AdminNavigation } /> }
        </Tab.Navigator>
    );
}

export default MainTab;