// components/OrderItemInput.js

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import Toast from "react-native-toast-message";
import ServiceSelectionModal from "./modals/ServiceSelectionModal"; // Import the new modal

// --- SIMULATED DATA (Updated to reflect API structure) ---
const SIMULATED_DATA = {
  STAFF: [
    { id: "ST001", name: "Rahul" },
    { id: "ST002", name: "Priya" },
  ],
  // API services array mein yeh template field honi chahiye for consistency
  SERVICES: [
    {
      service_id: "S001",
      name: "Shirt Stitching",
      price: 500,
      estimated_days: 5,
      has_measurement: true,
      measurement_fields_template: [
        { key: "chest", label: "Chest", default: "38" },
        { key: "length", label: "Length", default: "30" },
      ],
    },
    {
      service_id: "S002",
      name: "Pant Stitching",
      price: 600,
      estimated_days: 6,
      has_measurement: true,
      measurement_fields_template: [
        { key: "waist", label: "Waist", default: "32" },
        { key: "inseam", label: "Inseam", default: "30" },
      ],
    },
    {
      service_id: "S003",
      name: "Repairing/Alteration",
      price: 150,
      estimated_days: 2,
      has_measurement: false,
      measurement_fields_template: [],
    },
  ],
};
// --- END SIMULATED DATA ---

