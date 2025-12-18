import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert, // Added Alert for mock navigation
} from "react-native";
import Svg, { Path } from "react-native-svg";
import BASE_URL from "../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- SVG Components (No Change) ---

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

/**
 * UPDATED: OrderItem is now wrapped in TouchableOpacity and accepts onPress.
 */
const OrderItem = ({ order, onPress }) => {
  // 👈 Added onPress prop
  // ISO date string को DD/MM फॉर्मेट में बदलने के लिए
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // भारतीय संदर्भ के लिए dd/mm/yyyy
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString; // Fallback
    }
  };

  const deliveryDateFormatted = formatDate(order.delivery_date);
  const isUrgent = order.urgent === "TRUE";
  const finalPrice = (
    parseFloat(order.total_price) - parseFloat(order.discount)
  ).toFixed(2);

  return (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => onPress(order)} // 👈 Call onPress with order data
      activeOpacity={0.7} // Visual feedback on tap
    >
      <View style={styles.orderDetailContainer}>
        {/* Row 1: Customer Name & Urgent Tag */}
        <View style={styles.customerRow}>
          <Text style={styles.customerName} numberOfLines={1}>
            {order.customer}
          </Text>
          {isUrgent && (
            <View style={styles.urgentTag}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>

        {/* Row 2: Order ID & Status */}
        <View style={styles.detailRow}>
          <Text style={styles.orderNumber}>{`Order #${order.id}`}</Text>
          <Text
            style={[
              styles.orderStatusText,
              order.status === "Completed" && styles.statusCompleted,
            ]}
          >
            {order.status.toUpperCase()}
          </Text>
        </View>

        {/* Row 3: Price & Delivery Date */}
        <View style={styles.detailRow}>
          <Text style={styles.priceText}>
            Price: ₹{finalPrice}
            {order.discount > 0 && (
              <Text style={styles.discountText}> ({order.discount}% Off)</Text>
            )}
          </Text>
          <Text style={styles.dateText}>
            Deliver By: {deliveryDateFormatted}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FilterTab = ({ tab, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.filterTab, isActive && styles.filterTabActive]}
  >
    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
      {tab.label}
    </Text>
  </TouchableOpacity>
);

export default function OrdersListScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [activeFilterKey, setActiveFilterKey] = useState("All");

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const apiData = response.data.data || [];
      setOrders(apiData);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      const errorMessage =
        e.response?.data?.message || e.message || "An unknown error occurred.";
      setError(`Failed to load orders: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATED: 'pending' status को 'In Progress' में जोड़ा गया है
  const FILTER_TABS = [
    { label: "All", key: "All", statuses: orders?.map((o) => o.status) },
    {
      label: "In Progress",
      key: "InProgress",
      statuses: ["Received", "Cutting", "Stitching", "pending"], // 'pending' जोड़ा गया
    },
    { label: "Completed", key: "Completed", statuses: ["Completed"] },
    { label: "Awaiting Payment", key: "AwaitingPayment", statuses: [] },
    { label: "Shipped", key: "Shipped", statuses: [] },
    { label: "On Hold", key: "OnHold", statuses: [] },
  ];

  const activeFilter = FILTER_TABS.find((tab) => tab.key === activeFilterKey);

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      activeFilterKey === "All" || activeFilter.statuses.includes(order.status);

    const searchMatch =
      order.customer.toLowerCase().includes(searchText.toLowerCase()) ||
      String(order.id).includes(searchText);

    return statusMatch && searchMatch;
  });

  // --- New Handler for Item Press ---
  const handleOrderPress = (order) => {
    // Navigate to the Order Details Page (assuming the screen name is 'OrderDetails')
    // Aapke pichle response mein is page ka naam OrderDetailsAndEditScreen tha.
    // Main yahan 'OrderDetails' use kar raha hoon for standard navigation naming.
    // Aap isko apne actual screen name se replace kar sakte hain.
    navigation.navigate("OrderDetails", {
      orderData: order,
    });

    // Fallback/Test Alert
    // Alert.alert("Navigate", `Opening Order ID: ${order.id} for ${order.customer}`);
  };

  // --- List Content Rendering ---
  const renderListContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerMessage}>
          <ActivityIndicator size="large" color="#51946b" />
          <Text style={styles.messageText}>Loading Orders...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerMessage}>
          <Text style={styles.errorText}>⚠️ Error</Text>
          <Text style={styles.messageText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryButtonText}>Tap to Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (orders.length === 0) {
      return (
        <View style={styles.centerMessage}>
          <Text style={styles.messageTitle}>No Orders Found</Text>
          <Text style={styles.messageText}>
            It looks like you haven't created any orders yet.
          </Text>
          <Text style={styles.messageText}>
            Tap the **+** button to create your first order!
          </Text>
        </View>
      );
    }

    if (
      filteredOrders.length === 0 &&
      (searchText || activeFilterKey !== "All")
    ) {
      return (
        <View style={styles.centerMessage}>
          <Text style={styles.messageTitle}>No Results</Text>
          <Text style={styles.messageText}>
            No orders match your current search or filter.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => String(item.id)} // Ensure key is string
        renderItem={({ item }) => (
          <OrderItem
            order={item}
            onPress={handleOrderPress} // 👈 Pass the handler
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };
  // --- End List Content Rendering ---

  return (
    <View style={styles.screenContainer}>
      {/* Header, Search Bar, Filter Tabs (No Change) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <View style={styles.searchIcon}>
            <MagnifyingGlassIcon color="#617589" size={24} />
          </View>
          <TextInput
            placeholder="Search orders by customer or ID"
            placeholderTextColor="#617589"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.filterStrip}>
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
              onPress={() => {
                setActiveFilterKey(tab.key);
                setSearchText("");
              }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Orders List / Loading / Error / Empty State */}
      {renderListContent()}

      {/* Floating Action Button (FAB) (No Change) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate("CreateOrder");
        }}
      >
        <PlusIcon color="#fff" size={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- Existing Styles (Unchanged) ---
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f4",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111418",
  },
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
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111418",
    borderRadius: 8,
  },
  filterStrip: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomColor: "#f0f2f4",
    borderBottomWidth: 1,
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
    backgroundColor: "#51946b",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111418",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 80, // FAB के लिए जगह
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f2f4",
    marginHorizontal: 16,
  },

  // --- Order List Styles (UPDATED - OrderItem is now TouchableOpacity) ---
  orderItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    minHeight: 90,
    paddingVertical: 12,
  },
  orderDetailContainer: {
    flex: 1,
  },

  // Row Styles
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },

  // Customer Name
  customerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111418",
    marginRight: 8,
    flexShrink: 1,
  },
  // Urgent Tag
  urgentTag: {
    backgroundColor: "#E53E3E",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },

  // Order ID
  orderNumber: {
    fontSize: 14,
    fontWeight: "400",
    color: "#617589",
  },

  // Status
  orderStatusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    textTransform: "uppercase",
  },
  statusCompleted: {
    color: "#51946b",
  },

  // Price & Discount
  priceText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111418",
  },
  discountText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#E53E3E",
  },

  // Delivery Date
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A5568",
  },

  // --- Loading/Error/Empty Styles (Unchanged) ---
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111418",
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: "#617589",
    textAlign: "center",
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E53E3E",
    marginBottom: 10,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f2f4",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#111418",
    fontWeight: "600",
  },

  // --- Floating Action Button (FAB) Style (Unchanged) ---
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#4299e1",
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
