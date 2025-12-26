// components/modals/CustomerSelectionModal.js

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator, // Added Loading Indicator
} from 'react-native';
// import { useNavigation } from "@react-navigation/native"; // Assuming navigation is available if used

// const navigation = useNavigation();

const CustomerSelectionModal = ({
  isVisible,
  onClose,
  onSelectCustomer,
  allCustomers,
  navigation,
  selected,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return allCustomers;
    const query = searchQuery.toLowerCase();
    return allCustomers.filter(
      c => c.full_name.toLowerCase().includes(query) || c.phone.includes(query),
    );
  }, [searchQuery, allCustomers]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        ...modalStyles.listItem,
        backgroundColor:
          item.customer_id === selected?.customer_id ? '#e3ffe5ff' : '#fff',
        padding: item.customer_id === selected?.customer_id ? 10 : 0,
        borderRadius: item.customer_id === selected?.customer_id ? 8 : 0,
      }}
      onPress={() => {
        onSelectCustomer(item);
        onClose();
      }}
    >
      <View>
        <Text style={modalStyles.listItemName}>{item.full_name}</Text>
        <Text style={modalStyles.listItemPhone}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Select Customer</Text>

          <TextInput
            style={modalStyles.searchInput}
            placeholder="Search by Name or Phone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {/* Note: navigation is not defined here unless passed or used via hook */}
          <TouchableOpacity
            style={modalStyles.addNewButton}
            onPress={() => {
              navigation.navigate('Customers', {
                screen: 'AddCustomer',
                params: {
                  from: 'CreateOrder',
                },
              });
            }}
          >
            <Text style={modalStyles.addNewButtonText}>+ Add New Customer</Text>
          </TouchableOpacity>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#5083FF"
              style={modalStyles.loadingIndicator}
            />
          ) : (
            <FlatList
              data={filteredCustomers}
              renderItem={renderItem}
              keyExtractor={item => item.customer_id}
              style={modalStyles.listContainer}
              ListEmptyComponent={
                <Text style={modalStyles.emptyText}>No customers found.</Text>
              }
            />
          )}

          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- STYLES (CustomerSelectionModal) ---
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  searchInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  addNewButton: {
    backgroundColor: '#e0f0ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addNewButtonText: { color: '#5083FF', fontWeight: 'bold' },
  listContainer: { flexGrow: 0, maxHeight: 300 },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemName: { fontSize: 16, fontWeight: '600' },
  listItemPhone: { fontSize: 14, color: '#777' },
  emptyText: { textAlign: 'center', padding: 20, color: '#888' },
  closeButton: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: { color: '#333', fontWeight: '600' },
  loadingIndicator: { marginVertical: 40 },
});

export default CustomerSelectionModal;
