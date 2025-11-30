import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";

import CustomerInfoScreen from "../screens/CustomerInfoScreen";
import NewOrderScreen from "../screens/NewOrderScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
// <Stack.Screen name="CustomerInfo" component={CustomerInfoScreen} />
// <Stack.Screen name="NewOrder" component={NewOrderScreen} />
