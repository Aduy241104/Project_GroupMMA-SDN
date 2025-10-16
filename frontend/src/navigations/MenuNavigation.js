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

const MenuNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main Menu" component={ Temp } />
        </Stack.Navigator>
    )
}

export default MenuNavigation;