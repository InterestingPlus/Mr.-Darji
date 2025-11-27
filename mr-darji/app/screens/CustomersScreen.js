import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";

// --- SVG Icons ---

// Magnifying Glass Icon (Used in Search Bar)
const MagnifyingGlassIcon = ({ color = "#617589", size = 24 }) => (
  <Svg width={size} height={size} fill={color} viewBox="0 0 256 256">
    <Path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></Path>
  </Svg>
);

// Plus Icon (Used in FAB)
const PlusIcon = ({ color = "#FFFFFF", size = 24 }) => (
  <Svg width={size} height={size} fill={color} viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></Path>
  </Svg>
);

// --- Mock Data ---
// Added mock address and measurements for the CustomerInfoScreen
const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Sophia Clark",
    phone: "+1 (555) 123-4567",
    address: "123 Elm Street, Anytown, USA",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPZIxf5vg9BShZdjiWsTptTBjHeoSN-IRGzEzoOOtgcG3ivKKynHGBCE_CWGGT_2dSY5kzi1EiY-IqnW0Be-e5GBReQTZZXR42xTykhwnUQjP2-vWJK0QsFywq8BMrFq-ocAg20btdW9FoUOJ_T3jrP13FA7Y3BT_3srG7JtXtFevyswxHqSr4DVz5i0Z5aFh3XrzJfGl-HKIcTV75IK9d5F9tRXZBBFMxmdxrU9TINdju0V7PLzvg_5zqBmp8HZ8Z2mS4PItr_jMM",
    measurements: {
      Shirt: {
        Neck: '15.5"',
        Sleeve: '34"',
        Chest: '40"',
        Waist: '32"',
        Shoulder: '18"',
        Length: '28"',
      },
      Pant: {
        Waist: '32"',
        Inseam: '32"',
        Outseam: '42"',
        Thigh: '22"',
        Knee: '16"',
        Cuff: '14"',
      },
    },
  },
  {
    id: "2",
    name: "Ethan Bennett",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Avenue, Otherville, USA",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPQqgDTDzQsUQRW4QqtioyhKb17JmIkAeymE8TkrwGOuRzwM-LxGZRmHzbK_Iu5vx1AUQh2ywuYreqN_PkBCDVKKsznKt1RiOgB05bZe9X6SRS-MGelUDpPUR1cgrVHzy3TAHQe_zRlCooLs2b1ueVh2KaGE85tLGDjDcppd6ae5rwMey3Y8D-IE9Ww2Bp31hi86raHxAoAZsa4jCHYYIrDfy0Db3h92Lsz-BJ5Y2gt08FUHjymiFvKyoRKG6JSnmHEAu2NIqGx-0h6wZQJtgBStB_VYML5pb8nw0DCIL1Y9M0_zhPy7ZTqWCpJdP_OkC8pQlbYZONZvlbmatlmH6wdmZ5omHM7iNF",
    measurements: {
      Shirt: {
        Neck: '16"',
        Sleeve: '35"',
        Chest: '42"',
        Waist: '34"',
        Shoulder: '19"',
        Length: '29"',
      },
      Pant: {
        Waist: '34"',
        Inseam: '33"',
        Outseam: '43"',
        Thigh: '23"',
        Knee: '17"',
        Cuff: '15"',
      },
    },
  },
  {
    id: "3",
    name: "Olivia Carter",
    phone: "+1 (555) 246-8013",
    address: "789 Pine Lane, Somewhere, USA",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDvUJ-0MczFsjAR_53uUxjy1MNai7BwlpNkprSpR2Lpd6iExF2165nEzDOkubO1ceOWYwGPr30icdlL3FrtEfxF61UXzXGaCvp5FuDRCcWfeePobBx-yboLSkxxJrJEjJQJoNknnZcRqTNoJGTsCw95WcUz1u1c1HEZPEQX4XBxdsLUaYh1Wcla_O7mMjegHtFUOqg7utFZcRfHdX7YPefrTwcIDPUe5Xz0JTppS_BYCjOvekogerIOAiF3wTNlxFjCzlZDKBhfGfzf",
    measurements: {
      Shirt: {
        Neck: '14"',
        Sleeve: '32"',
        Chest: '36"',
        Waist: '28"',
        Shoulder: '16"',
        Length: '26"',
      },
      Pant: {
        Waist: '28"',
        Inseam: '30"',
        Outseam: '40"',
        Thigh: '20"',
        Knee: '14"',
        Cuff: '12"',
      },
    },
  },
  // Remaining customers just get the default measurements for simplicity
  {
    id: "4",
    name: "Liam Davis",
    phone: "+1 (555) 135-7911",
    address: "987 Birch St, Villageland, USA",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXlfQ16LG7NnTgNu69qlkzTcSr6pJVZQ_3Njx-Lv28QJiK34bMO76BPR95Mlsgc7fWNH83W1FDRxgdFXq00O1SFUSf8KyGm3eTLMO5P3uJIeXhvIpxCGxDVeAEBfsFJWWZUYnkd6hy8Up9Ouu8yS0Sei6XNzIdS3axqwr1IAhIomE1mzekbGdWVw2xTJEfZOfkiN7M8AayMw2bUgsom9ED3x6VW_mW0LIZY8lFrFO4sif32O0KqusOLYLfMU9kdM4mGaK_nLvYmZub",
    measurements: {
      Shirt: {
        Neck: '15"',
        Sleeve: '33"',
        Chest: '38"',
        Waist: '30"',
        Shoulder: '17"',
        Length: '27"',
      },
      Pant: {
        Waist: '30"',
        Inseam: '31"',
        Outseam: '41"',
        Thigh: '21"',
        Knee: '15"',
        Cuff: '13"',
      },
    },
  },
  {
    id: "5",
    name: "Ava Evans",
    phone: "+1 (555) 369-2580",
    address: "654 Cedar Rd, Townsville, USA",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBu8-euXEkTVOZTYHymu7Vpr9whxkn_mlfd7qLM8kLfvZNovt_haZj5MaWMdHOIQcOyESEwgSqiw16NnNxAxaZS5D5d24G4BT44i3Zk1Mf9dBdZbbegYvx-nhOvvabi1ivsdiyP-rYcboaoaywVzFdiuyOT4lP-M9ALZzR7Q2sFb5zzcM4MEEemTzO2nNTD8QzpBZho50nY8Yhw_8_GAabLqDJa55Agu39Ra3VhoCC4vBtRLE3pHvhH5gznh2zsU4BOuszJYMxyRYa2",
    measurements: {
      Shirt: {
        Neck: '15"',
        Sleeve: '33"',
        Chest: '38"',
        Waist: '30"',
        Shoulder: '17"',
        Length: '27"',
      },
      Pant: {
        Waist: '30"',
        Inseam: '31"',
        Outseam: '41"',
        Thigh: '21"',
        Knee: '15"',
        Cuff: '13"',
      },
    },
  },
  {
    id: "6",
    name: "Noah Foster",
    phone: "+1 (555) 789-0123",
    address: "321 Poplar Dr, Cityland, USA",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2QbNi7OpE-znIkFODyNLU8A7o9B0wn1PPAgXD0yqggw20GJU3POPV9FIiOnEzFEHz8Xv8584gPO805axlHkNvv-Cxva9wcVIkc_lQNkJtJT_tqw0iefzRPktGOddAkk5dSTiA4GNl92Lsz-BJ5Y2gt08FUHjymiFvKyoRKG6JSnmHEAu2NIqGx-0h6wZQJtgBStB_VYML5pb8nw0DCIL1Y9M0_zhPy7ZTqWCpJdP_OkC8pQlbYZONZvlbmatlmH6wdmZ5omHM7iNF",
    measurements: {
      Shirt: {
        Neck: '15"',
        Sleeve: '33"',
        Chest: '38"',
        Waist: '30"',
        Shoulder: '17"',
        Length: '27"',
      },
      Pant: {
        Waist: '30"',
        Inseam: '31"',
        Outseam: '41"',
        Thigh: '21"',
        Knee: '15"',
        Cuff: '13"',
      },
    },
  },
];

