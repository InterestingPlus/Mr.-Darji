import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen";
import ServicesListScreen from "../screens/ServicesListScreen";
import AddEditServiceScreen from "../screens/AddEditServiceScreen";
import ServiceDetailViewScreen from "../screens/ServiceDetailsScreen";
import ShopProfileScreen from "../screens/ShopProfileScreen";
import EditShopProfileScreen from "../screens/EditShopProfileScreen";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Main Settings" }}
      />

      <Stack.Screen
        name="ShopProfile"
        component={ShopProfileScreen}
        options={{ title: "Shop Profile" }}
      />

      <Stack.Screen
        name="EditShopProfile"
        component={EditShopProfileScreen}
        options={{ title: "Edit Shop Profile" }}
      />

      <Stack.Screen
        name="ServicesList"
        component={ServicesListScreen}
        options={{ title: "Services" }}
      />

      <Stack.Screen
        name="AddEditService"
        component={AddEditServiceScreen}
        options={{ title: "Services" }}
      />

      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailViewScreen}
        options={{ title: "Service" }}
      />
    </Stack.Navigator>
  );
}
