import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ServicesListScreen from '../screens/settings/profile/ServicesListScreen';
import AddEditServiceScreen from '../screens/settings/profile/AddEditServiceScreen';
import ServiceDetailViewScreen from '../screens/settings/profile/ServiceDetailsScreen';
import ShopProfileScreen from '../screens/settings/profile/ShopProfileScreen';
import EditShopProfileScreen from '../screens/settings/profile/EditShopProfileScreen';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: 'Main Settings' }}
      />

      <Stack.Screen
        name="ShopProfile"
        component={ShopProfileScreen}
        options={{ title: 'Shop Profile' }}
      />

      <Stack.Screen
        name="EditShopProfile"
        component={EditShopProfileScreen}
        options={{ title: 'Edit Shop Profile' }}
      />

      <Stack.Screen
        name="ServicesList"
        component={ServicesListScreen}
        options={{ title: 'Services' }}
      />

      <Stack.Screen
        name="AddEditService"
        component={AddEditServiceScreen}
        options={{ title: 'Services' }}
      />

      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailViewScreen}
        options={{ title: 'Service' }}
      />
    </Stack.Navigator>
  );
}