// --- Custom Input Field Modal ---
const CustomInputFieldModal = ({ isVisible, onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
      setInputValue("");
      onClose();
    } else {
      Toast.show({
        type: "error",
        text1: "Input Missing",
        text2: "Field name cannot be empty.",
      });
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modal2Styles.centeredView}>
        <View style={modal2Styles.inputModalView}>
          <Text style={modal2Styles.modalTitle}>Add New Measurement Field</Text>
          <TextInput
            style={modal2Styles.inputField}
            placeholder="Enter field name (e.g., Shoulder Width)"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <View style={modal2Styles.inputModalActions}>
            <TouchableOpacity
              style={[
                modal2Styles.inputModalButton,
                { backgroundColor: "#ddd" },
              ]}
              onPress={onClose}
            >
              <Text style={{ color: "#333", fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                modal2Styles.inputModalButton,
                { backgroundColor: "#5083FF" },
              ]}
              onPress={handleConfirm}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Add Field
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- Dynamic Measurement Editor Component ---
const DynamicMeasurementEditor = ({
  measurementFields,
  onChange,
  serviceName,
}) => {
  const [showInputModal, setShowInputModal] = useState(false);

  const handleAddField = () => {
    setShowInputModal(true);
  };

  const handleConfirmNewField = (label) => {
    const newKey = label.toLowerCase().replace(/[^a-z0-9]/g, "_");

    if (measurementFields[newKey] !== undefined) {
      Toast.show({
        type: "error",
        text1: "Key Exists",
        text2: "Please enter a unique field name.",
      });
      return;
    }

    onChange({
      ...measurementFields,
      [newKey]: { label: label, value: "" },
    });
  };

  const handleDeleteField = (key, label) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the field: "${label}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newFields = { ...measurementFields };
            delete newFields[key];
            onChange(newFields);
          },
        },
      ]
    );
  };

  const handleValueChange = (key, value, label) => {
    onChange({
      ...measurementFields,
      [key]: { label: label, value: value },
    });
  };

  return (
    <View style={orderItemStyles.measurementSection}>
      <Text style={orderItemStyles.sectionTitle}>
        Measurements ({serviceName})
      </Text>

      {Object.entries(measurementFields).map(([key, field]) => (
        <View key={key} style={orderItemStyles.measurementFieldRow}>
          <Text style={orderItemStyles.measurementLabel}>{field.label}</Text>
          <TextInput
            style={orderItemStyles.measurementInput}
            value={field.value}
            onChangeText={(val) => handleValueChange(key, val, field.label)}
            placeholder={`Enter ${field.label}`}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => handleDeleteField(key, field.label)}
            style={orderItemStyles.measurementDeleteButton}
          >
            <Text style={orderItemStyles.measurementDeleteText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={orderItemStyles.addButton}
        onPress={handleAddField}
      >
        <Text style={orderItemStyles.addButtonText}>+ Add Custom Field</Text>
      </TouchableOpacity>

      <CustomInputFieldModal
        isVisible={showInputModal}
        onClose={() => setShowInputModal(false)}
        onConfirm={handleConfirmNewField}
      />
    </View>
  );
};

// --- Main Order Item Input Component ---
const OrderItemInput = ({
  item,
  index,
  onChange,
  onDelete,
  services,
  isLoadingServices,
}) => {
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Find the selected service details from the services array
  const service = services.find((s) => s.service_id === item.service_id);

  const handleServiceSelect = (selectedService) => {
    const service_id = selectedService.service_id;
    let newMeasurements = {};

    if (selectedService.has_measurement) {
      // FIX: Use the template from the selectedService object (API data)
      const template = selectedService.measurement_fields_template || [];
      newMeasurements = template.reduce(
        (acc, field) => ({
          ...acc,
          [field.key]: { label: field.label, value: field.default || "" },
        }),
        {}
      );
    }
    // Update the item state in the parent component
    onChange(index, { service_id, measurement_fields: newMeasurements });
  };

  const handleMeasurementFieldsChange = (newFields) => {
    onChange(index, { ...item, measurement_fields: newFields });
  };

  return (
    <View style={orderItemStyles.container}>
      <View style={orderItemStyles.header}>
        <Text style={orderItemStyles.title}>Item #{index + 1}</Text>
        <TouchableOpacity
          onPress={() => onDelete(index)}
          style={orderItemStyles.deleteButton}
        >
          <Text style={orderItemStyles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Service Selection Button */}
      <Text style={styles.label}>Service *</Text>
      <TouchableOpacity
        style={[
          styles.customerButton,
          { backgroundColor: service ? "#3498db" : "#5083FF" },
        ]}
        onPress={() => setShowServiceModal(true)}
      >
        <Text style={styles.customerButtonText}>
          {service ? service.name : "Tap to Select Service"}
        </Text>
      </TouchableOpacity>

      {/* Dynamic Measurement Editor */}
      {service && service.has_measurement && (
        <DynamicMeasurementEditor
          measurementFields={item.measurement_fields}
          onChange={handleMeasurementFieldsChange}
          serviceName={service.name}
        />
      )}

      {/* Item Notes and Quantity */}
      <Text style={styles.label}>Item Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Notes for this item (e.g., special buttons)"
        value={item.notes}
        onChangeText={(val) => onChange(index, { ...item, notes: val })}
        multiline
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={String(item.quantity)}
        onChangeText={(val) =>
          onChange(index, { ...item, quantity: parseInt(val) || 1 })
        }
        keyboardType="numeric"
      />

      <ServiceSelectionModal
        isVisible={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSelectService={handleServiceSelect}
        allServices={services}
        isLoading={isLoadingServices}
      />
    </View>
  );
};

export default OrderItemInput;

// --- STYLES FOR ORDER ITEM (Moved from main file for clean separation) ---
const styles = StyleSheet.create({
  // Replicating essential styles from parent for self-contained component
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 15,
    marginBottom: 5,
  },
  customerButton: {
    height: 50,
    backgroundColor: "#5083FF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  customerButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});

const orderItemStyles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  deleteButton: { padding: 5 },
  deleteButtonText: { color: "#e74c3c", fontSize: 14 },
  measurementSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  measurementFieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  measurementLabel: { fontSize: 14, color: "#333", flex: 1, marginRight: 10 },
  measurementInput: {
    flex: 2,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  measurementDeleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginLeft: 5,
  },
  measurementDeleteText: { color: "#e74c3c", fontWeight: "bold" },
  addButton: {
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonText: { color: "#333", fontWeight: "bold" },
});

const modal2Styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  inputModalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  inputField: {
    width: "100%",
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputModalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
});
