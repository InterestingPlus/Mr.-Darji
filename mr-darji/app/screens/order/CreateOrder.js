import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../../config";
import ServiceSelectionModal from "../../components/modals/ServiceSelectionModal";
import CustomerSelectionModal from "../../components/modals/CustomerSelectionModal";

// import { useNavigation } from "@react-navigation/native";

// const navigation = useNavigation();

// --- SIMULATED DATA & API FUNCTIONS (UNCHANGED) ---

const SIMULATED_DATA = {
  MEASUREMENT_FIELDS2: {
    "20250112T1015": [
      { key: "chest", label: "Chest", default: "38" },
      { key: "length", label: "Length", default: "30" },
    ],
  },
  STAFF: [
    { id: "ST001", name: "Rahul" },
    { id: "ST002", name: "Priya" },
  ],
};

// --- MODAL COMPONENTS (Customer & Service Selection - UNCHANGED) ---

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
              <Text style={modal2Styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                modal2Styles.inputModalButton,
                { backgroundColor: "#5083FF" },
              ]}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Add Field</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- DYNAMIC MEASUREMENT EDITOR COMPONENT (UPDATED for Alert.prompt) ---
const DynamicMeasurementEditor = ({
  measurementFields,
  onChange,
  serviceName,
}) => {
  const [showInputModal, setShowInputModal] = useState(false);

  // 1. UPDATED: Handle adding a new field using Alert.prompt
  const handleAddField = () => {
    setShowInputModal(true);
  };

  const handleConfirmNewField = (label) => {
    // Create a clean key (e.g., "Shoulder Width" -> "shoulder_width")
    const newKey = label.toLowerCase().replace(/[^a-z0-9]/g, "_");

    // Check for existing key
    if (measurementFields[newKey] !== undefined) {
      Toast.show({
        type: "error",
        text1: "Key Exists",
        text2: "Please enter a unique field name.",
      });
      return;
    }

    // Update state with the new field
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
            placeholder={`Value`}
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

export default function CreateOrderForm({ navigation }) {
  const [customer, setCustomer] = useState({});
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [orderItems, setOrderItems] = useState([]);

  // Delivery Date State
  const today = new Date();
  // Use Date object for internal state
  const [deliveryDateObj, setDeliveryDateObj] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [staffAssigned, setStaffAssigned] = useState(
    SIMULATED_DATA.STAFF[0].id
  );
  const [totalDiscount, setTotalDiscount] = useState("0");
  const [payableAmount, setPayableAmount] = useState("0");
  const [orderNotes, setOrderNotes] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [services, setServices] = useState([]);

  useEffect(() => {
    const calculated = calculateTotalPrice - (parseFloat(totalDiscount) || 0);
    setPayableAmount(calculated.toString());
  }, [calculateTotalPrice, totalDiscount]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await axios.get(`${BASE_URL}/api/services`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const apiData = response.data.data;
        setServices(apiData || []);
      } catch (e) {
        console.error("Failed to fetch services:", e);
        Toast.show({
          type: "error",
          text1: "Failed to load services",
          text2: e.message || "Network Error",
        });
      }
    };

    fetchServices();
  }, []);

  // --- Dynamic Calculations ---
  const calculateTotalPrice = useMemo(() => {
    return orderItems.reduce((total, item) => {
      const service = services.find((s) => s.service_id === item.service_id);
      return total + (service ? service.price * item.quantity : 0);
    }, 0);
  }, [orderItems]);

  useEffect(() => {
    const calculated = calculateTotalPrice - (parseFloat(totalDiscount) || 0);
    setPayableAmount(calculated.toString());
  }, [calculateTotalPrice, totalDiscount]);

  // ... (Customer and Item Handlers - UNCHANGED)

  const handleSelectCustomer = useCallback((selectedCustomer) => {
    setCustomer(selectedCustomer);
  }, []);

  const handleAddItem = () => {
    setOrderItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        service_id: "",
        quantity: 1,
        measurement_fields: {},
      },
    ]);
  };

  const handleItemChange = (index, updatedFields) => {
    setOrderItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, ...updatedFields } : item
      )
    );
  };

  const handleItemDelete = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const formatDeliveryDate = (date) => {
    // 💡 FIX: Date ko local time zone (YYYY-MM-DD) mein format karne ka tarika.
    // getFullYear(), getMonth() (+1), getDate() use karte hain taaki Timezone shift na ho.
    const year = date.getFullYear();
    // getMonth() 0-indexed hota hai, isliye +1 zaroori hai.
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await axios.get(`${BASE_URL}/api/customers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const apiData = response.data.data;
        setCustomers(apiData);
      } catch (e) {
        console.error("Failed to fetch customer:", e);
        Toast.show({
          type: "error",
          text1: "Failed to load customer",
          text2: e.message || "Network Error",
        });
      }
    };

    fetchCustomer();
  }, []);

  const [measurementFields, setMeasurementFields] = useState();
  useEffect(() => {
    // fetch Measurement
    const fetchMeasurement = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await axios.get(`${BASE_URL}/api/measurement`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const apiData = response.data.data;
        setMeasurementFields(apiData);
        console.log(apiData);
      } catch (e) {
        console.error("Failed to fetch measurement:", e);
        Toast.show({
          type: "error",
          text1: "Failed to load measurement",
          text2: e.message || "Network Error",
        });
      }
    };

    fetchMeasurement();
  }, [customer]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deliveryDateObj;

    // Hide the picker immediately on Android/Web
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }

    // Ensure date is not in the past (simplified check, native handles this better)
    if (currentDate >= today) {
      setDeliveryDateObj(currentDate);
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid Date",
        text2: "Delivery date cannot be in the past.",
      });
      setDeliveryDateObj(today); // Reset to today
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!customer) newErrors.customer = "Please select a customer.";
    if (orderItems.length === 0)
      newErrors.items = "Order must contain at least one item.";
    if (orderItems.some((item) => !item.service_id))
      newErrors.service = "All items must have a service selected.";
    if (deliveryDateObj <= today)
      newErrors.deliveryDate = "Valid future delivery date required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveOrder = async () => {
    if (!validate()) {
      Toast.show({
        type: "error",
        text1: "Validation Failed",
        text2: Object.values(errors)[0],
      });
      return;
    }

    const orderData = {
      customer_id: customer.customer_id,
      staff_assigned_id: staffAssigned,
      status: "pending",
      total_price: parseFloat(payableAmount),
      discount: parseFloat(totalDiscount),
      delivery_date: formatDeliveryDate(deliveryDateObj),
      urgent: isUrgent,
      notes: orderNotes,

      items: orderItems.map((item) => ({
        service_id: item.service_id,
        quantity: item.quantity,
        measurement_data: item.measurement_fields,
      })),
    };

    // customer_id,
    // staff_assigned_id,
    // status,
    // total_price,
    // discount,
    // delivery_date,
    // urgent,
    // notes,

    // measurement,
    // service_id,

    // due_amount,
    // images ,
    // payment_status,

    console.log("Order Data:", orderData);

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await axios.post(
        `${BASE_URL}/api/orders/create`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        Toast.show({
          type: "success",
          text1: "Order Created",
          text2: "Order created successfully.",
        });

        navigation.navigate("Orders", { screen: "OrdersList" });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: error.message || "Server error during creation.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- ORDER ITEM INPUT & MAIN FORM (MODIFIED) ---

  const OrderItemInput = ({
    item,
    index,
    onChange,
    onDelete,
    services,
    measurementFields,
  }) => {
    const [showServiceModal, setShowServiceModal] = useState(false);

    const service = services.find((s) => s.service_id === item.service_id);

    const handleServiceSelect = (selectedService) => {
      const service_id = selectedService.service_id;
      let newMeasurements = {};
      const template = measurementFields[service_id] || [];

      console.log(template);

      newMeasurements = template.reduce((acc, field) => {
        return {
          ...acc,
          [field.key]: { label: field.label, value: field.default || "" },
        };
      }, {});

      console.log(newMeasurements);

      onChange(index, { service_id, measurement_fields: newMeasurements });
    };

    const handleMeasurementFieldsChange = (newFields) => {
      onChange(index, { ...item, measurement_fields: newFields });
    };

    const updateQty = (val) => {
      const newQty = Math.max(1, item.quantity + val);
      onChange(index, { ...item, quantity: newQty });
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
        {service && (
          <DynamicMeasurementEditor
            measurementFields={item.measurement_fields}
            onChange={handleMeasurementFieldsChange}
            serviceName={service.name}
          />
        )}

        {/* <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={String(item.quantity)}
          onChangeText={(val) =>
            onChange(index, { ...item, quantity: parseInt(val) || 1 })
          }
          keyboardType="numeric"
        /> */}

        {service ? (
          <>
            <Text style={styles.label}>Quantity</Text>
            {/* 💡 Quantity with Buttons */}
            <View style={orderItemStyles.qtyContainer}>
              <TouchableOpacity
                style={orderItemStyles.qtyBtn}
                onPress={() => updateQty(-1)}
              >
                <Text style={orderItemStyles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <TextInput
                style={orderItemStyles.qtyInput}
                value={String(item.quantity)}
                keyboardType="numeric"
                onChangeText={(val) =>
                  onChange(index, { ...item, quantity: parseInt(val) || 1 })
                }
              />
              <TouchableOpacity
                style={orderItemStyles.qtyBtn}
                onPress={() => updateQty(1)}
              >
                <Text style={orderItemStyles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        <ServiceSelectionModal
          isVisible={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          onSelectService={handleServiceSelect}
          allServices={services}
          navigation={navigation}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Orders", { screen: "OrdersList" })}
      >
        <Text>
          <Icon name="arrow-left" size={24} color="#000" /> 
          Back
        </Text>
      </TouchableOpacity>

      <Text style={styles.header}>Create New Order</Text> */}

      <View style={styles.headerRow}>
        <Text style={styles.header}>New Order</Text>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            navigation.navigate("Orders", { screen: "OrdersList" })
          }
        >
          <Text style={styles.cancelIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. Customer Selection */}
        <Text style={styles.label}>Select Customer *</Text>
        <TouchableOpacity
          style={[styles.customerButton, errors.customer && styles.inputError]}
          onPress={() => setShowCustomerModal(true)}
        >
          <Text style={styles.customerButtonText}>
            {customer?.full_name
              ? `${customer?.full_name} (${customer?.phone})`
              : "Tap to Select Customer"}
          </Text>
        </TouchableOpacity>
        {errors.customer && (
          <Text style={styles.errorText}>{errors.customer}</Text>
        )}

        <View style={styles.divider} />

        {/* 2. Dynamic Order Items */}
        <Text style={styles.sectionTitle}>Order Items</Text>
        {errors.items && <Text style={styles.errorText}>{errors.items}</Text>}
        {orderItems.map((item, index) => (
          <OrderItemInput
            key={item.id}
            item={item}
            index={index}
            onChange={handleItemChange}
            onDelete={handleItemDelete}
            services={services}
            measurementFields={measurementFields}
          />
        ))}

        <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
          <Text style={styles.addItemButtonText}>
            + Add Item (Pant/Shirt/etc.)
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 3. Financial & Delivery Details */}
        <Text style={styles.sectionTitle}>Order Details</Text>

        {/* Price/Discount (UNCHANGED) */}
        <Text style={styles.label}>Total Price (Calculated)</Text>
        <TextInput
          style={styles.inputDisabled}
          value={`₹${calculateTotalPrice.toFixed(2)}`}
          editable={false}
        />

        <Text style={styles.label}>Discount</Text>
        <TextInput
          style={styles.input}
          placeholder="Discount Amount (e.g., 50)"
          value={totalDiscount}
          onChangeText={setTotalDiscount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Final Payable Amount</Text>
        {/* <TextInput
          style={[styles.inputDisabled, styles.finalPrice]}
          value={`₹${finalPrice.toFixed(2)}`}
          editable={false}
        /> */}

        <TextInput
          style={[styles.input, styles.finalPrice]}
          value={payableAmount}
          onChangeText={setPayableAmount}
          keyboardType="numeric"
        />

        {/* 💡 Delivery Date Picker Integration (NEW) */}
        <Text style={styles.label}>Delivery Date *</Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.dateInput,
            errors.deliveryDate && styles.inputError,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {formatDeliveryDate(deliveryDateObj)}
          </Text>
        </TouchableOpacity>
        {errors.deliveryDate && (
          <Text style={styles.errorText}>{errors.deliveryDate}</Text>
        )}

        {/* 💡 DateTimePicker Component */}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={deliveryDateObj}
            mode={"date"}
            display={Platform.OS === "ios" ? "spinner" : "default"} // iOS shows inline/spinner, Android shows modal
            minimumDate={today}
            onChange={handleDateChange}
            // iOS ke liye done button
            {...(Platform.OS === "ios" && {
              // iOS ke liye modal ko band karne ka button
              onModeChange: () => setShowDatePicker(false),
            })}
          />
        )}
        {/* iOS mein user ko modal band karne ke liye ek button chahiye hoga, jo hum DatePicker ke niche laga sakte hain */}
        {showDatePicker && Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.dateCloseButton}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={styles.dateCloseButtonText}>Done</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Staff Assigned</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={staffAssigned}
            onValueChange={setStaffAssigned}
            style={styles.picker}
          >
            {SIMULATED_DATA.STAFF.map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Order Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any special instructions or general notes"
          value={orderNotes}
          onChangeText={setOrderNotes}
          multiline
        />

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsUrgent((prev) => !prev)}
        >
          <View style={[styles.checkbox, isUrgent && styles.checkboxChecked]}>
            {isUrgent && <Text style={styles.checkboxTick}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Mark as Urgent</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button (Footer) */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSaveOrder}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Order</Text>
        )}
      </TouchableOpacity>

      {/* Modals and Toast */}
      <CustomerSelectionModal
        isVisible={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSelectCustomer={handleSelectCustomer}
        allCustomers={customers}
        navigation={navigation}
      />

      <Toast />
    </View>
  );
}

// --- STYLES (MODIFIED/ADDED STYLES) ---

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#f9f9f9" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 8,
  },
  cancelIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 15,
    marginBottom: 5,
  },

  // Inputs & Error
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputDisabled: {
    height: 50,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    fontSize: 16,
    color: "#333",
  },
  finalPrice: {
    fontWeight: "bold",
    backgroundColor: "#e9f2ff",
    color: "#5083FF",
  },
  inputError: { borderColor: "#e74c3c", borderWidth: 2 },
  errorText: { color: "#e74c3c", fontSize: 12, marginTop: 5, marginLeft: 5 },
  textArea: { height: 100, paddingTop: 15 },

  // Custom Date Input Style
  dateInput: { justifyContent: "center" },
  dateText: { fontSize: 16, color: "#333", fontWeight: "500" },

  // Customer/Service Selection Button
  customerButton: {
    height: 50,
    backgroundColor: "#5083FF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  customerButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // Quantity

  // Picker
  pickerContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%" },

  // Add Item Button
  addItemButton: {
    borderWidth: 1,
    borderColor: "#5083FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    borderStyle: "dashed",
  },
  addItemButtonText: { color: "#5083FF", fontWeight: "bold" },

  dateInput: { justifyContent: "center" },
  dateText: { fontSize: 16, color: "#333", fontWeight: "500" },

  // 💡 NEW: iOS Date Picker Close Button
  dateCloseButton: {
    backgroundColor: "#5083FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  dateCloseButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Footer Button
  button: {
    backgroundColor: "#5083FF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 15,
    height: 55,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  buttonDisabled: { backgroundColor: "#a9c7ff" },

  // Utility
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 20 },

  // Checkbox
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: "#5083FF",
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#5083FF" },
  checkboxTick: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  checkboxLabel: { fontSize: 16, color: "#333" },
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
    maxWidth: 90,
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

  qtyContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  qtyBtn: {
    width: 45,
    height: 45,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  qtyBtnText: { fontSize: 24, fontWeight: "bold", color: "#333" },
  qtyInput: {
    width: 60,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  dateModalView: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  }, // Style for DatePicker modal
  dateConfirmButton: { width: "100%", marginTop: 15 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  searchInput: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  addNewButton: {
    padding: 10,
    backgroundColor: "#e9f2ff",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#5083FF",
  },
  addNewButtonText: { color: "#5083FF", fontWeight: "bold" },
  listContainer: { maxHeight: 300, marginBottom: 15 },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listItemName: { fontSize: 16, fontWeight: "600" },
  listItemPhone: { fontSize: 14, color: "#777" },
  emptyText: { textAlign: "center", padding: 20, color: "#999" },
  closeButton: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  closeButtonText: { color: "#333", fontWeight: "bold" },
});

const modal2Styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  addNewButtonText: { color: "#5083FF", fontWeight: "bold" },

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
  inputField: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  inputModalActions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  inputModalButton: {
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
