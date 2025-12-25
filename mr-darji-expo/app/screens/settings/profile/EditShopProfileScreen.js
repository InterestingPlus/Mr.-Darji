// EditShopProfileScreen.js - UPDATED (NO CUSTOM INPUT COMPONENTS)

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Icon, Button, Divider } from "react-native-elements";
import BASE_URL from "../../../config";
import axios from "axios";

/* ---------------- MOCK DATA ---------------- */
const mockShopData = {
  name: "Ramesh Tailors & Boutique",
  tagline: "Custom Stitching Since 1995",
  shopType: "Boutique",
  phone: "+91 98765 43210",
  alternatePhone: "+91 88888 77777",
  whatsappNumber: "9876543210",
  line1: "Shop No 10, Near City Mall",
  city: "Jaipur",
  pincode: "302001",
  googleMap: "https://maps.app.goo.gl/example",
  instagram: "ramesh.tailors",
  facebook: "rameshTailorsJaipur",
  website: "https://ramesh-tailors.com",
  description: "We specialize in high-end ethnic and western wear for women...",
  experienceYears: 25,
  specialities: ["Blouse Design", "Bridal Wear"],
};

/* ---------------- CONSTANTS ---------------- */
const SHOP_TYPES = [
  "Tailor",
  "Boutique",
  "Fashion Designer",
  "Men Tailor",
  "Women Tailor",
  "Unisex",
];

const AVAILABLE_TAGS = [
  "Shirt Stitching",
  "Pant Stitching",
  "Kurta Pajama",
  "Blouse Design",
  "Bridal Wear",
  "Lehenga Choli",
  "Alterations",
  "Kids Wear",
  "Uniform Stitching",
  "Western Gowns",
];

const MAX_TAGS = 5;

/* ---------------- TAG SELECTOR ---------------- */
const TagsMultiSelect = ({ selectedTags, onToggleTag }) => (
  <View style={tagsStyles.container}>
    {AVAILABLE_TAGS.map((tag) => {
      const isSelected = selectedTags.includes(tag);
      return (
        <TouchableOpacity
          key={tag}
          style={[tagsStyles.tag, isSelected && tagsStyles.selectedTag]}
          onPress={() => onToggleTag(tag)}
          disabled={!isSelected && selectedTags.length >= MAX_TAGS}
        >
          <Text
            style={[
              tagsStyles.tagText,
              isSelected && tagsStyles.selectedTagText,
            ]}
          >
            {tag}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

/* ---------------- SHOP TYPE SELECTOR ---------------- */
const ShopTypeSelector = ({ value, onSelect }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={shopTypeStyles.input}
        onPress={() => setVisible(true)}
      >
        <Text style={shopTypeStyles.inputText}>
          {value || "Select your primary shop category"}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={shopTypeStyles.modalOverlay}>
          <View style={shopTypeStyles.modalContent}>
            <FlatList
              data={SHOP_TYPES}
              keyExtractor={(i) => i}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={shopTypeStyles.option}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={shopTypeStyles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={shopTypeStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

/* ---------------- SCREEN ---------------- */
const EditShopProfileScreen = ({ route, navigation }) => {
  const shopData = route?.params?.shopData || mockShopData;

  const initialState = {
    name: "",
    tagline: "",
    shopType: "",
    phone: "",
    alternatePhone: "",
    whatsappNumber: "",
    line1: "",
    city: "",
    pincode: "",
    googleMap: "",
    instagram: "",
    facebook: "",
    website: "",
    description: "",
    experienceYears: "",
    specialities: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: "Edit Shop Profile" });

    if (shopData) {
      setFormData({
        name: shopData.name || "",
        tagline: shopData.tagline || "",
        shopType: shopData.shopType || "",
        phone: shopData.contact.phone || "",
        alternatePhone: shopData.alternatePhone || "",
        whatsappNumber: shopData.whatsappNumber || "",
        line1: shopData?.contact?.address?.line1 || "",
        city: shopData?.contact?.address?.city || "",
        pincode: String(shopData?.contact?.address?.pincode || ""),
        googleMap: shopData.googleMap || "",
        instagram: shopData.instagram || "",
        facebook: shopData.facebook || "",
        website: shopData.website || "",
        description: shopData.description || "",
        experienceYears: String(shopData.experienceYears || ""),
        specialities: shopData.specialities || [],
      });
    }
  }, [navigation, shopData]);

  const handleChange = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleToggleTag = (tag) => {
    setFormData((p) => ({
      ...p,
      specialities: p.specialities.includes(tag)
        ? p.specialities.filter((t) => t !== tag)
        : p.specialities.length < 5
        ? [...p.specialities, tag]
        : p.specialities,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.shopType || !formData.phone) {
      Alert.alert("Error", "Name, Shop Type & Phone required");
      return;
    }

    setIsSaving(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      await axios.put(
        `${BASE_URL}/api/profile`,
        {
          ...formData,
          experienceYears: Number(formData.experienceYears || 0),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", "Profile updated");
      navigation.navigate("Settings", { screen: "ShopProfile" });
    } catch {
      Alert.alert("Error", "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Basic Info</Text>

          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(t) => handleChange("name", t)}
          />

          <Text style={styles.label}>Tagline</Text>
          <TextInput
            style={styles.input}
            value={formData.tagline}
            onChangeText={(t) => handleChange("tagline", t)}
          />

          <Text style={styles.label}>Shop Type</Text>
          <ShopTypeSelector
            value={formData.shopType}
            onSelect={(v) => handleChange("shopType", v)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Contact</Text>

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(t) => handleChange("phone", t)}
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(t) => handleChange("city", t)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>About</Text>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            value={formData.description}
            onChangeText={(t) => handleChange("description", t)}
          />

          <Text style={styles.label}>Specialities</Text>
          <TagsMultiSelect
            selectedTags={formData.specialities}
            onToggleTag={handleToggleTag}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Cancel" type="outline" onPress={navigation.goBack} />
        <Button title="Save" loading={isSaving} onPress={handleSave} />
      </View>
    </View>
  );
};

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContent: { padding: 20 },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionHeader: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  multiline: { minHeight: 100 },
  footer: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
});

const tagsStyles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  tag: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTag: { backgroundColor: "#222", borderColor: "#222" },
  tagText: { fontSize: 13 },
  selectedTagText: { color: "#fff" },
});

const shopTypeStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  inputText: { fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 20 },
  option: { padding: 15 },
  optionText: { fontSize: 14 },
  cancelText: { color: "red", textAlign: "center", marginTop: 10 },
});

export default EditShopProfileScreen;
