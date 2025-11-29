import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";

// --- SVG Icon Components ---

const PlusIcon = ({ color = "#111418", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
  </Svg>
);

const ListBulletsIcon = ({ color = "#111418", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" />
  </Svg>
);

const UsersIcon = ({ color = "#111418", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
  </Svg>
);

const CurrencyDollarIcon = ({ color = "#111418", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z" />
  </Svg>
);

// --- Quick Action Card Component ---

const QuickActionCard = ({ action, cardWidth }) => {
  const IconComponent = action.icon;

  return (
    <TouchableOpacity
      onPress={action.onPress}
      style={[styles.cardContainer, { width: cardWidth }]}
    >
      <IconComponent />
      <View style={styles.cardTextGroup}>
        <Text style={styles.cardTitle}>{action.title}</Text>
        <Text style={styles.cardDescription}>{action.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Main Home Screen Component ---

// The navigation object is passed as a prop when this component is rendered inside a navigator.
export default function HomeScreen({ navigation }) {
  // Use useMemo to prevent unnecessary recalculations of card width and action handlers
  const { width } = Dimensions.get("window");

  const cardWidth = useMemo(() => {
    // Recalculate width based on screen dimensions for the 2-column layout
    const itemMargin = 16; // horizontal padding
    const itemGap = 12; // gap
    const calculatedWidth = (width - 2 * itemMargin - itemGap) / 2;
    return Math.max(calculatedWidth, 158); // Ensures min 158px width as per original HTML
  }, [width]);

  const QUICK_ACTIONS = useMemo(
    () => [
      {
        key: "NewOrder",
        title: "New Order",
        description: "Create a new order",
        icon: PlusIcon,
        // Blank link for now

        onPress: () => console.log("New Order: Functionality TBD"),
      },
      {
        key: "ViewOrders",
        title: "View Orders",
        description: "View all orders",
        icon: ListBulletsIcon,
        // Navigate to the 'Orders' screen/tab
        onPress: () => navigation.navigate("Orders"),
      },
      {
        key: "ManageCustomers",
        title: "Manage Customers",
        description: "Manage customer details",
        icon: UsersIcon,
        // Navigate to the 'Customers' screen/tab
        onPress: () => navigation.navigate("Customers"),
      },
      {
        key: "PaymentHistory",
        title: "Payment History",
        description: "View payment history",
        icon: CurrencyDollarIcon,
        // Blank link for now
        onPress: () => console.log("Payment History: Functionality TBD"),
      },
    ],
    [navigation]
  ); // Re-create actions if the navigation object changes

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header - Not explicitly requested, but often needed for context */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>Welcome, Admin!</Text>
      </View>

      {/* Quick Actions Section */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      {/* Grid Container */}
      <View style={styles.gridContainer}>
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard
            key={action.key}
            action={action}
            cardWidth={cardWidth} // Pass calculated width
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  // --- Header/Greeting Styles (Added for context) ---
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111418",
    letterSpacing: -0.5,
  },
  // --- Section Title Styles ---
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111418",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    letterSpacing: -0.5,
  },
  // --- Grid/Card Styles ---
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Distribute items horizontally
    paddingHorizontal: 16,
    gap: 12, // Simulates the gap-3
  },
  cardContainer: {
    // Width is passed via prop
    flexDirection: "column",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbe0e6",
    backgroundColor: "#fff",
    padding: 16,
  },
  cardTextGroup: {
    flexDirection: "column",
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111418",
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#617589",
    lineHeight: 18,
  },
});
