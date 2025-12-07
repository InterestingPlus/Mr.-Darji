import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/DashboardScreen";

import CustomTabBarIcon from "../components/CustomTabBarIcon";
import SettingsScreen from "../screens/SettingsScreen";
import CustomersStack from "./CustomersStack";
import OrdersStack from "./OrdersStack";

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
        component={OrdersStack}
        options={{
          unmountOnBlur: false,
          tabBarLabel: ({ focused }) => null,
          tabBarIcon: ({ focused, route }) => (
            <CustomTabBarIcon route={{ name: "Orders" }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Customers"
        component={CustomersStack}
        options={{
          tabBarLabel: ({ focused }) => null,
          tabBarIcon: ({ focused, route }) => (
            <CustomTabBarIcon route={{ name: "Customers" }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
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
