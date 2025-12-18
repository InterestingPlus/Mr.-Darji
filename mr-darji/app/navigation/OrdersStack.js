import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OrdersListScreen from "../screens/order/OrdersListScreen";
import CreateOrderForm from "../screens/order/CreateOrder";
import OrderInfoScreen from "../screens/order/OrderInfoScreen";

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
        options={{ title: "All Orders" }}
      />

      <Stack.Screen
        name="CreateOrder"
        component={CreateOrderForm}
        options={{ title: "Create Order" }}
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrderInfoScreen}
        options={{ title: "Order Info" }}
      />
    </Stack.Navigator>
  );
}
