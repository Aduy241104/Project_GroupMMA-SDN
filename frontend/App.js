import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainTab from "./src/navigations/BottomTabNavigation";
import { AuthProvider } from "./src/context/AuthContext";
import React, { useEffect } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import StoryDetailScreen from "./src/screens/StoryDetailScreen";
import ReadStoryScreen from "./src/screens/ReadStoryScreen";
import AdminScreen from "./src/screens/AdminScreen";

import RegisterScreen from "./src/screens/RegisterScreen"
import VerifyOTPScreen from './src/screens/VerifyOTPScreen';
import ForgotPassword from './src/screens/ForgotPasswordScreen'
import ResetPassword from './src/screens/ResetPasswordScreen'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

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
          <Stack.Screen name="admin" component={ AdminScreen } />
          <Stack.Screen name="register" component={ RegisterScreen } />
          <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          <Stack.Screen name="forgot-password" component={ForgotPassword} />
          <Stack.Screen name="reset-password" component={ResetPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
