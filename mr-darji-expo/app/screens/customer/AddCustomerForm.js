import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import BASE_URL from "../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Sample Data ---
const GENDERS = ["Male", "Female", "Other"];
const AVAILABLE_TAGS = ["VIP", "New Lead", "Wholesale", "Retail", "Online"];

const saveCustomerApi = async (customerData) => {
  console.log("customerData", customerData);

  if (customerData.phone === "9999999999") {
    reject(new Error("Phone number is invalid."));
    return {
      surccess: false,
      message: "Phone number is invalid.",
    };
  }

  const token = await AsyncStorage.getItem("userToken");

  const response = await axios.post(
    `${BASE_URL}/api/customers/add`,
    {
      fullName: customerData?.fullName,
      phone: customerData?.phone,
      gender: customerData?.gender,
      address: customerData?.address,
      tags: customerData?.tags,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status == 200) {
    return {
      success: true,
      message: `Customer ${customerData.fullName} added successfully!`,
    };
  }
};

// --- Custom Components ---

// Multi-select for Tags
const TagsMultiSelect = ({ selectedTags, onToggleTag }) => (
  <View style={tagsStyles.container}>
    {AVAILABLE_TAGS.map((tag) => (
      <TouchableOpacity
        key={tag}
        style={[
          tagsStyles.tag,
          selectedTags.includes(tag) && tagsStyles.selectedTag,
        ]}
        onPress={() => onToggleTag(tag)}
      >
        <Text
          style={[
            tagsStyles.tagText,
            selectedTags.includes(tag) && tagsStyles.selectedTagText,
          ]}
        >
          {tag}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// --- Main Form Component ---

export default function AddCustomerForm({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(GENDERS[0]); // Default to first gender
  const [address, setAddress] = useState("");
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 1. Tags Handler
  const toggleTag = (tag) => {
    setTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  // 2. Validation Logic
  const validate = () => {
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!phone.match(/^\d{10}$/)) newErrors.phone = "Phone must be 10 digits.";
    if (!gender) newErrors.gender = "Gender is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3. Submission Handler
  const handleSaveCustomer = async () => {
    if (!validate()) {
      // Show first error in toast for immediate feedback
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: errors[firstErrorKey],
          position: "top",
        });
      }
      return;
    }

    const customerData = { fullName, phone, gender, address, tags };

    setIsLoading(true);

    try {
      const response = await saveCustomerApi(customerData);

      // Success Handling
      if (response.success) {
        // 🚀 Smooth Vibration Feedback
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        Toast.show({
          type: "success",
          text1: "Success! 🎉",
          text2: response.message,
          position: "top",
        });

        // 📝 Reset Form
        setFullName("");
        setPhone("");
        setAddress("");
        setGender(GENDERS[0]);
        setTags([]);
        setErrors({});

        navigation.navigate("CustomersList");
      }
    } catch (error) {
      // 🚨 Error Handling
      Toast.show({
        type: "error",
        text1: "API Error",
        text2: error.message || "Something went wrong on the server.",
        position: "top",
      });
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Add New Customer</Text>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            navigation.navigate("Customers", { screen: "CustomersList" })
          }
        >
          <Text style={styles.cancelIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Full Name Input */}
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[styles.input, errors.fullName && styles.inputError]}
          placeholder="Enter full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        {errors.fullName && (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        )}

        {/* Phone Input */}
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Enter 10-digit phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        {/* Address Input */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input]}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />

        {/* Gender Picker */}
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {GENDERS.map((g) => (
              <Picker.Item key={g} label={g} value={g} />
            ))}
          </Picker>
        </View>

        {/* Tags Multi-select */}
        <Text style={styles.label}>Tags (Multi-select)</Text>
        <TagsMultiSelect selectedTags={tags} onToggleTag={toggleTag} />
      </ScrollView>

      {/* Save Customer Button */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSaveCustomer}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Customer</Text>
        )}
      </TouchableOpacity>

      {/* Toast Message Component */}
      <Toast />
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#f9f9f9",
  },

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

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#e74c3c", // Red border for error
    borderWidth: 2,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  pickerContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerItem: {
    fontSize: 16,
  },
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#a9c7ff", // Lighter shade when disabled/loading
  },
});

const tagsStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 5,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedTag: {
    backgroundColor: "#5083FF",
    borderColor: "#5083FF",
  },
  tagText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedTagText: {
    color: "#fff",
  },
});
