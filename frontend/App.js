import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

const Stack = createNativeStackNavigator();

const TestComp = () => {
  return (
    <View>
      <Text>HELLO WORLD</Text>
    </View>
  )
}

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestComp}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
