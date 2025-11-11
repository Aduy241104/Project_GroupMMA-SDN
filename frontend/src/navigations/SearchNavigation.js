import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import SearchScreen from "../screens/SearchScreen";

const Stack = createNativeStackNavigator();


const Temp = () => {
    return (
        <View>
            <Text>Lam thi xoa component nay</Text>
        </View>
    )
}

const SearchNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="main search" component={ SearchScreen } />
        </Stack.Navigator>
    )
}

export default SearchNavigation;