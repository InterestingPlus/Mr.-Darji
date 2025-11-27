import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import Svg, { Path } from "react-native-svg";

// --- Static Data for Demonstration ---
const DEMO_ORDERS = [
  { id: "12345", customer: "Ethan Carter", status: "Received" },
  { id: "67890", customer: "Olivia Bennett", status: "Cutting" },
  { id: "24680", customer: "Noah Thompson", status: "Stitching" },
  { id: "13579", customer: "Ava Harper", status: "Completed" },
  { id: "98765", customer: "Liam Baker", status: "Received" },
  { id: "54321", customer: "Sophia King", status: "Completed" },
  { id: "10987", customer: "Mason Lee", status: "Stitching" },
  { id: "30291", customer: "Isabella Rodriguez", status: "Cutting" },
];

// Added more detailed mapping for filters to cover all demo statuses
const FILTER_TABS = [
  { label: "All", key: "All", statuses: DEMO_ORDERS.map((o) => o.status) },
  {
    label: "In Progress",
    key: "InProgress",
    statuses: ["Received", "Cutting", "Stitching"],
  },
  { label: "Completed", key: "Completed", statuses: ["Completed"] },
  { label: "Awaiting Payment", key: "AwaitingPayment", statuses: [] }, // No demo data for this yet
  { label: "Shipped", key: "Shipped", statuses: [] }, // No demo data for this yet
  { label: "On Hold", key: "OnHold", statuses: [] }, // No demo data for this yet
];

// --- SVG Components ---

const PlusIcon = ({ color = "currentColor", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
  </Svg>
);

const MagnifyingGlassIcon = ({ color = "currentColor", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
  </Svg>
);

// --- Individual Components ---

const OrderItem = ({ order }) => (
  <View style={styles.orderItem}>
    <View style={styles.orderTextContainer}>
      <Text style={styles.customerName} numberOfLines={1}>
        {order.customer}
      </Text>
      <Text
        style={styles.orderNumber}
        numberOfLines={1}
      >{`Order #${order.id}`}</Text>
    </View>
    <View style={styles.orderStatusContainer}>
      {/* Dynamic styling for 'Completed' status */}
      <Text
        style={[
          styles.orderStatusText,
          order.status === "Completed" && styles.statusCompleted,
        ]}
      >
        {order.status}
      </Text>
    </View>
  </View>
);

const FilterTab = ({ tab, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.filterTab, isActive && styles.filterTabActive]}
  >
    {/* Use the label property for display */}
    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
      {tab.label}
    </Text>
  </TouchableOpacity>
);

// --- Main Orders Screen Component ---

export default function OrdersListScreen() {
  const [searchText, setSearchText] = useState("");
  const [activeFilterKey, setActiveFilterKey] = useState("All");

  // Find the active filter object
  const activeFilter = FILTER_TABS.find((tab) => tab.key === activeFilterKey);

  // Filter orders based on status and search text
  const filteredOrders = DEMO_ORDERS.filter((order) => {
    // 1. Status Match
    const statusMatch =
      activeFilterKey === "All" || activeFilter.statuses.includes(order.status);

    // 2. Search Match
    const searchMatch =
      order.customer.toLowerCase().includes(searchText.toLowerCase()) ||
      order.id.includes(searchText);

    return statusMatch && searchMatch;
  });

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity style={styles.addButton}>
          <PlusIcon color="#111418" size={24} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <View style={styles.searchIcon}>
            <MagnifyingGlassIcon color="#617589" size={24} />
          </View>
          <TextInput
            placeholder="Search orders"
            placeholderTextColor="#617589"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterStrip}>
        {/* Use ScrollView for horizontal scrolling tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollView}
        >
          {FILTER_TABS.map((tab) => (
            <FilterTab
              key={tab.key}
              tab={tab}
              isActive={activeFilterKey === tab.key}
              onPress={() => setActiveFilterKey(tab.key)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      {/* Using FlatList for performant list rendering */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderItem order={item} />}
        contentContainerStyle={styles.listContent}
        // Optional: Add separator, pulling to refresh, etc.
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // --- Header Styles ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Changed to space-between for better alignment
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 48, // Increased top padding for better status bar clearance on mobile
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f4",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111418",
    flex: 1,
    textAlign: "center",
    // Removed marginLeft to simplify, using space-between on parent
  },
  addButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  // --- Search Bar Styles ---
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f4",
    borderRadius: 8,
    height: 48,
  },
  searchIcon: {
    paddingLeft: 16,
    color: "#617589",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    backgroundColor: "#f0f2f4",
    paddingHorizontal: 12, // Adjusted padding
    fontSize: 16,
    color: "#111418",
    borderRadius: 8,
  },

  // --- Filter Tabs Styles ---
  filterStrip: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomColor: "#f0f2f4",
    borderBottomWidth: 1, // Added border for separation
  },
  filterScrollView: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterTab: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f0f2f4",
    alignItems: "center",
    justifyContent: "center",
  },
  filterTabActive: {
    backgroundColor: "#51946b", // Active background: primary green
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111418", // Default text color
  },
  filterTextActive: {
    color: "#fff", // White text when active
    fontWeight: "600",
  },

  // --- Order List Styles (OrderItem) ---
  listContent: {
    paddingBottom: 20,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 12, // Increased vertical padding
  },
  orderTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    paddingRight: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111418",
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "400",
    color: "#617589",
  },
  orderStatusContainer: {
    minWidth: 80, // Ensure status has a consistent width
    alignItems: "flex-end",
  },
  orderStatusText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#111418",
  },
  statusCompleted: {
    // A subtle hint for completed status
    fontWeight: "600",
    color: "#51946b", // Primary green for success
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f2f4",
    marginHorizontal: 16,
  },
});
