import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import Svg, { Path } from "react-native-svg";

// Chart Library Imports
import {
  LineChart,
  BarChart,
  PieChart, // Donut Chart के लिए PieChart का उपयोग होता है
} from "react-native-chart-kit";

import { PaymentReminder } from "../components/WhatsappTemplate";
// Screen width for responsive charts
const screenWidth = Dimensions.get("window").width - 32; // Total width minus padding (16 left + 16 right)

// --- SVG Icons (No Change) ---
const ChartIcon = ({ color = "#111418", size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 20V10M18 20V4M6 20v-4" />
  </Svg>
);
const OrdersIcon = ({ color = "#111418", size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M15 2H9c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1z" />
  </Svg>
);
const RevenueIcon = ({ color = "#111418", size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 20V10M18.4 6c.7 1.2 1.6 3 1.6 6 0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8c1.6 0 3 .5 4.1 1.4M15 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
  </Svg>
);
const CustomerIcon = ({ color = "#111418", size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M14 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);
const StaffIcon = ({ color = "#111418", size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M10 5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M12 7v5M17 19h-10a5 5 0 0 1 0-10h10a5 5 0 0 1 0 10z" />
  </Svg>
);

// Section Header Component
const SectionHeader = ({ title, icon: Icon }) => (
  <View style={styles.sectionHeader}>
    <Icon color="#111418" size={24} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// Info Card Component for Business Overview (No Change)
const InfoCard = ({ title, value, color }) => (
  <View
    style={[
      styles.infoCard,
      { borderColor: color + "30", borderLeftColor: color, borderLeftWidth: 4 },
    ]}
  >
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

// Table Placeholder Component (Used for Pending Payments and CLV)
const TablePlaceholder = ({ title, columns }) => (
  <View style={styles.tableContainer}>
    <Text style={styles.tableTitle}>{title}</Text>
    <View style={styles.tableHeader}>
      {columns.map((col, index) => (
        <Text
          key={index}
          style={[styles.tableHeaderText, { flex: index === 0 ? 1.5 : 1 }]}
        >
          {col}
        </Text>
      ))}
    </View>
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1.5 }]}>Jatin The Poriya</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>#1765</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹950</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>7 days</Text>
      <TouchableOpacity style={styles.reminderButton}>
        <Text style={styles.reminderButtonText}>Remind</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1.5 }]}>Dummy Customer</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>#1888</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹500</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>3 days</Text>
      <TouchableOpacity
        style={styles.reminderButton}
        onPress={async () => {
          // **async जोड़ना अच्छा अभ्यास है**
          try {
            // 1. लिंक जनरेट करें
            const link = PaymentReminder("917201840095", {
              name: "Dummy Customer",
              orderID: "#1888",
              amount: "₹500",
            });

            // 2. लिंक को ओपन करें
            await Linking.openURL(link);
          } catch (error) {
            console.error("Failed to open link:", error);
            // उपयोगकर्ता को एक चेतावनी दिखाएँ
            Alert.alert(
              "Error",
              "Could not open the reminder link. Please check if the required app is installed."
            );
          }
        }}
      >
        <Text style={styles.reminderButtonText}>Remind</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- Chart Data & Configuration ---

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0, // No decimal for counts
  color: (opacity = 1) => `rgba(81, 148, 107, ${opacity})`, // Main Green color
  labelColor: (opacity = 1) => `rgba(17, 20, 24, ${opacity})`, // Dark text
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#51946b",
  },
  propsForBackgroundLines: {
    strokeDasharray: "0", // solid line
  },
};

