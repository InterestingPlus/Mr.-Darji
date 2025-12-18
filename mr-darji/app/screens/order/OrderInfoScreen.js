// OrderDetailsScreen.js

import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Icon, Divider, Badge, Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import BASE_URL from "../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Assuming you have custom components for complex fields

// --- MOCK DATA BASED ON SCHEMA ---
const mockOrderData = {
  order_id: "ORD1023",
  customer_id: "CUST001",
  delivery_date: "2025-12-18",
  urgent: true,
  status: "stitching",
  payment_status: "",
  total_price: 3500,
  discount: 500,
  due_amount: 1500,
  created_at: "2025-12-10",
  images: ["cloth.jpg", "ref1.jpg"],
  notes: "Customer requested a deep neck cut. Use pure cotton thread.",
  // Nested/Related Data (Fetched separately but combined here)
  customer: {
    full_name: "Anil Sharma",
    phone: "+91 98765 43210",
    address: "Shop 4, Near Bus Stand, Jaipur",
    tags: ["VIP"],
  },
  items: [
    {
      name: "Mens Shirt",
      price: 2000,
      estimated_days: 5,
      measurement_id: "M001",
    },
    {
      name: "Waistcoat",
      price: 1500,
      estimated_days: 7,
      measurement_id: "M002",
    },
  ],
  measurementSet: {
    // Combined measurements for M001 & M002
    M001: { service: "Shirt", fields: { Length: 30, Chest: 40, Sleeve: 25 } },
    M002: { service: "Waistcoat", fields: { Chest: 40, Waist: 38, Hip: 42 } },
  },
};

const ORDER_STATUSES = [
  "received",
  "cutting",
  "stitching",
  "ready",
  "delivered",
];

// --- CUSTOM COMPONENTS ---

// Function to calculate days left/delayed
const getDeliveryStatus = (deliveryDate, delivered_date) => {
  const delivery = new Date(deliveryDate);

  // delivered_date hai to wahi reference date, warna today
  const referenceDate = delivered_date ? new Date(delivered_date) : new Date();

  const diffTime = delivery.getTime() - referenceDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `${Math.abs(diffDays)} days delayed`,
      color: "error",
    };
  }

  if (diffDays <= 2) {
    return {
      label: `${diffDays} days left`,
      color: "warning",
    };
  }

  return {
    label: `${diffDays} days left`,
    color: "success",
  };
};

// --- COMPONENT FUNCTIONS ---

// SECTION 4: Measurements Card (Editable)
const MeasurementsSection = ({ measurementSet, onUpdateMeasurements }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editData, setEditData] = useState(measurementSet || {});

  useEffect(() => {
    if (measurementSet) {
      setEditData(measurementSet);
    }
  }, [measurementSet]);

  const handleFieldChange = (mId, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [mId]: {
        ...prev[mId],
        fields: { ...prev[mId].fields, [field]: value },
      },
    }));
  };

  const handleSave = () => {
    // Implement API call to save editData
    Alert.alert("Success", "Measurements updated (Mock API)");
    onUpdateMeasurements(editData);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.sectionHeader}
      >
        <Icon name="straighten" type="material" size={24} color="#333" />
        <Text style={styles.sectionTitle}>Measurements</Text>
        <Icon
          name={isExpanded ? "expand-less" : "expand-more"}
          type="material"
          color="#555"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View>
          <Divider style={{ marginVertical: 10 }} />

          {editData ? (
            Object.keys(editData)?.map((mId) => (
              <View key={mId} style={styles.measurementBlock}>
                <Text style={styles.measurementHeader}>
                  {editData[mId].service}
                </Text>

                {Object.entries(editData[mId]?.fields || {}).map(
                  ([field, value]) => (
                    <View key={field} style={styles.inputRow}>
                      <Text style={styles.inputLabel}>{field}:</Text>
                      <TextInput
                        style={styles.measurementInput}
                        value={String(value)}
                        onChangeText={(text) =>
                          handleFieldChange(
                            mId,
                            field,
                            text.replace(/[^0-9.]/g, "")
                          )
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  )
                )}
              </View>
            ))
          ) : (
            <ActivityIndicator size="small" color="#333" />
          )}

          {editData ? (
            <Button
              title="Save Measurements"
              onPress={handleSave}
              buttonStyle={styles.saveButton}
            />
          ) : (
            <ActivityIndicator size="small" color="#333" />
          )}
        </View>
      )}
    </View>
  );
};

