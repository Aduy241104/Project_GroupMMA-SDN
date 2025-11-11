import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import ManageCommentsScreen from "../screens/ManageCommentsScreen.js";

const Stack = createNativeStackNavigator();

const Temp = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ManageComments")}
      >
        <Text style={styles.buttonText}>Quản lý Comments</Text>
      </TouchableOpacity>
    </View>
  );
};


const AdminNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="main Admin" component={Temp} />
      <Stack.Screen
        name="ManageComments"
        component={ManageCommentsScreen}
        options={{ title: "Quản lý Comments" }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});