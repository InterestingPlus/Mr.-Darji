// ServicesListScreen.js - UPDATED

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import BASE_URL from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// import { fetchServices } from '../api/servicesApi'; // Mock API function

const ServicesListScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await axios.get(`${BASE_URL}/api/services`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const apiData = response.data.data;
        setServices(apiData || []);
      } catch (err) {
        Alert.alert("Failed to fetch services", err);
        setError(
          "Could not load services. Please check your internet connection."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);
  // -----------------------------------

  const navigateToAddService = () => {
    navigation.navigate("AddEditService", { mode: "add" });
  };

  const navigateToEditService = (service) => {
    navigation.navigate("AddEditService", {
      mode: "edit",
      serviceData: service,
    });
  };

  const navigateToServiceDetails = (service) => {
    navigation.navigate("ServiceDetail", { serviceData: service });
  };

  // --- Components ---

  const ServiceCard = ({ service }) => {
    const defaultImageUri =
      "https://via.placeholder.com/150/DDDDDD/666666?text=No+Image"; // Default image

    return (
      <Card containerStyle={styles.cardContainer}>
        <TouchableOpacity onPress={() => navigateToServiceDetails(service)}>
          <View style={styles.cardContent}>
            {/* Service Image (Thumbnail) */}
            <Image
              source={{
                uri: JSON.parse(service.images || [])?.[0] || defaultImageUri,
              }}
              style={styles.cardImage}
              resizeMode="cover"
            />

            <View style={styles.textDetails}>
              {/* Service Name */}
              <Text style={styles.serviceName} numberOfLines={1}>
                {service.name}
              </Text>

              {/* Short Description */}
              <Text style={styles.shortDescription} numberOfLines={2}>
                {service.description}
              </Text>

              {/* Price & Estimated Days */}
              <View style={styles.priceDaysRow}>
                <Text style={styles.priceText}>
                  ₹ {service.price.toLocaleString("en-IN")}
                </Text>
                <Text style={styles.daysText}>
                  Est. {service.estimated_days} Days
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Button
            title="View Details"
            type="clear"
            titleStyle={[styles.actionTitle, { color: "#007AFF" }]} // Blue
            onPress={() => navigateToServiceDetails(service)}
            icon={
              <Icon
                name="info-outline"
                size={16}
                color="#007AFF"
                style={{ marginRight: 4 }}
              />
            }
          />
          <Button
            title="Edit"
            type="clear"
            titleStyle={[styles.actionTitle, { color: "#9D4EDD" }]} // Purple Accent
            onPress={() => navigateToEditService(service)}
            icon={
              <Icon
                name="edit"
                size={16}
                color="#9D4EDD"
                style={{ marginRight: 4 }}
              />
            }
          />
        </View>
      </Card>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="content-cut" type="material" size={80} color="#CCCCCC" />
      <Text style={styles.emptyHeader}>No services added yet</Text>
      <Text style={styles.emptyText}>
        Add your first service to start taking orders
      </Text>
      {/* FAB will handle the navigation */}
    </View>
  );

  // --- Main Render ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Services</Text>
          <Text style={styles.subtitle}>Your stitching services & pricing</Text>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your services...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : services.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {services.map((service) => (
            <ServiceCard key={service.service_id} service={service} />
          ))}
        </ScrollView>
      )}

      {/* Primary CTA: FAB */}
      <TouchableOpacity style={styles.fab} onPress={navigateToAddService}>
        <Icon name="add" color="#FFFFFF" size={30} />
      </TouchableOpacity>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    padding: 30,
    fontSize: 16,
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingTop: 50, // Increased spacing from top
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  subtitle: {
    fontSize: 15,
    color: "#888888",
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 100, // Space for FAB
  },
  cardContainer: {
    borderRadius: 12,
    marginHorizontal: 5,
    marginTop: 15,
    padding: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    padding: 15,
    paddingBottom: 0,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "#E0E0E0",
  },
  textDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 4,
  },
  shortDescription: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 8,
  },
  priceDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  priceText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#00A896", // Teal Blue (Professional/Clean Price Color)
  },
  daysText: {
    fontSize: 14,
    color: "#888888",
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    marginTop: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 80,
  },
  emptyHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    marginVertical: 10,
  },
  // FAB Styles
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 25,
    bottom: 25,
    backgroundColor: "#007AFF", // Primary Blue
    borderRadius: 30,
    elevation: 6, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default ServicesListScreen;
