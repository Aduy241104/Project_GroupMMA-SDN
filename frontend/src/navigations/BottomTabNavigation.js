import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";


const Tab = createBottomTabNavigator();

// --- Các màn hình thử ---
const HomeScreen = () => (
  <View style={ { flex: 1, justifyContent: "center", alignItems: "center" } }>
    <Text>🏠 Home Screen</Text>
  </View>
);

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
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
          else if (route.name === "Settings") iconName = focused ? "settings" : "settings-outline";
          return <Ionicons name={ iconName } size={ size } color={ color } />;
        },
        tabBarActiveTintColor: "#00b894",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#393939ff",
          height: 80,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: "absolute",
        },
        tabBarLabelStyle: { fontSize: 13, marginBottom: 5 },
      }) }
    >
      <Tab.Screen name="Home" component={ HomeScreen } />
      <Tab.Screen name="Profile" component={ ProfileScreen } />
      <Tab.Screen name="Settings" component={ SettingsScreen } />
    </Tab.Navigator>
  );
}

export default MainTab;