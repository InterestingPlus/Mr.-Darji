import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Svg, { Path } from 'react-native-svg';
import BASE_URL from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import profilePicture from '../../components/profilePicture';

// MagnifyingGlassIcon component
const MagnifyingGlassIcon = ({ color = '#617589', size = 24 }) => (
  <Svg width={size} height={size} fill={color} viewBox="0 0 256 256">
    <Path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></Path>
  </Svg>
);

// PlusIcon component
const PlusIcon = ({ color = '#FFFFFF', size = 24 }) => (
  <Svg width={size} height={size} fill={color} viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></Path>
  </Svg>
);

// --- Customer List Item Component ---
const CustomerListItem = ({ customer, navigation }) => {
  const handlePress = () => {
    navigation.navigate('CustomerProfile', {
      customer_id: customer.customer_id,
      customer,
    });
  };

  return (
    <TouchableOpacity style={styles.listItemContainer} onPress={handlePress}>
      {/* image_url का उपयोग करें */}
      <Image
        source={{ uri: profilePicture(customer) }}
        style={styles.avatar}
        accessibilityLabel={`${customer.full_name}'s profile picture`}
      />
      {/* Text Content */}
      <View style={styles.textContainer}>
        {/* full_name का उपयोग करें */}
        <Text style={styles.nameText} numberOfLines={1}>
          {customer.full_name}
        </Text>
        {/* phone का उपयोग करें */}
        <Text style={styles.phoneText} numberOfLines={1}>
          {customer.phone}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Main Customers Screen Component ---

export default function CustomersScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem('userToken');

        const response = await axios.get(`${BASE_URL}/api/customers`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const apiData = response.data.data;

        if (Array.isArray(apiData)) {
          setCustomers(apiData);
        } else {
          throw new Error(
            "Invalid data format: Expected an array under the 'data' key.",
          );
        }
      } catch (e) {
        console.error('Failed to fetch customers:', e);
        setError(`Failed to load customers: ${e.message || 'Network Error'}`);
      } finally {
        // Axios अनुरोध रद्द होने पर भी, लोडिंग को रोकें

        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    customer =>
      // full_name और phone का उपयोग करें
      customer.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.phone.includes(searchText),
  );

  const handleAddCustomer = () => {
    navigation.navigate('AddCustomer');
  };

  if (isLoading) {
    return (
      <View style={[styles.fullScreenContainer, styles.centerScreen]}>
        <ActivityIndicator size="large" color="#1380ec" />
        <Text style={styles.loadingText}>Loading customers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.fullScreenContainer, styles.centerScreen]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubText}>
          Could not fetch data from the server.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      {/* Header Area */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
      </View>

      {/* Scrollable Content (Search and List) */}
      <ScrollView style={styles.scrollContent}>
        {/* Search Bar (वही रहेगा) */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBarInputGroup}>
            <View style={styles.searchIconContainer}>
              <MagnifyingGlassIcon />
            </View>
            <TextInput
              placeholder="Search customers"
              placeholderTextColor="#617589"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Customer List / Empty State / No Results */}
        <View style={styles.listSection}>
          {customers.length === 0 && searchText === '' ? (
            <View style={styles.emptyListContainer}>
              <Text style={styles.noResultsText}>No customers added yet.</Text>
              <Text style={styles.errorSubText}>
                Tap the '+' button to add your first customer.
              </Text>
            </View>
          ) : filteredCustomers.length === 0 ? (
            <Text style={styles.noResultsText}>
              No customers found matching "{searchText}"
            </Text>
          ) : (
            filteredCustomers.map(customer => (
              <CustomerListItem
                key={customer.customer_id}
                customer={customer}
                navigation={navigation}
              />
            ))
          )}
        </View>

        {/* Bottom Spacer/Padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleAddCustomer}
          activeOpacity={0.8}
        >
          <PlusIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Stylesheet (वही रहेगा) ---
const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#617589',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e63946',
    textAlign: 'center',
    marginBottom: 5,
  },
  errorSubText: {
    fontSize: 14,
    color: '#617589',
    textAlign: 'center',
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBarInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#f0f2f4',
    borderRadius: 8,
  },
  searchIconContainer: {
    paddingLeft: 16,
    height: '100%',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#111418',
  },
  listSection: {
    // Corresponds to the main content div below the search bar
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f4',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: '#ccc',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111418',
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#617589',
  },
  noResultsText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#617589',
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 8,
    backgroundColor: '#1380ec',
    paddingHorizontal: 24,
    minWidth: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  bottomSpacer: {
    height: 76,
  },
});
