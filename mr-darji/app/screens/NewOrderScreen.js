import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
  Alert,
} from "react-native";

// EXPO NOTIFICATIONS IMPORTS
// NOTE: These dependencies (react-native, expo-notifications) are external and cannot be resolved in this online environment.
// However, this code structure is correct for your local Expo project.
import * as Notifications from "expo-notifications";

// Notifications handler set up for foreground display (MUST be outside the component)
// Yeh function app ke foreground mein hone par notification dikhane ke liye zaroori hai.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Notification alert dikhao
    shouldPlaySound: true, // Notification sound bajao
    shouldSetBadge: false,
  }),
});

// Helper component for the icons (using text/emoji as a simple fallback for Expo)
const Icon = ({ name, size = 24, color = "#111418" }) => {
  let iconContent = "";
  switch (name) {
    case "X":
      // Simplified close icon (Band karne ka nishan)
      iconContent = "✕";
      break;
    case "CaretRight":
      // Simplified caret right (Aage badhne ka nishan)
      iconContent = "›";
      break;
    default:
      iconContent = "?";
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: size * 0.8, color: color, fontWeight: "300" }}>
        {iconContent}
      </Text>
    </View>
  );
};

// Custom Switch component translated to React Native to match the provided design.
const CustomSwitch = ({ value, onValueChange }) => {
  const toggleStyle = [
    styles.switchTrack,
    value ? styles.switchTrackChecked : styles.switchTrackUnchecked,
    { justifyContent: value ? "flex-end" : "flex-start" },
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      style={toggleStyle}
    >
      <View style={styles.switchThumb} />
    </TouchableOpacity>
  );
};

