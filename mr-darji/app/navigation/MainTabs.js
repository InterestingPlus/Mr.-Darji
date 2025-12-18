import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBarIcon from "../components/CustomTabBarIcon";

import DashboardScreen from "../screens/DashboardScreen";
import CustomersStack from "./CustomersStack";
import OrdersStack from "./OrdersStack";
import SettingsStack from "./SettingsStack";
import AnalyticsStack from "./AnalyticsStack";

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

      {/* Report & Analytics */}
      <Tab.Screen
        name="Report"
        component={AnalyticsStack}
        options={{
          tabBarLabel: ({ focused }) => null,
          tabBarIcon: ({ focused, route }) => (
            <CustomTabBarIcon route={{ name: "Report" }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsStack}
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
