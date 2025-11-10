import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button } from 'react-native';
import MenuScreen from "../screens/MenuScreen";
import Profile from '../screens/Profile'
import UpdateProfileScreen from "../screens/UpdateProfileScreen";
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ReadingHistoryScreen from "../screens/ReadingHistoryScreen";
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


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

    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            // Reset stack mỗi khi bấm lại vào tab Settings
            navigation.navigate('Settings', {
                screen: 'Main Menu', // 👈 reset về screen đầu tiên
            });
        });

        return unsubscribe;
    }, [navigation]);
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main Menu" component={ MenuScreen } />
            <Stack.Screen name="profile" component={ Profile } />
            <Stack.Screen name="update-profile" component={ UpdateProfileScreen } />
            <Stack.Screen name="change-password" component={ ChangePasswordScreen } />
            <Stack.Screen name="history" component={ ReadingHistoryScreen } />
        </Stack.Navigator>
    )
}

export default MenuNavigation;