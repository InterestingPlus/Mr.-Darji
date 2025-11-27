import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/DashboardScreen";
import OrdersListScreen from "../screens/OrdersListScreen";
import CustomersScreen from "../screens/CustomersScreen";

import CustomTabBarIcon from "../components/CustomTabBarIcon";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: ({ focused }) => null,
          tabBarIcon: ({ focused, route }) => (
            <CustomTabBarIcon route={{ name: "Home" }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersListScreen}
        options={{
          tabBarLabel: ({ focused }) => null,
          tabBarIcon: ({ focused, route }) => (
            <CustomTabBarIcon route={{ name: "Orders" }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Customers"
        component={CustomersScreen}
        options={{
          tabBarLabel: ({ focused }) => null,
          tabBarIcon: ({ focused, route }) => (
            <CustomTabBarIcon route={{ name: "Customers" }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={OrdersListScreen}
        options={{
          tabBarLabel: ({ focused }) => null,
          tabBarIcon: ({ focused, route }) => (
            <CustomTabBarIcon route={{ name: "Settings" }} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
