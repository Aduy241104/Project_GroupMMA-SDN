import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import MostViewScreen from "../screens/MostViewScreen";

const Stack = createNativeStackNavigator();

const DiscoverNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="main discover" component={ HomeScreen } />
            <Stack.Screen name="favorite" component={ HomeScreen } />
            <Stack.Screen name="mostView" component={ MostViewScreen } />
        </Stack.Navigator>
    )
}

export default DiscoverNavigation;