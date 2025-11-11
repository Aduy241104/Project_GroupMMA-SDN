import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

const DiscoverNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen  name="main discover" component={ HomeScreen } />
            <Stack.Screen name="favorite" component={ HomeScreen } />
        </Stack.Navigator>
    )
}

export default DiscoverNavigation;