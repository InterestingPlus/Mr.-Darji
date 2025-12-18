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
} from "react-native";
import { Icon, Divider, Badge, Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
// Assuming you have custom components for complex fields

// --- MOCK DATA BASED ON SCHEMA ---
const mockOrderData = {
  order_id: "ORD1023",
  customer_id: "CUST001",
  delivery_date: "2025-12-18",
  urgent: true,
  status: "stitching",
  payment_status: "partial",
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
const getDeliveryStatus = (deliveryDate) => {
  const today = new Date();
  const delivery = new Date(deliveryDate);
  const diffTime = delivery.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return { label: `${Math.abs(diffDays)} days delayed`, color: "error" };
  if (diffDays <= 2)
    return { label: `${diffDays} days left`, color: "warning" };
  return { label: `${diffDays} days left`, color: "success" };
};

// --- COMPONENT FUNCTIONS ---

// SECTION 4: Measurements Card (Editable)
const MeasurementsSection = ({ measurementSet, onUpdateMeasurements }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editData, setEditData] = useState(measurementSet);

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
          {Object.keys(editData)?.map((mId) => (
            <View key={mId} style={styles.measurementBlock}>
              <Text style={styles.measurementHeader}>
                {editData[mId].service} ({mId})
              </Text>

              {Object.entries(editData[mId].fields)?.map(([field, value]) => (
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
              ))}
            </View>
          ))}

          <Button
            title="Save Measurements"
            onPress={handleSave}
            buttonStyle={styles.saveButton}
          />
        </View>
      )}
    </View>
  );
};

// SECTION 5: Status Timeline & Update (Editable)
const StatusTimelineAndUpdater = ({ currentStatus, onStatusChange }) => {
  console.log("currentStatus", currentStatus);

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
              Alert.alert("Updated", `Status changed to ${nextStatus}`);
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
          const isCurrent = index === currentIndex;

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
            ? "Order Delivered"
            : `Mark as ${ORDER_STATUSES[nextIndex].toUpperCase()}`
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
  const {
    total_price,
    discount,
    paid_amount = orderData.total_price - orderData.due_amount,
    due_amount,
    payment_status,
  } = orderData;

  let badgeColor;
  switch (payment_status) {
    case "paid":
      badgeColor = "#34C759";
      break;
    case "partial":
      badgeColor = "#FF9500";
      break;
    default:
      badgeColor = "#FF3B30";
  }

  const handleMarkPaid = () => {
    if (due_amount <= 0 && payment_status === "paid") {
      return Alert.alert(
        "Already Paid",
        "Payment status is already marked as Paid."
      );
    }

    Alert.alert(
      "Mark as Full Paid",
      "Are you sure you want to mark the remaining due amount as paid?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => onPaymentStatusChange("paid") },
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
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Paid Amount:</Text>
        <Text
          style={[styles.summaryValue, { color: "#34C759", fontWeight: "700" }]}
        >
          ₹{paid_amount}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Due Amount:</Text>
        <Text
          style={[
            styles.summaryValue,
            {
              color: due_amount > 0 ? "#FF3B30" : "#34C759",
              fontWeight: "700",
            },
          ]}
        >
          ₹{due_amount}
        </Text>
      </View>
      <Badge
        value={payment_status.toUpperCase()}
        status="success"
        badgeStyle={[styles.paymentBadge, { backgroundColor: badgeColor }]}
      />

      <Button
        title="Mark Remaining Due as Paid"
        onPress={handleMarkPaid}
        disabled={payment_status === "paid"}
        buttonStyle={[
          styles.saveButton,
          { backgroundColor: "#007AFF", marginTop: 15 },
        ]}
      />
    </View>
  );
};

// --- MAIN SCREEN COMPONENT ---
export default function OrderInfoScreen({ route, navigation }) {
  // State to hold and manage the editable parts of the order
  const [orderState, setOrderState] = useState(route.params.orderData);

  console.log(orderState);
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

  useEffect(() => {
    navigation.setOptions({ title: `Order #${orderState.order_id}` });
  }, [navigation, orderState.order_id]);

  const deliveryInfo = getDeliveryStatus(orderState.delivery_date);

  // Handlers for Editable Sections
  const handleStatusChange = (newStatus) => {
    setOrderState((prev) => ({ ...prev, status: newStatus }));
    // TODO: Call API
  };

  const handlePaymentChange = (newStatus) => {
    // Mock logic: If marked 'paid', set due_amount to 0
    const newDue = newStatus === "paid" ? 0 : mockOrderData.due_amount;
    const newPaid =
      newStatus === "paid"
        ? mockOrderData.total_price
        : mockOrderData.total_price - mockOrderData.due_amount;

    setOrderState((prev) => ({
      ...prev,
      payment_status: newStatus,
      due_amount: newDue,
      paid_amount: newPaid,
    }));
    // TODO: Call API
  };

  const handleMeasurementsUpdate = (newMeasurements) => {
    setOrderState((prev) => ({ ...prev, measurementSet: newMeasurements }));
    // TODO: Call API
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      {/* SECTION 1: Order Header (Sticky - Fixed Position) */}
      <View style={styles.headerFixed}>
        <Text style={styles.headerOrderId}>ORDER #{orderState.order_id}</Text>
        <View style={styles.headerInfoRow}>
          <Badge
            value={orderState.status.toUpperCase()}
            status="primary"
            badgeStyle={[
              styles.statusBadge,
              {
                backgroundColor:
                  deliveryInfo.color === "error" ? "#FF3B30" : "#007AFF",
              },
            ]}
          />
          {orderState.urgent && (
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
            📞 {orderState.customer.phone} (Tap to Call)
          </Text>
          <Text style={styles.detailText}>
            📍 {orderState.customer.address}
          </Text>
        </TouchableOpacity>

        {/* SECTION 3: Order Items & Services (Non-Editable Info) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items & Services</Text>
          <Divider style={{ marginVertical: 8 }} />
          {orderState?.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>
                  Est. Days: {item.estimated_days}
                </Text>
                <Text style={styles.itemSubtitle}>
                  Msmts: {item.measurement_id}
                </Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          ))}
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
        />

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
          <Text style={styles.sectionTitle}>Notes & Activity Log</Text>
          <Text style={styles.sectionSubtitle}>Internal Notes (Editable)</Text>
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
            onPress={() => Alert.alert("Success", "Notes Saved (Mock API)")}
          />

          <Text style={styles.sectionSubtitle}>Activity Log (Audit Trail)</Text>
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
          </View>
        </View>

        {/* SECTION 9: Delivery Actions (Conditional) */}
        {orderState.status === "ready" && (
          <View style={[styles.card, styles.deliveryActions]}>
            <Text style={styles.sectionTitle}>Delivery Actions</Text>
            <Button
              title="Mark as Delivered"
              onPress={() => handleStatusChange("delivered")}
              buttonStyle={[
                styles.updateButton,
                { backgroundColor: "#34C759" },
              ]}
              containerStyle={{ marginBottom: 10 }}
            />
            <Button
              title="Send WhatsApp Link & Bill"
              onPress={() => Alert.alert("Action", "Sending WhatsApp link...")}
              type="outline"
              buttonStyle={{ borderColor: "#25D366" }}
              titleStyle={{ color: "#25D366" }}
            />
          </View>
        )}

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
    height: 35,
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