// SECTION 5: Status Timeline & Update (Editable)
const StatusTimelineAndUpdater = ({
  currentStatus,
  onStatusChange,
  delivered_date,
}) => {
  const [nextStatus, setNextStatus] = useState(null);
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
  const nextIndex = currentIndex + 1;

  const isLastStatus = currentIndex === ORDER_STATUSES.length - 1;

  const handleUpdatePress = () => {
    if (isLastStatus)
      return Alert.alert(
        "Delivered",
        "This order is already marked as delivered."
      );
    setNextStatus(ORDER_STATUSES[nextIndex]);

    confirmUpdate();
  };

  const confirmUpdate = () => {
    if (nextStatus) {
      Alert.alert(
        "Confirm Status Update",
        `Change status from ${currentStatus.toUpperCase()} to ${nextStatus.toUpperCase()}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setNextStatus(null),
          },
          {
            text: "Confirm",
            onPress: () => {
              onStatusChange(nextStatus);
              setNextStatus(null);
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Order Status</Text>
      <View style={styles.timelineContainer}>
        {ORDER_STATUSES.map((status, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex + 1;

          let iconName, color;
          if (isActive && !isCurrent) {
            iconName = "check-circle";
            color = "#34C759";
          } else if (isCurrent) {
            iconName = "timelapse";
            color = "#FF9500";
          } else {
            iconName = "radio-button-unchecked";
            color = "#AAAAAA";
          }

          return (
            <View key={status} style={styles.timelineItem}>
              <View style={styles.timelineIcon}>
                <Icon name={iconName} type="material" size={20} color={color} />
              </View>

              {index < ORDER_STATUSES.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: isActive ? "#34C759" : "#DDD" },
                  ]}
                />
              )}

              <Text
                style={[
                  styles.timelineText,
                  { color: isCurrent ? "#FF9500" : "#333" },
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          );
        })}
      </View>

      <Button
        title={
          isLastStatus
            ? "Order Delivered '" +
              new Date(delivered_date)?.toLocaleDateString() +
              "'"
            : `Complete ${ORDER_STATUSES[nextIndex].toUpperCase()}`
        }
        onPress={handleUpdatePress}
        disabled={isLastStatus}
        buttonStyle={[
          styles.updateButton,
          isLastStatus && { backgroundColor: "#888" },
        ]}
      />
    </View>
  );
};

// SECTION 6: Payment Summary (Editable Action)
const PaymentSummary = ({ orderData, onPaymentStatusChange }) => {
  const { total_price, discount, payment_status } = orderData;

  let badgeColor;
  switch (payment_status) {
    case "":
      badgeColor = "#FF3B30";
      break;
    default:
      badgeColor = "#34C759";
  }

  const handleMarkPaid = () => {
    if (payment_status !== "") {
      return Alert.alert("Already Paid", "Payment is already Paid.");
    }

    Alert.alert(
      "Mark as Paid",
      "Are you sure you want to mark the remaining due amount as paid?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => onPaymentStatusChange() },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Payment Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Price:</Text>
        <Text style={styles.summaryValue}>₹{total_price}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Discount:</Text>
        <Text style={styles.summaryValue}>- ₹{discount}</Text>
      </View>
      <Divider style={{ marginVertical: 8 }} />

      {payment_status !== "" ? (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Paid Amount: </Text>
          <Text
            style={[
              styles.summaryValue,
              { color: "#34C759", fontWeight: "700" },
            ]}
          >
            ₹{total_price - discount}
          </Text>
        </View>
      ) : (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Due Amount:</Text>
          <Text
            style={[
              styles.summaryValue,
              {
                color: "#FF3B30",
                fontWeight: "700",
              },
            ]}
          >
            ₹{total_price - discount}
          </Text>
        </View>
      )}

      <Badge
        value={payment_status !== "" ? "Paid" : "Unpaid"}
        status="success"
        badgeStyle={[styles.paymentBadge, { backgroundColor: badgeColor }]}
      />

      <Button
        title={
          payment_status !== ""
            ? "Order Paid '" +
              new Date(payment_status)?.toLocaleDateString() +
              "'"
            : "Mark as Paid"
        }
        onPress={handleMarkPaid}
        disabled={payment_status !== ""}
        buttonStyle={[
          styles.saveButton,
          {
            backgroundColor: `${payment_status !== "" ? "#888" : "#282d32ff"}`,
            marginTop: 15,
          },
        ]}
      />
    </View>
  );
};

// --- MAIN SCREEN COMPONENT ---
export default function OrderInfoScreen({ route, navigation }) {
  // State to hold and manage the editable parts of the order
  const [orderState, setOrderState] = useState(route.params.orderData);
  const [isLoading, setIsLoading] = useState(false);

  const data = {
    created_at: "2025-12-08T02:26:39.633Z",
    customer: "Jatin Poriya",
    delivery_date: "2025-12-09",
    discount: "0",
    id: "1765160800254",
    payment_status: "",
    status: "pending",
    total_price: "250",
    updated_at: "2025-12-08T02:26:39.633Z",
    urgent: "FALSE",
  };

  async function fetchOrderData() {
    try {
      setIsLoading(true);

      const token = await AsyncStorage.getItem("userToken");

      const response = await axios.get(
        `${BASE_URL}/api/orders/${route.params.orderData.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("This is Order info", response?.data?.data);

      setOrderState(response?.data?.data);
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: `Order #${route.params.orderData.id}` });

    fetchOrderData();
  }, [navigation, route.params.orderData.id]);

  const deliveryInfo = getDeliveryStatus(
    orderState.delivery_date,
    orderState.delivered_date
  );

  // Handlers for Editable Sections
  const handleStatusChange = async (newStatus) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await axios.put(
        `${BASE_URL}/api/orders/status/${route.params.orderData.id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderState((prev) => ({ ...prev, status: newStatus }));
      fetchOrderData();

      if (newStatus === "ready") {
        const text = "Your order is Ready for pickup";

        Linking.openURL(
          `https://wa.me/91${orderState?.customer?.phone}?text=${text}`
        );
      }

      Alert.alert("Success", response.data.message);
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Error", "Failed to update order status.");
    }
  };

  const handlePaymentChange = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await axios.put(
        `${BASE_URL}/api/orders/payment/${route.params.orderData.id}`,
        {
          payment_status: new Date(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderState((prev) => ({
        ...prev,
        payment_status: new Date(),
      }));
      fetchOrderData();

      Alert.alert("Success", response.data.message);

      let text = `Your Payment Receipt : https://mr-darji.netlify.app/receipt/${route.params.orderData.id}`;

      Linking.openURL(
        `https://wa.me/91${
          orderState?.customer?.phone || ""
        }?text=${encodeURIComponent(text)}`
      );
    } catch (error) {
      console.error("payment", error);
      Alert.alert("Error", "Failed to update payment status.");
    }
  };

  const handleMeasurementsUpdate = (newMeasurements) => {
    setOrderState((prev) => ({ ...prev, measurementSet: newMeasurements }));
    // TODO: Call API
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      {/* SECTION 1: Order Header (Sticky - Fixed Position) */}
      <View style={styles.headerFixed}>
        <Text style={styles.headerOrderId}>
          ORDER #{route.params.orderData.id}
        </Text>
        <View style={styles.headerInfoRow}>
          <Badge
            value={orderState?.status?.toUpperCase()}
            status="primary"
            badgeStyle={[
              styles.statusBadge,
              {
                backgroundColor:
                  orderState.status === "delivered" ? "#34C759" : "#007AFF",
              },
            ]}
          />
          {orderState.urgent === "TRUE" && (
            <Badge
              value="⚠ URGENT"
              status="error"
              badgeStyle={styles.urgentBadge}
            />
          )}
        </View>
        <Text style={styles.headerDateInfo}>
          Delivery: {new Date(orderState.delivery_date).toLocaleDateString()} |
          <Text
            style={{
              color: deliveryInfo.color === "error" ? "#FF3B30" : "#FF9500",
            }}
          >
            {" " + deliveryInfo.label}
          </Text>
        </Text>
      </View>

      {/* Main Content ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        // To account for the fixed header
        contentInset={{ top: 90 }}
      >
        {/* 90px Spacer to prevent content from hiding behind the sticky header */}
        <View style={{ height: 90 }} />

        {/* SECTION 2: Customer Snapshot (Non-Editable Info) */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => Alert.alert("Navigate", "Opening Customer Profile")}
        >
          <View style={styles.sectionHeader}>
            <Icon name="person" type="material" size={24} color="#333" />
            <Text style={styles.sectionTitle}>Customer</Text>
            <Icon name="chevron-right" type="material" color="#555" />
          </View>
          <Divider style={{ marginVertical: 8 }} />

          {!isLoading ? (
            <>
              <Text style={styles.detailTextLarge}>
                {orderState?.customer?.full_name}
                {orderState?.customer?.tags?.map((tag) => (
                  <Text key={tag} style={styles.customerTag}>
                    {" "}
                    ({tag})
                  </Text>
                ))}
              </Text>
              <Text style={styles.detailText}>
                📞 {orderState.customer.phone}
              </Text>
              <Text style={styles.detailText}>
                📍 {orderState.customer.address}
              </Text>
            </>
          ) : (
            <ActivityIndicator size="small" color="#333" />
          )}
        </TouchableOpacity>

        {/* SECTION 3: Order Items & Services (Non-Editable Info) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items & Services</Text>
          <Divider style={{ marginVertical: 8 }} />

          {!isLoading ? (
            orderState?.items?.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>
                    {item.name} × {item.quantity}
                  </Text>

                  <Text style={styles.itemSubtitle}>
                    Est. Days: {item.estimated_days}
                  </Text>

                  <Text style={styles.itemSubtitle}>
                    Total: ₹{item.total_price}
                  </Text>
                </View>

                <Text style={styles.itemPrice}>₹{item.price}</Text>
              </View>
            ))
          ) : (
            <ActivityIndicator size="small" color="#333" />
          )}
        </View>

        {/* SECTION 4: Measurements (Editable Component) */}
        <MeasurementsSection
          measurementSet={orderState.measurementSet}
          onUpdateMeasurements={handleMeasurementsUpdate}
        />

        {/* SECTION 5: Status Timeline (Editable Component) */}
        <StatusTimelineAndUpdater
          currentStatus={orderState.status}
          onStatusChange={handleStatusChange}
          delivered_date={orderState.delivered_date}
        />

        {/* SECTION 9: Delivery Actions (Conditional) */}
        <View style={[styles.card, styles.deliveryActions]}>
          <Text style={styles.sectionTitle}>Delivery Actions</Text>
          {orderState?.status !== "ready" &&
          orderState?.status !== "delivered" ? (
            <Button
              title="Mark as Ready"
              onPress={() => {
                Alert.alert(
                  "Confirm Status Update",
                  `Change status to Ready?`,
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                      onPress: () => {},
                    },
                    {
                      text: "Confirm",
                      onPress: () => {
                        handleStatusChange("ready");
                      },
                    },
                  ]
                );
              }}
              buttonStyle={[
                styles.updateButton,
                {
                  backgroundColor: "#fff",
                  borderColor: "#34C759",
                  borderWidth: 1,
                },
              ]}
              titleStyle={{ color: "#34C759" }}
              containerStyle={{ marginBottom: 10 }}
            />
          ) : null}

          {orderState?.payment_status === "" ? (
            <Button
              title="Send Bill"
              onPress={() => {
                let text = `Hi, here's the link to your Invoice: https://mr-darji.netlify.app/bill/${route.params.orderData.id}`;

                Linking.openURL(
                  `https://wa.me/91${
                    orderState?.customer?.phone || ""
                  }?text=${encodeURIComponent(text)}`
                );
              }}
              type="outline"
              buttonStyle={[
                styles.updateButton,
                { backgroundColor: "#34C759" },
              ]}
              titleStyle={{ color: "#fff" }}
            />
          ) : null}
        </View>

        {/* SECTION 6: Payment Summary (Editable Component) */}
        <PaymentSummary
          orderData={orderState}
          onPaymentStatusChange={handlePaymentChange}
        />

        {/* SECTION 7: Images & Attachments */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Images & Attachments ({orderState?.images?.length})
          </Text>
          <View style={styles.imageGrid}>
            {orderState?.images?.map((img, index) => (
              <View key={index} style={styles.imagePlaceholder}>
                <Text style={{ fontSize: 10 }}>{img}</Text>
              </View>
            ))}
            {/* Action to add image */}
            <TouchableOpacity
              style={styles.imagePlaceholderAdd}
              onPress={() => Alert.alert("Action", "Open Camera/Gallery")}
            >
              <Icon
                name="add-a-photo"
                type="material"
                size={30}
                color="#007AFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 8: Notes & Activity Log */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notes</Text>
          {/* <Text style={styles.sectionSubtitle}>Internal Notes (Editable)</Text> */}
          <TextInput
            style={styles.notesInput}
            multiline
            value={orderState.notes}
            onChangeText={(text) =>
              setOrderState((prev) => ({ ...prev, notes: text }))
            }
            placeholder="Add internal notes..."
          />
          <Button
            title="Save Notes"
            buttonStyle={[styles.saveButton, { marginBottom: 15 }]}
            onPress={() => Alert.alert("Success", "Notes Saved")}
          />

          {/* <Text style={styles.sectionSubtitle}>Activity Log (Audit Trail)</Text>
          <View style={styles.activityLog}>
            <Text style={styles.logItem}>
              • Status changed to Received (10 Dec)
            </Text>
            <Text style={styles.logItem}>
              • Payment of ₹2000 added (11 Dec)
            </Text>
            <Text style={styles.logItem}>
              • Staff changed to Ramesh (12 Dec)
            </Text>
          </View> */}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  // SECTION 1: Fixed Header Styles
  headerFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    zIndex: 10,
  },
  headerOrderId: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  headerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  statusBadge: {
    marginRight: 10,
    paddingHorizontal: 8,
    height: 24,
  },
  urgentBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    height: 24,
  },
  headerDateInfo: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  // General Sections
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginLeft: 10,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
    marginBottom: 5,
  },
  // SECTION 2: Customer Snapshot
  detailTextLarge: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 3,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  customerTag: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "bold",
  },
  // SECTION 3: Order Items
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#777",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  // SECTION 4: Measurements (Editable)
  measurementBlock: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#F0F0F0",
  },
  measurementHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  inputLabel: {
    width: 80,
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  measurementInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#FF9500",
    borderRadius: 8,
    marginTop: 10,
  },
  // SECTION 5: Status Timeline (Editable)
  timelineContainer: {
    flexDirection: "column",
    paddingLeft: 10,
    marginBottom: 15,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  timelineIcon: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    zIndex: 2,
  },
  timelineLine: {
    position: "absolute",
    top: 25,
    bottom: -5,
    left: 20,
    width: 2,
    zIndex: 1,
  },
  timelineText: {
    marginLeft: 15,
    fontSize: 14,
    fontWeight: "600",
  },
  updateButton: {
    backgroundColor: "#FF9500",
    borderRadius: 8,
  },
  // SECTION 6: Payment Summary
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  paymentBadge: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 12,
  },
  // SECTION 7: Images
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 10,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  imagePlaceholderAdd: {
    width: 80,
    height: 80,
    backgroundColor: "#E6F0FF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  // SECTION 8: Notes & Activity Log
  notesInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  activityLog: {
    paddingLeft: 10,
    marginTop: 5,
  },
  logItem: {
    fontSize: 13,
    color: "#666",
    paddingVertical: 3,
  },
});
