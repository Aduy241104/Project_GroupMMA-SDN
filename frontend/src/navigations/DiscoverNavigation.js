import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

const Stack = createNativeStackNavigator();


const Temp = () => {
    return (
        <View>
            <Text>Lam thi xoa component nay</Text>
        </View>
    )
}

const DiscoverNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="main discover" component={ Temp } />
        </Stack.Navigator>
    )
}

export default DiscoverNavigation;