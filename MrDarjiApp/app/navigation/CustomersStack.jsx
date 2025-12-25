import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomersScreen from '../screens/customer/CustomersScreen';
import AddCustomerForm from '../screens/customer/AddCustomerForm';
import CustomerInfoScreen from '../screens/customer/CustomerInfoScreen';

const Stack = createNativeStackNavigator();

export default function CustomersStack() {
  return (
    <Stack.Navigator
      initialRouteName="CustomersList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="CustomersList"
        component={CustomersScreen}
        options={{ title: 'All Customers' }}
      />

      <Stack.Screen
        name="AddCustomer"
        component={AddCustomerForm}
        options={{ title: 'Add Customer' }}
      />

      <Stack.Screen
        name="CustomerProfile"
        component={CustomerInfoScreen}
        options={{ title: 'Customer Profile' }}
      />
    </Stack.Navigator>
  );
}
