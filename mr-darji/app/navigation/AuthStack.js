import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import MainTabs from "./MainTabs";

import CustomerInfoScreen from "../screens/CustomerInfoScreen";
import NewOrderScreen from "../screens/NewOrderScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />

      <Stack.Screen name="CustomerInfo" component={CustomerInfoScreen} />
      <Stack.Screen name="NewOrder" component={NewOrderScreen} />
    </Stack.Navigator>
  );
}