// --- Customer List Item Component ---

const CustomerListItem = ({ customer, navigation }) => {
  // Navigate to the Customer Info screen, passing the customer object
  const handlePress = () => {
    navigation.navigate("CustomerInfo", { customer });
  };

  return (
    <TouchableOpacity style={styles.listItemContainer} onPress={handlePress}>
      {/* Avatar */}
      <Image
        source={{ uri: customer.avatarUrl }}
        style={styles.avatar}
        accessibilityLabel={`${customer.name}'s profile picture`}
      />
      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {customer.name}
        </Text>
        <Text style={styles.phoneText} numberOfLines={1}>
          {customer.phone}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Main Customers Screen Component ---

export default function CustomersScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");

  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.phone.includes(searchText)
  );

  const handleAddCustomer = () => {
    console.log("Navigate to Add New Customer screen");
    // navigation.navigate('AddCustomer'); // In a real app
  };

  return (
    <View style={styles.fullScreenContainer}>
      {/* Header Area */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
      </View>

      {/* Scrollable Content (Search and List) */}
      <ScrollView style={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBarInputGroup}>
            {/* Search Icon */}
            <View style={styles.searchIconContainer}>
              <MagnifyingGlassIcon />
            </View>
            {/* Search Input */}
            <TextInput
              placeholder="Search customers"
              placeholderTextColor="#617589"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Customer List */}
        <View style={styles.listSection}>
          {filteredCustomers.map((customer) => (
            <CustomerListItem
              key={customer.id}
              customer={customer}
              navigation={navigation}
            />
          ))}
          {filteredCustomers.length === 0 && (
            <Text style={styles.noResultsText}>
              No customers found matching "{searchText}"
            </Text>
          )}
        </View>

        {/* Bottom Spacer/Padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleAddCustomer}
          activeOpacity={0.8}
        >
          <PlusIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Stylesheet ---

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111418",
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBarInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: "#f0f2f4",
    borderRadius: 8,
  },
  searchIconContainer: {
    paddingLeft: 16,
    height: "100%",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#111418",
  },
  listSection: {
    // Corresponds to the main content div below the search bar
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f4",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: "#ccc",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111418",
  },
  phoneText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#617589",
  },
  noResultsText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    color: "#617589",
  },
  fabWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  fabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 8,
    backgroundColor: "#1380ec",
    paddingHorizontal: 24,
    minWidth: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  bottomSpacer: {
    height: 76,
  },
});
