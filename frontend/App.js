import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainTab from "./src/navigations/BottomTabNavigation";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTab"
          component={ MainTab }
          options={ { headerShown: false } }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