const NewOrderScreen = () => {
  const [isPartialPayment, setIsPartialPayment] = useState(false);

  // --- NOTIFICATION SETUP LOGIC (STEP 1) ---
  // Notification ki anumati (permission) maangne aur listener set karne ke liye
  useEffect(() => {
    // Function to register for push notifications and set up the listener
    const setupNotifications = async () => {
      // 1. Request permissions (mandatory for notifications)
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        // Agar anumati na mile to user ko batana
        Alert.alert(
          "Permission Denied",
          "Notification ki anumati (permission) nahi mili hai. Kripya app settings check karein."
        );
        return;
      }
      console.log("Notification permissions granted");
    };

    setupNotifications();

    // 2. Setup listener for handling notifications when received
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Logic to handle the notification object, if needed
        console.log(
          "Foreground notification received:",
          notification.request.content.title
        );
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);
  // ----------------------------------------

  // --- NOTIFICATION SCHEDULER FUNCTION (STEP 2) ---
  // Order create hone par turant notification schedule karne ke liye
  const scheduleOrderCreatedNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✅ Order Created! 🎉", // Notification Title (Hindi/Emoji)
        body: "Aapka order Liam Carter ke liye safaltapoorvak bana diya gaya hai.", // Notification Body in Hindi
        data: { screen: "CustomerInfo", orderId: "001" }, // Custom data
      },
      trigger: null, // trigger: null ka matlab hai notification turant (immediately) dikhega
    });
    console.log("Notification scheduled successfully.");
  };

  // --- BUTTON HANDLERS ---
  const handleClose = () => console.log("Close pressed");
  const handleSelectItem = () => console.log("Select Item pressed");
  const handleMeasurements = () => console.log("Input Measurements pressed");
  const handleDelivery = () => console.log("Set Delivery Date pressed");

  const handleCreateOrder = () => {
    console.log("Create Order pressed - Processing order...");
    // Order banane ka logic yahaan aayega...

    // 'Order creation' ke baad notification trigger karna
    scheduleOrderCreatedNotification();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Header (Sheersh) */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={handleClose}>
            <Icon name="X" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Order</Text>
        </View>

        {/* Content Area (Vastavik content) */}
        <View style={styles.contentArea}>
          {/* Customer Section (Grahak Vibhaag) */}
          <Text style={styles.sectionHeader}>Customer</Text>
          <View style={styles.listItem}>
            <Image
              source={{
                uri: "https://placehold.co/56x56/007AFF/ffffff?text=LC",
              }}
              style={styles.avatar}
            />
            <View style={styles.listItemTextContainer}>
              <Text style={styles.mainText}>Liam Carter</Text>
              <Text style={styles.subText}>+1 234 567 890</Text>
            </View>
          </View>

          {/* Item Section (Vastu Vibhaag) */}
          <Text style={styles.sectionHeader}>Item</Text>
          <TouchableOpacity
            style={styles.listItemRow}
            activeOpacity={0.7}
            onPress={handleSelectItem}
          >
            <View style={styles.listItemTextContainer}>
              <Text style={styles.mainText}>Item 1</Text>
              <Text style={styles.subText}>Shirt</Text>
            </View>
            <View style={styles.chevronContainer}>
              <Icon name="CaretRight" />
            </View>
          </TouchableOpacity>

          {/* Measurements Section (Mapan Vibhaag) */}
          <Text style={styles.sectionHeader}>Measurements</Text>
          <TouchableOpacity
            style={styles.listItemRow}
            activeOpacity={0.7}
            onPress={handleMeasurements}
          >
            <Text style={styles.mainText}>Input Measurements</Text>
            <View style={styles.chevronContainer}>
              <Icon name="CaretRight" />
            </View>
          </TouchableOpacity>

          {/* Delivery Section (Delivery Vibhaag) */}
          <Text style={styles.sectionHeader}>Delivery</Text>
          <TouchableOpacity
            style={styles.listItemRow}
            activeOpacity={0.7}
            onPress={handleDelivery}
          >
            <Text style={styles.mainText}>Set Delivery Date</Text>
            <View style={styles.chevronContainer}>
              <Icon name="CaretRight" />
            </View>
          </TouchableOpacity>

          {/* Payment Section (Bhugtaan Vibhaag) */}
          <Text style={styles.sectionHeader}>Payment</Text>
          <View style={styles.listItemRow}>
            <Text style={styles.mainText}>Partial Payment</Text>
            <CustomSwitch
              value={isPartialPayment}
              onValueChange={setIsPartialPayment}
            />
          </View>

          {/* Padding for scroll */}
          <View style={{ height: 16 }} />
        </View>

        {/* Bottom Fixed Area (Neeche ka hissa - Footer) */}
        <View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateOrder}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>Create Order</Text>
          </TouchableOpacity>
          <View style={styles.bottomSpacer} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  contentArea: {
    flex: 1,
    // Dhyan dein: Asli app mein yeh ScrollView hona chahiye agar content screen se zyada ho.
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f4",
    paddingBottom: 8,
  },
  iconButton: {
    width: 48, // size-12
    height: 48, // size-12
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#111418",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    // Icon button ki chaudaai (width) ke liye compensation
    paddingRight: 48,
  },
  sectionHeader: {
    color: "#111418",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 8,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f4",
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    minHeight: 56, // min-h-14
    paddingVertical: 8,
    justifyContent: "space-between",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f4",
  },
  avatar: {
    width: 56, // h-14
    height: 56, // w-fit, aspect-square
    borderRadius: 28,
    backgroundColor: "#e0e0e0",
  },
  listItemTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  mainText: {
    color: "#111418",
    fontSize: 16,
    fontWeight: "500", // medium
  },
  subText: {
    color: "#617589",
    fontSize: 14,
    fontWeight: "normal",
    marginTop: 2,
  },
  chevronContainer: {
    width: 28, // size-7
    height: 28, // size-7
    justifyContent: "center",
    alignItems: "center",
  },

  // Custom Switch Styles (Custom Switch ke styles)
  switchTrack: {
    height: 31,
    width: 51,
    borderRadius: 15.5,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  switchTrackUnchecked: {
    backgroundColor: "#f0f2f4",
  },
  switchTrackChecked: {
    backgroundColor: "#1380ec",
  },
  switchThumb: {
    height: 27,
    width: 27,
    borderRadius: 13.5,
    backgroundColor: "white",
    // box-shadow ke liye shadow properties ka upyog
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  // Bottom Area and Button (Neeche ka hissa aur Button)
  bottomArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f2f4",
  },
  createButton: {
    minWidth: 84,
    height: 48, // h-12
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: "#1380ec",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.24, // tracking-[0.015em]
  },
  bottomSpacer: {
    height: 20, // h-5 - button ke neeche ki padding
    backgroundColor: "white",
  },
});

export default NewOrderScreen;
