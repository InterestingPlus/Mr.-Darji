import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Icon, Avatar, Badge, Divider } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import Svg, { Path } from 'react-native-svg';

import BASE_URL from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// --- DUMMY DATA (No Change) ---
const DUMMY_SHOP_NAME = 'Ramesh Tailors';
const DUMMY_USER_NAME = 'Ramesh';
const PENDING_ALERTS = 3;

const PlusIcon = ({ color = '#111418', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
  </Svg>
);

const UsersIcon = ({ color = '#111418', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
  </Svg>
);

const ListBulletsIcon = ({ color = '#111418', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <Path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" />
  </Svg>
);

const quickAccessItems = [
  {
    label: 'Orders',
    icon: { name: 'package-variant-closed', type: 'material-community' },

    stack: 'Orders',
    screen: 'OrdersList',
  },
  {
    label: 'Customers',
    icon: { name: 'account-group', type: 'material-community' },

    stack: 'Customers',
    screen: 'CustomersList',
  },
  {
    label: 'Services',
    icon: { name: 'tools', type: 'material-community' },

    stack: 'Settings',
    screen: 'ServicesList',
  },
  {
    label: 'Reports',
    icon: { name: 'bar-chart', type: 'material' },

    stack: 'Orders',
    screen: 'ReportsScreen',
  },
  {
    label: 'Shop Profile',
    icon: { name: 'store', type: 'material' },

    stack: 'Settings',
    screen: 'ShopProfile',
  },
  {
    label: 'Settings',
    icon: { name: 'settings', type: 'material' },

    stack: 'Settings',
    screen: 'SettingsScreen',
  },
];

const reminders = [
  {
    id: 1,
    text: '3 orders scheduled for delivery tomorrow',
    icon: 'schedule',
    color: '#FFCC00',
  },
  { id: 2, text: '2 payments pending', icon: 'payments', color: '#FF3B30' },
  {
    id: 3,
    text: 'Measurements missing for 1 order',
    icon: 'straighten',
    color: '#007AFF',
  },
];

const recentActivity = [
  'Order #124 created (₹3,000)',
  'Payment of ₹1200 received (Order #122)',
  'Customer Anil updated (Phone: 9xxxx)',
  'Order #125 created (₹4,500)',
  'Order #121 delivered',
];

// --- 1. APP HEADER Component (No Change) ---
const AppHeader = ({
  shopName,
  userName,
  pendingAlerts,
  onSettingsPress,
  onNotificationsPress,
}) => (
  <View style={styles.headerContainer}>
    {/* Left Side: Logo & Greeting */}
    <View style={styles.headerLeft}>
      <Avatar
        rounded
        source={{ uri: 'https://via.placeholder.com/40/007AFF/FFFFFF?text=RT' }}
        size="medium"
        containerStyle={styles.headerAvatar}
      />
      <View>
        <Text style={styles.headerGreeting}>Good Morning, {userName} 👋</Text>
        <Text style={styles.headerShopName}>{shopName}</Text>
      </View>
    </View>

    {/* Right Side: Icons */}
    <View style={styles.headerRight}>
      <TouchableOpacity
        onPress={onNotificationsPress}
        style={styles.iconButton}
      >
        <Icon name="notifications" type="material" size={24} color="#333" />
        {pendingAlerts > 0 && (
          <Badge
            status="error"
            value={pendingAlerts > 9 ? '9+' : pendingAlerts}
            containerStyle={styles.badgeContainer}
          />
        )}
      </TouchableOpacity>
    </View>
  </View>
);

// --- 2. PRIMARY ACTION ZONE Component (UPDATED with Gradient) ---
const PrimaryActionCard = ({
  title,
  subtitle,
  icon,
  onPress,
  startColor,
  endColor,
}) => (
  <TouchableOpacity
    style={styles.primaryCardWrapper} // Use wrapper for elevation/shadow
    activeOpacity={0.8}
    onPress={onPress}
  >
    <LinearGradient
      colors={[startColor, endColor]}
      start={{ x: 0.1, y: 0.2 }}
      end={{ x: 0.9, y: 0.9 }}
      style={styles.primaryCardGradient}
    >
      <Icon name={icon} type="material-community" size={40} color="#FFF" />
      <Text style={styles.primaryCardTitle}>{title}</Text>
      <Text style={styles.primaryCardSubtitle}>{subtitle}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const QuickActionCard = ({ action, cardWidth, gradientColors }) => {
  // 2. State to manage the press effect
  const [isPressed, setIsPressed] = useState(false);

  const IconComponent = action.icon;
  const iconColor = gradientColors ? '#FFFFFF' : '#111418';

  const pressedOpacity = isPressed ? 0.7 : 1;

  const { width } = Dimensions.get('window');

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
              style={[styles.cardTitle, gradientColors && { color: '#FFFFFF' }]}
            >
              {action.title}
            </Text>
            <Text
              style={[
                styles.cardDescription,
                gradientColors && { color: '#E0E0E0' },
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

// --- 3. TODAY SNAPSHOT Component (Small Stat Card) (No Change) ---
const StatCard = ({ label, value, icon, color }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      <Icon name={icon} type="material" size={24} color={color} />
    </View>
    <Text style={styles.statValue}>
      {icon === 'payments' ? `₹${value}` : value}
    </Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// --- 4. QUICK NAVIGATION Component (Grid Item) (No Change) ---
const QuickShortcut = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={styles.shortcutCard}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.shortcutIconCircle}>
      <Icon name={icon.name} type={icon.type} size={28} color="#007AFF" />
    </View>
    <Text style={styles.shortcutLabel}>{label}</Text>
  </TouchableOpacity>
);

// --- 5. BUSINESS OVERVIEW Component (Chart Placeholder) (No Change) ---
const BusinessOverviewCard = ({ onPress }) => (
  <TouchableOpacity
    style={styles.overviewCard}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Text style={styles.sectionTitleSmall}>Orders - Last 7 Days</Text>

    {/* Chart Placeholder Area */}
    <View style={styles.chartPlaceholder}>
      {/* Simple Bar Chart Illustration (Hardcoded for wireframe) */}
      <View
        style={[styles.bar, { height: '50%', backgroundColor: '#007AFF' }]}
      />
      <View
        style={[styles.bar, { height: '30%', backgroundColor: '#007AFF' }]}
      />
      <View
        style={[styles.bar, { height: '70%', backgroundColor: '#007AFF' }]}
      />
      <View
        style={[styles.bar, { height: '40%', backgroundColor: '#007AFF' }]}
      />
      <View
        style={[styles.bar, { height: '80%', backgroundColor: '#007AFF' }]}
      />
      <View
        style={[styles.bar, { height: '60%', backgroundColor: '#007AFF' }]}
      />
      <View
        style={[styles.bar, { height: '45%', backgroundColor: '#007AFF' }]}
      />
    </View>

    <Text style={styles.overviewLink}>View Detailed Analytics →</Text>
  </TouchableOpacity>
);

// --- MAIN DASHBOARD COMPONENT ---
export default function HomeDashboardScreen({ navigation }) {
  const handleNavigate = useCallback((stack, screen) => {
    // Replace with actual navigation logic
    try {
      navigation.navigate(stack, { screen });
    } catch (e) {
      Alert.alert('Navigation', `Navigating to ${screen}`);
    }
  }, []);

  // Width calculation for 3-column grid (No Change)
  const numColumns = 3;
  const itemPadding = 16;
  const itemSpacing = 12; // Gap between items

  const shortcutWidth = useMemo(() => {
    return (
      (width - 2 * itemPadding - (numColumns - 1) * itemSpacing) / numColumns
    );
  }, [width]);

  const cardWidth = useMemo(() => {
    const itemMargin = 16;
    const itemGap = 12;
    const calculatedWidth = (width - 2 * itemMargin - itemGap) / 2;
    return Math.max(calculatedWidth, 158);
  }, [width]);

  const [todayStats, setTodayStats] = useState([
    { label: 'Orders Today', value: 0, icon: 'today', color: '#007AFF' },
    {
      label: 'Pending Orders',
      value: 0,
      icon: 'hourglass-empty',
      color: '#FF9500',
    },
    {
      label: 'Delivered',
      value: 0,
      icon: 'check-circle-outline',
      color: '#34C759',
    },
    {
      label: 'Due Amount',
      value: 0,
      icon: 'payments',
      color: '#FF3B30',
    },
  ]);

  useEffect(() => {
    const getTodayStats = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        const response = await axios.get(`${BASE_URL}/api/analytics/today`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const apiData = response.data;
        console.log(apiData);

        setTodayStats([
          {
            label: 'Orders Today',
            value: apiData?.totalOrdersToday,
            icon: 'today',
            color: '#007AFF',
          },
          {
            label: 'Pending Orders',
            value: apiData?.pendingOrdersToday,
            icon: 'hourglass-empty',
            color: '#FF9500',
          },
          {
            label: 'Delivered',
            value: apiData?.deliveredOrdersToday,
            icon: 'check-circle-outline',
            color: '#34C759',
          },
          {
            label: 'Due Amount',
            value: apiData?.totalDueAmount,
            icon: 'payments',
            color: '#FF3B30',
          },
        ]);
      } catch (error) {
        console.error("Error fetching today's stats:", error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      getTodayStats();
    });
    return unsubscribe;
  });

  const QUICK_ACTIONS = useMemo(
    () => [
      {
        key: 'NewOrder',
        title: 'New Order',
        description: 'Create a new order',
        icon: PlusIcon,
        gradient: ['#665AFF', '#9993FF'],
        onPress: () => navigation.navigate('Orders', { screen: 'CreateOrder' }),
      },
      {
        key: 'AddCustomer',
        title: 'Add Customer',
        description: 'add a new customer',
        icon: UsersIcon,
        gradient: ['#FF3F54', '#FF7382'],

        onPress: () =>
          navigation.navigate('Customers', { screen: 'AddCustomer' }),
      },
    ],
    [navigation],
  );

  return (
    <SafeAreaView style={styles.rootContainer}>
      {/* 1. APP HEADER (Fixed at Top) */}
      <AppHeader
        shopName={DUMMY_SHOP_NAME}
        userName={DUMMY_USER_NAME}
        pendingAlerts={PENDING_ALERTS}
        onSettingsPress={() => handleNavigate('SettingsScreen')}
        onNotificationsPress={() => handleNavigate('NotificationsScreen')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentOffset={{ y: 0, x: 0 }}
        contentInset={{ top: 70 }}
      >
        <View style={{ height: 70 }} />

        {/* 3. TODAY SNAPSHOT */}
        {todayStats[0]?.value == 0 &&
        todayStats[1]?.value == 0 &&
        todayStats[2]?.value == 0 &&
        todayStats[3]?.value == 0 ? null : (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today at a Glance</Text>
            <View style={styles.statGrid}>
              {todayStats?.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </View>
          </View>
        )}

        {/* 2. PRIMARY ACTION ZONE (Using updated component with gradient props) */}
        <View style={styles.sectionPadding}>
          {/* <View style={styles.primaryActionZone}>
            <PrimaryActionCard
              title="➕ New Order"
              subtitle="Create Order"
              icon="plus-circle-outline"
              startColor="#5083FF" // Blue Gradient Start
              endColor="#86A8FF" // Blue Gradient End
              onPress={() => handleNavigate("NewOrderScreen")}
            />
            <PrimaryActionCard
              title="👤 Add Customer"
              subtitle="Register Client"
              icon="account-plus-outline"
              startColor="#34C759" // Green Gradient Start
              endColor="#61E87F" // Green Gradient End
              onPress={() => handleNavigate("AddCustomerScreen")}
            />
          </View> */}

          <View style={styles.gridContainer}>
            {QUICK_ACTIONS.map(action => (
              <QuickActionCard
                key={action.key}
                action={action}
                cardWidth={cardWidth}
                gradientColors={action.gradient}
              />
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* 4. QUICK NAVIGATION SHORTCUTS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={[styles.shortcutGrid, { gap: itemSpacing }]}>
            {quickAccessItems.map(item => (
              <QuickShortcut
                key={item.label}
                {...item}
                onPress={() => handleNavigate(item?.stack, item.screen)}
                style={{ width: shortcutWidth }}
              />
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* 5. BUSINESS OVERVIEW */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Business Overview</Text>
          <BusinessOverviewCard
            onPress={() => handleNavigate('AnalyticsScreen')}
          />
        </View>

        {/* 6. IMPORTANT REMINDERS & ALERTS */}
        {reminders.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Action Required</Text>
            {reminders.map(alert => (
              <TouchableOpacity
                key={alert.id}
                style={styles.reminderCard}
                activeOpacity={0.8}
                onPress={() => handleNavigate('RelevantAlertScreen')}
              >
                <Icon
                  name={alert.icon}
                  type="material"
                  size={22}
                  color={alert.color}
                  containerStyle={{ marginRight: 10 }}
                />
                <Text style={styles.reminderText}>{alert.text}</Text>
                <Icon
                  name="chevron-right"
                  type="material"
                  size={24}
                  color="#AAAAAA"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Divider style={styles.divider} />

        {/* 7. RECENT ACTIVITY */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <Text key={index} style={styles.activityItem}>
                • {activity}
              </Text>
            ))}
          </View>
        </View>

        {/* 8. FOOTER SPACING */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLESHEETS (Primary Action Styles Updated) ---

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: 35,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // --- 1. Header Styles ---
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    backgroundColor: '#007AFF',
    marginRight: 10,
  },
  headerGreeting: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  headerShopName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
  },

  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
  cardOuterContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  touchableArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
    padding: 16,
    justifyContent: 'space-between',
    position: 'relative',
  },
  cardTextGroup: {
    flexDirection: 'column',
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 18,
  },

  // --- General Section Styles ---
  sectionPadding: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 8,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  sectionTitleSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  // --- 2. Primary Action Zone Styles (UPDATED) ---
  primaryActionZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryCardWrapper: {
    flex: 1,
    height: 140, // Large height
    borderRadius: 12,
    // Added elevation/shadow properties here for the "lifted" effect
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5.41,
    overflow: 'hidden', // Crucial for gradient/border radius
  },
  primaryCardGradient: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    justifyContent: 'flex-end',
  },
  primaryCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 10,
  },
  primaryCardSubtitle: {
    fontSize: 14,
    color: '#EEEEEE',
    fontWeight: '500',
  },
  // --- 3. Today Snapshot Styles ---
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  statIconContainer: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  // --- 4. Quick Navigation Styles ---
  shortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  shortcutCard: {
    width: (width - 2 * 16 - 2 * 12) / 3,
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  shortcutIconCircle: {
    backgroundColor: '#E6F0FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  // --- 5. Business Overview Styles ---
  overviewCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  chartPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
    paddingVertical: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  bar: {
    width: '10%',
    borderRadius: 2,
  },
  overviewLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'right',
    marginTop: 5,
  },
  // --- 6. Reminders & Alerts Styles ---
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    justifyContent: 'space-between',
  },
  reminderText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  // --- 7. Recent Activity Styles ---
  activityList: {
    paddingLeft: 10,
  },
  activityItem: {
    fontSize: 14,
    color: '#555',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    lineHeight: 20,
  },
  // --- 8. Footer Spacing ---
  footerSpacing: {
    height: 100,
  },
});
