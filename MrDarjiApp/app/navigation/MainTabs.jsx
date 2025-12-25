import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CustomTabBarIcon from '../components/CustomTabBarIcon';

import DashboardScreen from '../screens/DashboardScreen';
import CustomersStack from './CustomersStack';
import OrdersStack from './OrdersStack';
import SettingsStack from './SettingsStack';
import AnalyticsStack from './AnalyticsStack';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon route={{ name: 'Home' }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          unmountOnBlur: false,
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon route={{ name: 'Orders' }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Customers"
        component={CustomersStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon route={{ name: 'Customers' }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Report"
        component={AnalyticsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon route={{ name: 'Report' }} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon route={{ name: 'Settings' }} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
