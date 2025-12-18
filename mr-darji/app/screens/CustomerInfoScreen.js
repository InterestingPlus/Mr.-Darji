import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
// If using custom SVG icons, import them here. Using placeholder implementation for context.
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../config";

import profilePicture from "../components/profilePicture";

// Arrow Left Icon (Used for Back Button)
const ArrowLeftIcon = ({ color = "#111418", size = 24 }) => (
  <Svg width={size} height={size} fill={color} viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></Path>
  </Svg>
);

// --- Component for a single Measurement Row ---

const MeasurementRow = ({ label, value, isLeftColumn }) => (
  <View
    style={[
      styles.measurementItem,
      styles.borderTop,
      isLeftColumn ? styles.pr2 : styles.pl2,
    ]}
  >
    <Text style={styles.measurementLabel}>{label}</Text>
    <Text style={styles.measurementValue}>{value}</Text>
  </View>
);

// --- Component for a Category of Measurements (Shirt/Pant) ---

const MeasurementCategory = ({ title, measurements }) => {
  // Convert measurements object into an array of [label, value] pairs
  const measurementEntries = Object.entries(measurements);

  return (
    <View>
      <Text style={styles.categoryTitle}>{title}</Text>

      {/* Measurement Grid */}
      <View style={styles.measurementGrid}>
        {measurementEntries.map(([label, value], index) => (
          <MeasurementRow
            key={label}
            label={label}
            value={value}
            // Alternate columns: 0, 2, 4... are left (pr-2) | 1, 3, 5... are right (pl-2)
            isLeftColumn={index % 2 === 0}
          />
        ))}
      </View>
    </View>
  );
};

// --- Main Customer Info Screen Component ---

export default function CustomerInfoScreen({ route, navigation }) {
  const { customer_id, customer: temp = {} } = route.params || {};

  if (!customer_id) {
    return (
      <View style={styles.fullScreenContainer}>
        <Text style={styles.noDataText}>Customer ID not found.</Text>
      </View>
    );
  }

  const [customer, setCustomer] = useState(temp || {});
  const [measurements, setMeasurements] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await axios.get(
          `${BASE_URL}/api/customers/${customer_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const apiData = response.data.data;

        if (apiData) {
          setCustomer(apiData);
        } else {
          throw new Error("No Data. Found");
        }
      } catch (e) {
        console.error("Failed to fetch customer:", e);
      }
    };

    fetchCustomer();
  }, [customer_id]);

  const [activeTab, setActiveTab] = useState("Measurements");

  const handleBackPress = () => navigation.goBack();

  // --- Tab Content Renderer ---
  const renderTabContent = () => {
    if (activeTab === "Measurements") {
      return (
        <View style={styles.tabContentContainer}>
          {Object.entries(measurements).map(([categoryTitle, measures]) => (
            <MeasurementCategory
              key={categoryTitle}
              title={categoryTitle}
              measurements={measures}
            />
          ))}
        </View>
      );
    } else if (activeTab === "Orders") {
      return (
        <View style={styles.tabContentContainer}>
          <Text style={styles.noDataText}>Orders history will be here.</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.fullScreenContainer}>
      {/* Header Area */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Profile</Text>
        {/* Spacer to align title center */}
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileDetailsContainer}>
            {/* Avatar */}
            <Image
              source={{
                uri: profilePicture(customer),
              }}
              style={styles.profileAvatar}
              accessibilityLabel={`${customer?.full_name}'s profile picture`}
            />
            {/* Text Content */}
            <View style={styles.profileTextGroup}>
              <Text style={styles.profileNameText}>{customer?.full_name}</Text>
              <Text style={styles.profileDetailText}>{customer?.phone}</Text>
              <Text style={styles.profileDetailText}>{customer?.address}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            {/* Measurements Tab */}
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "Measurements"
                  ? styles.activeTabButton
                  : styles.inactiveTabButton,
              ]}
              onPress={() => setActiveTab("Measurements")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Measurements"
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                Measurements
              </Text>
            </TouchableOpacity>

            {/* Orders Tab */}
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "Orders"
                  ? styles.activeTabButton
                  : styles.inactiveTabButton,
              ]}
              onPress={() => setActiveTab("Orders")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Orders"
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        <View>
          <TouchableOpacity
            onPress={() => navigation.replace("NewOrder")}
            style={{
              backgroundColor: "#333",
              padding: 15,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
              Create Order
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f4",
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#111418",
  },
  profileSection: { padding: 16 },
  profileDetailsContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  profileAvatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#ccc",
    marginBottom: 8,
  },
  profileTextGroup: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileNameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111418",
    marginBottom: 4,
  },
  profileDetailText: { fontSize: 16, fontWeight: "400", color: "#617589" },
  tabsContainer: { paddingBottom: 12, backgroundColor: "#fff" },
  tabsWrapper: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dbe0e6",
  },
  tabButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginRight: 24,
  },
  activeTabButton: { borderBottomWidth: 3, borderBottomColor: "#111418" },
  inactiveTabButton: { borderBottomWidth: 3, borderBottomColor: "transparent" },
  tabText: { fontSize: 14, fontWeight: "bold", letterSpacing: 0.2 },
  activeTabText: { color: "#111418" },
  inactiveTabText: { color: "#617589" },
  tabContentContainer: { paddingHorizontal: 16 },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111418",
    paddingVertical: 12,
    paddingTop: 16,
  },
  measurementGrid: { flexDirection: "row", flexWrap: "wrap", padding: 0 },
  measurementItem: {
    width: "50%",
    flexDirection: "column",
    gap: 4,
    paddingVertical: 16,
  },
  borderTop: { borderTopWidth: 1, borderTopColor: "#dbe0e6" },
  pr2: { paddingRight: 8 },
  pl2: { paddingLeft: 8 },
  measurementLabel: { fontSize: 14, fontWeight: "400", color: "#617589" },
  measurementValue: { fontSize: 14, fontWeight: "400", color: "#111418" },
  noDataText: {
    fontSize: 16,
    color: "#617589",
    textAlign: "center",
    paddingVertical: 40,
  },
  bottomSpacer: { height: 20 },
});
