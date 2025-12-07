import React, { useMemo, useState } from "react"; // 1. useState import kiya
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

// --- SVG Icon Components (unchanged) ---
// ... (PlusIcon, ListBulletsIcon, UsersIcon, CurrencyDollarIcon components are here)
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

const QuickActionCard = ({ action, cardWidth, gradientColors }) => {
  // 2. State to manage the press effect
  const [isPressed, setIsPressed] = useState(false);

  const IconComponent = action.icon;
  const iconColor = gradientColors ? "#FFFFFF" : "#111418";

  const pressedOpacity = isPressed ? 0.7 : 1;

  return (
    <View style={[styles.cardOuterContainer, { width: cardWidth }]}>
      <TouchableOpacity
        onPress={action.onPress}
        onPressIn={() => setIsPressed(true)} // 3. Press shuru hone par state change
        onPressOut={() => setIsPressed(false)} // 4. Press khatam hone par state change
        activeOpacity={1} // Use activeOpacity=1 to let our custom opacity handle the effect
        style={styles.touchableArea}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          // 5. Apply the calculated opacity to the gradient container
          style={[styles.gradientBackground, { opacity: pressedOpacity }]}
        >
          <IconComponent color={iconColor} />
          <View style={styles.cardTextGroup}>
            <Text
              style={[styles.cardTitle, gradientColors && { color: "#FFFFFF" }]}
            >
              {action.title}
            </Text>
            <Text
              style={[
                styles.cardDescription,
                gradientColors && { color: "#E0E0E0" },
              ]}
            >
              {action.description}
            </Text>
          </View>
          {action.ad && <Text style={styles.adBadge}>ADS</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// --- Main Home Screen Component (unchanged) ---

export default function DashboardScreen({ navigation }) {
  const { width } = Dimensions.get("window");

  const cardWidth = useMemo(() => {
    const itemMargin = 16;
    const itemGap = 12;
    const calculatedWidth = (width - 2 * itemMargin - itemGap) / 2;
    return Math.max(calculatedWidth, 158);
  }, [width]);

  const QUICK_ACTIONS = useMemo(
    () => [
      {
        key: "NewOrder",
        title: "New Order",
        description: "Create a new order",
        icon: PlusIcon,
        gradient: ["#5083FF", "#86A8FF"],
        onPress: () => navigation.navigate("Orders", { screen: "CreateOrder" }),
      },
      {
        key: "ViewOrders",
        title: "View Orders",
        description: "View all orders",
        icon: ListBulletsIcon,
        gradient: ["#FE5745", "#FF867B"],
        onPress: () => navigation.navigate("Orders"),
      },
      {
        key: "ManageCustomers",
        title: "Manage Customers",
        description: "Manage customer details",
        icon: UsersIcon,
        gradient: ["#665AFF", "#9993FF"],
        onPress: () => navigation.navigate("Customers"),
      },
      {
        key: "PaymentHistory",
        title: "Payment History",
        description: "View payment history",
        icon: CurrencyDollarIcon,
        gradient: ["#FF3F54", "#FF7382"],
        ad: true,
        onPress: () => console.log("Payment History: Functionality TBD"),
      },
    ],
    [navigation]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.greetingText}>Welcome, Admin!</Text>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.gridContainer}>
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard
            key={action.key}
            action={action}
            cardWidth={cardWidth}
            gradientColors={action.gradient}
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
  // --- Header/Greeting Styles ---
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 12,
  },
  cardOuterContainer: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  touchableArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    flexDirection: "column",
    gap: 12,
    padding: 16,
    justifyContent: "space-between",
    position: "relative",
  },
  cardTextGroup: {
    flexDirection: "column",
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 18,
  },
  adBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