// 2B) Monthly Order Trend Data (Line Chart)
const monthlyOrderData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(66, 153, 225, ${opacity})`, // Blue trend line
      strokeWidth: 2,
    },
  ],
};

// 2C) Most Sold Items Data (Bar Chart)
const mostSoldData = {
  labels: ["Shirt", "Pant", "Kurta", "Blouse"],
  datasets: [
    {
      data: [35, 28, 15, 12], // Item Counts
    },
  ],
};

// 2A) Order Flow Data (Pie/Donut Chart)
const orderFlowData = [
  {
    name: "Received (15)",
    population: 15,
    color: "#F6AD55", // Orange
    legendFontColor: "#111418",
    legendFontSize: 14,
  },
  {
    name: "Cutting (10)",
    population: 10,
    color: "#4299e1", // Blue
    legendFontColor: "#111418",
    legendFontSize: 14,
  },
  {
    name: "Stitching (12)",
    population: 12,
    color: "#51946b", // Green
    legendFontColor: "#111418",
    legendFontSize: 14,
  },
  {
    name: "Ready (8)",
    population: 8,
    color: "#617589", // Grey
    legendFontColor: "#111418",
    legendFontSize: 14,
  },
];

// 3A) Monthly Revenue Data (Line Chart)
const monthlyRevenueData = {
  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      data: [85000, 110000, 95000, 130000, 125000, 150000],
      color: (opacity = 1) => `rgba(81, 148, 107, ${opacity})`, // Main Green
      strokeWidth: 2,
    },
  ],
};

// --- Main Screen Component ---

export default function AnalyticsScreen() {
  return (
    <View style={styles.screenContainer}>
      {/* Header (Unchanged) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Premium Analytics</Text>
        <Text style={styles.headerSubtitle}>
          Key performance insights for your tailoring business.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 1) ⭐ BUSINESS OVERVIEW (Cards) */}
        <SectionHeader title="Business Overview" icon={ChartIcon} />
        <View style={styles.cardGrid}>
          <InfoCard
            title="Total Orders (This Month)"
            value="45"
            color="#51946b"
          />
          <InfoCard
            title="Total Revenue (This Month)"
            value="₹1,25,000"
            color="#4299e1"
          />
          <InfoCard title="Pending Payments" value="₹18,500" color="#E53E3E" />
          <InfoCard title="Orders in Progress" value="32" color="#F6AD55" />
          <InfoCard
            title="Success Rate (Completed %)"
            value="82%"
            color="#51946b"
          />
          <InfoCard title="Delayed Orders" value="5 (11%)" color="#E53E3E" />
        </View>

        <View style={styles.separator} />

        {/* 2) ⭐ ORDERS ANALYTICS */}
        <SectionHeader title="Orders Analytics" icon={OrdersIcon} />

        {/* A) Order Flow (Stages) - Donut Chart */}
        <Text style={styles.subHeading}>Order Flow by Stages (Count)</Text>
        <View style={styles.chartWrapper}>
          <PieChart
            data={orderFlowData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]} // Center the chart slightly
            absolute // Show raw value next to percentage
          />
          <Text style={styles.chartReasonText}>
            Reason: Categorical stages are best shown proportionally.
          </Text>
        </View>

        {/* B) Monthly Order Trend - Line Chart */}
        <Text style={styles.subHeading}>
          Monthly Order Trend (Last 6 months)
        </Text>
        <View style={styles.chartWrapper}>
          <LineChart
            data={monthlyOrderData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier // Smooth curve
            style={styles.chartContainerStyle}
          />
          <Text style={styles.chartReasonText}>
            Reason: Line chart shows time series trends clearly.
          </Text>
        </View>

        {/* C) Most Sold Items - Bar Chart */}
        <Text style={styles.subHeading}>Most Sold Items (Count)</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={mostSoldData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            style={styles.chartContainerStyle}
          />
          <Text style={styles.chartReasonText}>
            Reason: Bar chart for category comparison and ranking.
          </Text>
        </View>

        {/* D) Order Completion Stats (Dummy Pie Chart) */}
        <Text style={styles.subHeading}>Order Completion Stats</Text>
        <View style={styles.chartWrapper}>
          <PieChart
            data={[
              {
                name: "On-time (80%)",
                population: 80,
                color: "#51946b",
                legendFontColor: "#111418",
                legendFontSize: 14,
              },
              {
                name: "Delayed (15%)",
                population: 15,
                color: "#E53E3E",
                legendFontColor: "#111418",
                legendFontSize: 14,
              },
              {
                name: "Early (5%)",
                population: 5,
                color: "#4299e1",
                legendFontColor: "#111418",
                legendFontSize: 14,
              },
            ]}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
          <Text style={styles.chartReasonText}>
            Reason: Donut chart for clear proportion of success rate.
          </Text>
        </View>

        <View style={styles.separator} />

        {/* 3) ⭐ PAYMENTS & REVENUE ANALYTICS */}
        <SectionHeader title="Payments & Revenue" icon={RevenueIcon} />

        {/* A) Monthly Revenue - Line Chart */}
        <Text style={styles.subHeading}>Monthly Revenue Trend (₹)</Text>
        <View style={styles.chartWrapper}>
          <LineChart
            data={monthlyRevenueData}
            width={screenWidth}
            height={220}
            chartConfig={{ ...chartConfig, decimalPlaces: 0, fromZero: false }} // Enable high values
            bezier
            style={styles.chartContainerStyle}
          />
          <Text style={styles.chartReasonText}>
            Reason: Line chart tracks financial growth over time.
          </Text>
        </View>

        {/* B) Payment Breakdown - Donut Chart */}
        <Text style={styles.subHeading}>
          Payment Breakdown (Cash, Online, Pending)
        </Text>
        <View style={styles.chartWrapper}>
          <PieChart
            data={[
              {
                name: "Cash (45%)",
                population: 45,
                color: "#51946b",
                legendFontColor: "#111418",
                legendFontSize: 14,
              },
              {
                name: "Online (35%)",
                population: 35,
                color: "#4299e1",
                legendFontColor: "#111418",
                legendFontSize: 14,
              },
              {
                name: "Pending (20%)",
                population: 20,
                color: "#E53E3E",
                legendFontColor: "#111418",
                legendFontSize: 14,
              },
            ]}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
          <Text style={styles.chartReasonText}>
            Reason: Donut chart shows proportion of payment methods.
          </Text>
        </View>

        {/* C) Pending Payments Table */}
        <Text style={styles.subHeading}>Pending Payments Table</Text>
        <TablePlaceholder
          title="Actionable List of Pending Payments"
          columns={[
            "Customer",
            "Order ID",
            "Due Amount",
            "Due Since",
            "Action",
          ]}
        />

        {/* D) Top Revenue Items (Dummy Bar Chart) */}
        <Text style={styles.subHeading}>Top Revenue Items (₹)</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={{
              labels: ["Shirt", "Kurta", "Blouse", "Lehenga"],
              datasets: [{ data: [22000, 18000, 15000, 10000] }],
            }}
            width={screenWidth}
            height={220}
            chartConfig={{ ...chartConfig, decimalPlaces: 0 }}
            verticalLabelRotation={30}
            style={styles.chartContainerStyle}
          />
          <Text style={styles.chartReasonText}>
            Reason: Bar chart ranks items by total earnings.
          </Text>
        </View>

        <View style={styles.separator} />

        {/* 4) ⭐ CUSTOMER INSIGHTS */}
        <SectionHeader title="Customer Insights" icon={CustomerIcon} />

        {/* A) Returning vs New Customers - Donut Chart */}
        <Text style={styles.subHeading}>Returning vs New Customers</Text>
        <View style={styles.chartWrapper}>
          <PieChart
            data={[
              {
                name: "Returning (60%)",
                population: 60,
                color: "#51946b",
                legendFontColor: "#111418",
                legendFontSize: 14,
              },
              {
                name: "New (40%)",
                population: 40,
                color: "#4299e1",
                legendFontColor: "#111418",
                legendFontSize: 14,
              },
            ]}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
          <Text style={styles.chartReasonText}>
            Reason: Donut chart segments customer base clearly.
          </Text>
        </View>

        {/* B) Repeat Orders Frequency - Bar Chart */}
        <Text style={styles.subHeading}>Repeat Orders Frequency</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={{
              labels: ["2-3 Times", "4-5 Times", "6+ Times"],
              datasets: [{ data: [15, 8, 3] }],
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chartContainerStyle}
          />
          <Text style={styles.chartReasonText}>
            Reason: Bar chart shows how often customers return.
          </Text>
        </View>

        {/* C) Customer History Table */}
        <Text style={styles.subHeading}>Customer History Table (CLV)</Text>
        <TablePlaceholder
          title="Customer Lifetime Value (CLV) & History"
          columns={[
            "Name",
            "Last Order",
            "Total Orders",
            "Avg. Value",
            "Due Amount",
          ]}
        />

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

// --- Stylesheet ---
// Note: Chart styles added to existing styles

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f7f9fb",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111418",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#617589",
    marginTop: 4,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 50,
  },

  // Section Header Styles
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#f0f2f4",
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111418",
    marginLeft: 8,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111418",
    marginTop: 18,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#e4e7eb",
    marginVertical: 20,
    marginHorizontal: 10,
  },

  // 1) Business Overview Cards (Unchanged)
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 12,
    color: "#617589",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111418",
  },

  // --- Chart Styles (New) ---
  chartWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 0,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  chartContainerStyle: {
    borderRadius: 10,
  },
  chartReasonText: {
    fontSize: 12,
    color: "#9ba4ae",
    textAlign: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f2f4",
  },

  // Table Placeholder Styles (Unchanged)
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e4e7eb",
    marginBottom: 10,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111418",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f4",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableHeaderText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#617589",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f7f9fb",
  },
  tableCell: {
    fontSize: 13,
    color: "#111418",
    flex: 1,
  },
  reminderButton: {
    backgroundColor: "#4299e1",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
  reminderButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
