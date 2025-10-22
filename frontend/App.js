import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainTab from "./src/navigations/BottomTabNavigation";
import { AuthProvider } from "./src/context/AuthContext";
import React, { useEffect } from "react";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch("http://172.20.10.2:8080/api/test");
        // ⚠️ Đổi 192.168.1.5 thành IP máy tính bạn đang chạy backend (xem dưới)
        const data = await response.json();
        console.log("✅ API response:", data);
      } catch (error) {
        console.log("❌ API error:", error);
      }
    };

    testApi();
  }, []);


  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTab"
            component={ MainTab }
            options={ { headerShown: false } }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
