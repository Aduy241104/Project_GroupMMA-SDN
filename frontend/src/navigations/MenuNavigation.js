import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button } from 'react-native';

const Stack = createNativeStackNavigator();


const Temp = ({ navigation }) => {
    return (
        <View>
            <Text>Làm thì xóa component này</Text>
            <Button
                title="Đi đến Login"
                onPress={ () => navigation.navigate('Login') }
            />
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