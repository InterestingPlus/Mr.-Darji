import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AnalyticsScreen from "../screens/AnalyticsScreen";

const Stack = createNativeStackNavigator();

export default function AnalyticsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Analytics"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: "Main Settings" }}
      />
    </Stack.Navigator>
  );
}
