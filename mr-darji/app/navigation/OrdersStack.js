import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OrdersListScreen from "../screens/OrdersListScreen";
import CreateOrderForm from "../screens/CreateOrder";
import OrderInfo from "../screens/OrderInfo";

const Stack = createNativeStackNavigator();

export default function OrdersStack() {
  return (
    <Stack.Navigator
      initialRouteName="OrdersList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="OrdersList"
        component={OrdersListScreen}
        options={{ title: "All Customers" }}
      />

      <Stack.Screen
        name="CreateOrder"
        component={CreateOrderForm}
        options={{ title: "Add Customer" }}
      />

      <Stack.Screen
        name="OrderInfo"
        component={OrderInfo}
        options={{ title: "Customer Profile" }}
      />
    </Stack.Navigator>
  );
}
