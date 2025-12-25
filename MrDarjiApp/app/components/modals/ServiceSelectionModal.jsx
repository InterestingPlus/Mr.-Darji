// components/modals/ServiceSelectionModal.js

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

const ServiceSelectionModal = ({
  isVisible,
  onClose,
  onSelectService,
  allServices,
  isLoading, // New Prop for Loading State
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    if (!searchQuery) return allServices;
    const query = searchQuery.toLowerCase();
    return allServices.filter(s => s.name.toLowerCase().includes(query));
  }, [searchQuery, allServices]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={modalStyles.listItem}
      onPress={() => {
        onSelectService(item);
        onClose();
      }}
    >
      <View>
        <Text style={modalStyles.listItemName}>{item.name}</Text>
        <Text style={modalStyles.listItemPhone}>
          Price: ₹{item.price} | Est. Days: {item.estimated_days}
        </Text>
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
          <Text style={modalStyles.modalTitle}>Select Service</Text>

          <TextInput
            style={modalStyles.searchInput}
            placeholder="Search Service Name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Note: navigation is not defined here unless passed or used via hook */}
          <TouchableOpacity
            style={modalStyles.addNewButton}
            onPress={() => {
              navigation.navigate('Settings', { screen: 'ServicesList' });
            }}
          >
            <Text style={modalStyles.addNewButtonText}>
              Manage Your Service
            </Text>
          </TouchableOpacity>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#5083FF"
              style={modalStyles.loadingIndicator}
            />
          ) : (
            <FlatList
              data={filteredServices}
              renderItem={renderItem}
              keyExtractor={item => item.service_id}
              style={modalStyles.listContainer}
              ListEmptyComponent={
                <Text style={modalStyles.emptyText}>No services found.</Text>
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

// --- STYLES (ServiceSelectionModal) ---
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

export default ServiceSelectionModal;
