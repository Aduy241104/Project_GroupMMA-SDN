import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button } from 'react-native';
import MenuScreen from "../screens/MenuScreen";
import Profile from '../screens/Profile'
import UpdateProfileScreen from "../screens/UpdateProfileScreen";
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

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
            <Stack.Screen name="Main Menu" component={ MenuScreen } />
            <Stack.Screen name="profile" component={ Profile } />
            <Stack.Screen name="update-profile" component={ UpdateProfileScreen } />
            <Stack.Screen name="change-password" component={ ChangePasswordScreen } />
        </Stack.Navigator>
    )
}

export default MenuNavigation;