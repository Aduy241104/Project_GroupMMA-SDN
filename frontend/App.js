import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainTab from "./src/navigations/BottomTabNavigation";
import { AuthProvider } from "./src/context/AuthContext";
import React, { useEffect } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import StoryDetailScreen from "./src/screens/StoryDetailScreen";
import ReadStoryScreen from "./src/screens/ReadStoryScreen";
import RegisterScreen from "./src/screens/RegisterScreen"
import VerifyOTPScreen from './src/screens/VerifyOTPScreen';
import ForgotPassword from './src/screens/ForgotPasswordScreen'
import ResetPassword from './src/screens/ResetPasswordScreen'
import ManageCommentsScreen from "./src/screens/ManageCommentsScreen";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  // useEffect(() => {
  //   const testApi = async () => {
  //     try {
  //       const response = await fetch("http://172.20.10.2:8080/api/test");
  //       // ⚠️ Đổi 192.168.1.5 thành IP máy tính bạn đang chạy backend (xem dưới)
  //       const data = await response.json();
  //       console.log("✅ API response:", data);
  //     } catch (error) {
  //       console.log("❌ API error:", error);
  //     }
  //   };

  //   testApi();
  // }, []);


  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTab"
            component={ MainTab }
            options={ { headerShown: false } }
          />
          <Stack.Screen name="login" component={ LoginScreen } />
          <Stack.Screen name="detail" component={ StoryDetailScreen } />
          <Stack.Screen name="read" component={ ReadStoryScreen } />
          <Stack.Screen name="register" component={ RegisterScreen } />
          <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          <Stack.Screen name="forgot-password" component={ForgotPassword} />
          <Stack.Screen name="reset-password" component={ResetPassword} />
          <Stack.Screen name="manager-comment" component={ManageCommentsScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}