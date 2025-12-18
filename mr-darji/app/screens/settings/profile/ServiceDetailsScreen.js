// ServiceDetailViewScreen.js - UPDATED with Image Indicator

import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import moment from "moment"; // For date formatting

const { width } = Dimensions.get("window");

const ServiceDetailViewScreen = ({ route, navigation }) => {
  // serviceData will come from navigation params
  const initialServiceData = route.params.serviceData || null;

  const [service, setService] = useState(initialServiceData);
  const [isLoading, setIsLoading] = useState(!initialServiceData);
  const [error, setError] = useState(null);
  // State for image pagination (new)
  const [activeIndex, setActiveIndex] = useState(0);

  // Function to safely parse images array
  const getImages = (data) => {
    // Check if data.images is already an array (passed from list screen)
    if (Array.isArray(data?.images)) {
      return data.images;
    }
    // Handle case where images might be stored as a JSON string (less common but handled for robustness)
    try {
      if (data?.images) {
        return JSON.parse(data.images);
      }
    } catch (e) {
      console.error("Error parsing images:", e);
    }
    return [];
  };

  const handleEdit = () => {
    navigation.navigate("AddEditService", {
      mode: "edit",
      serviceData: service,
    });
  };

  // --- New Logic for Image Indicator ---
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    // Calculate the index of the currently visible image
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  const serviceImages = getImages(service);
  const hasImages = serviceImages.length > 0;
  // ------------------------------------

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Fetching service details...</Text>
      </View>
    );
  }

  if (error || !service) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="error-outline" size={60} color="#FF3B30" />
        <Text style={styles.errorText}>
          {error || "Service details not found."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* --- Service Image Gallery --- */}
        <View>
          {hasImages ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.gallery}
              onScroll={handleScroll} // Attach scroll event handler
              scrollEventThrottle={16} // Control how often the scroll event fires
            >
              {serviceImages.map((imageUri, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUri }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.defaultImageContainer}>
              <Icon
                name="image-not-supported"
                type="material"
                size={50}
                color="#AAAAAA"
              />
              <Text style={styles.defaultImageText}>
                No service images available
              </Text>
            </View>
          )}

          {/* --- Image Indicator (Pagination Dots) --- */}
          {hasImages && (
            <View style={styles.indicatorContainer}>
              {serviceImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === activeIndex
                      ? styles.activeDot
                      : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.detailsBlock}>
          {/* --- Name & Price --- */}
          <Text style={styles.serviceName}>{service.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>
              ₹ {service.price.toLocaleString("en-IN")}
            </Text>
            <View style={styles.badge}>
              <Icon
                name="timer"
                size={14}
                color="#555"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.daysText}>
                Est. {service.estimated_days} Days
              </Text>
            </View>
          </View>

          {/* --- Full Description --- */}
          <Text style={styles.sectionHeader}>Full Description</Text>
          <Text style={styles.descriptionText}>
            {service.description ||
              "No detailed description provided for this service."}
          </Text>

          {/* --- Created / Updated Date --- */}
          <Text style={styles.sectionHeader}>Metadata</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Created:</Text>
            <Text style={styles.metadataValue}>
              {service.created_at
                ? moment(service.created_at).format("Do MMM YYYY, h:mm a")
                : "N/A"}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Last Updated:</Text>
            <Text style={styles.metadataValue}>
              {service.updated_at
                ? moment(service.updated_at).format("Do MMM YYYY, h:mm a")
                : "N/A"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* --- Action Button --- */}
      <View style={styles.footer}>
        <Button
          title="Edit Service"
          buttonStyle={styles.editButton}
          titleStyle={styles.editButtonTitle}
          onPress={handleEdit}
          icon={<Icon name="edit" size={24} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContainer: {
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
    fontSize: 18,
    color: "#FF3B30",
    marginTop: 10,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  // Gallery Styles
  gallery: {
    height: width * 0.7, // 70% of screen width for image height
    backgroundColor: "#FFFFFF",
  },
  galleryImage: {
    width: width, // Full width for each image
    height: "100%",
  },
  defaultImageContainer: {
    width: width,
    height: width * 0.7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    padding: 20,
  },
  defaultImageText: {
    marginTop: 8,
    color: "#666666",
    fontSize: 16,
  },
  // Image Indicator Styles (New)
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FFFFFF", // White dot for active image
    width: 16, // Slightly wider active dot
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Transparent white for inactive
  },
  // Details Block Styles
  detailsBlock: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 80, // Space for footer
  },
  serviceName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    marginBottom: 20,
  },
  priceText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00A896",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  daysText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555555",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginTop: 15,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666666",
    marginBottom: 10,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555555",
    width: "35%",
  },
  metadataValue: {
    fontSize: 14,
    color: "#777777",
    width: "60%",
    textAlign: "right",
  },
  // Footer/Action Button
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  editButton: {
    backgroundColor: "#9D4EDD",
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  editButtonTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
});

export default ServiceDetailViewScreen;
