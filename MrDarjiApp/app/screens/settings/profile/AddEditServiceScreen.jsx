// AddEditServiceScreen.js - UPDATED with Image Picker & Base64 Conversion Logic

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
// Install this library: npm install react-native-image-picker
// import * as ImagePicker from "expo-image-picker";
import BASE_URL from '../../../config'; // Assuming this is defined

const AddEditServiceScreen = ({ route, navigation }) => {
  const { mode, serviceData, from = null, customer = null } = route.params;

  const initialState = {
    name: '',
    price: '',
    estimated_days: '',
    description: '',
    images: [], // Stores Base64 string (data:image/jpeg;base64,....) or image URLs
  };

  const [formData, setFormData] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // --- Data Pre-fill for Edit Mode & Title Setting ---
  useEffect(() => {
    if (mode === 'edit' && serviceData) {
      // Images coming from backend will be an array of URLs,
      // but if you switch to Base64 storing, ensure to handle both types.
      let existingImages = [];
      try {
        existingImages = JSON.parse(serviceData.images || '[]');
      } catch (e) {
        // Fallback for non-JSON string images
        existingImages = Array.isArray(serviceData.images)
          ? serviceData.images
          : [];
      }

      setFormData({
        name: serviceData.name || '',
        price: String(serviceData.price || ''),
        estimated_days: String(serviceData.estimated_days || ''),
        description: serviceData.description || '',
        images: existingImages,
      });
      navigation.setOptions({ title: 'Edit Service' });
    } else {
      navigation.setOptions({ title: 'Add New Service' });
    }
  }, [mode, serviceData, navigation]);
  // -----------------------------------

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, price, estimated_days } = formData;
    if (!name.trim()) return 'Service Name is required.';
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
      return 'Valid Base Price is required.';
    if (
      !estimated_days ||
      isNaN(Number(estimated_days)) ||
      Number(estimated_days) <= 0
    )
      return 'Valid Estimated Days is required.';
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      estimated_days: Number(formData.estimated_days),
      // Base64 data ko stringify karke bhejna (API should be ready to accept Base64 array)
      images: JSON.stringify(formData.images),
    };

    setIsSaving(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url =
        mode === 'edit'
          ? `${BASE_URL}/api/services/${serviceData.service_id}`
          : `${BASE_URL}/api/services`;
      const method = mode === 'edit' ? axios.put : axios.post;

      const response = await method(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert(
        'Success',
        `Service has been ${
          mode === 'edit' ? 'updated' : 'added'
        } successfully.`,
      );

      setFormData(initialState);

      if (mode !== 'edit') {
        if (from === 'CreateOrder') {
          navigation.navigate('Orders', {
            screen: 'CreateOrder',
            params: {
              service: response?.data?.service || {},
              customer: customer || {},
            },
          });
        } else {
          navigation.navigate('ServicesList');
        }
      } else {
        navigation.navigate('ServicesList');
      }
    } catch (error) {
      console.error('Save failed:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        `Failed to ${
          mode === 'edit' ? 'update' : 'add'
        } service. Please try again.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  // --- UPDATED Image Upload Logic ---
  const handleImageUpload = async () => {
    //     if (formData.images.length >= 5) {
    //       Alert.alert("Limit Reached", "You can upload a maximum of 5 images.");
    //       return;
    //     }
    //     // Configuration for Image Picker
    //     const options = {
    //       //   mediaType: "photo",
    //       //   includeBase64: true,
    //       //   maxWidth: 800,
    //       //   maxHeight: 800,
    //       //   quality: 0.7
    //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //       allowsEditing: true,
    //       quality: 0.7,
    //       base64: true,
    //     };
    //     setIsImageUploading(true);
    //     try {
    //       const permission =
    //         await ImagePicker.requestMediaLibraryPermissionsAsync();
    //       if (!permission.granted) {
    //         alert("Permission required!");
    //         return;
    //       }
    //       const result = await ImagePicker.launchImageLibraryAsync(options);
    //       if (result.canceled) {
    //         console.log("User cancelled image picker");
    //         return;
    //       } else if (result.errorCode) {
    //         Alert.alert("Image Error", result.errorMessage);
    //         return;
    //       }
    //       if (result.assets && result.assets.length > 0) {
    //         const asset = result.assets[0];
    //         // Base64 Data URL format: data:image/jpeg;base64,BASE64_STRING
    //         const base64DataUrl = `data:${asset.type || "image/jpeg"};base64,${
    //           asset.base64
    //         }`;
    //         setFormData((prev) => ({
    //           ...prev,
    //           images: [...prev.images, base64DataUrl],
    //         }));
    //       }
    //     } catch (e) {
    //       console.error("Image Picker Error:", e);
    //       Alert.alert(
    //         "Image Upload Failed",
    //         "Could not pick image. Check permissions."
    //       );
    //     } finally {
    //       setIsImageUploading(false);
    //     }
  };
  // ------------------------------------

  const removeImage = index => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Helper function to render image source (Base64 or URL)
  const renderImageSource = imageUri => {
    // Check if it's a Base64 string (starts with data:) or a simple URL
    return imageUri.startsWith('data:') ? { uri: imageUri } : { uri: imageUri };
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>
            {' '}
            {mode === 'edit' ? 'Edit Service Details' : 'Add a New Service'}
          </Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() =>
              navigation.navigate('Settings', { screen: 'SettingsScreen' })
            }
          >
            <Text style={styles.cancelIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* --- 🧱 Basic Info Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Basic Info</Text>

          <Text style={styles.label}>* Service Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Shirt Stitching, Blouse Stitching"
            value={formData.name}
            onChangeText={text => handleChange('name', text.slice(0, 80))}
            maxLength={80}
          />

          <Text style={styles.label}>* Base Price (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Base Price (e.g., 450)"
            value={formData.price}
            onChangeText={text =>
              handleChange('price', text.replace(/[^0-9]/g, ''))
            }
            keyboardType="numeric"
          />

          <Text style={styles.label}>* Estimated Delivery Time (Days)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Estimated Days (e.g., 3)"
            value={formData.estimated_days}
            onChangeText={text =>
              handleChange('estimated_days', text.replace(/[^0-9]/g, ''))
            }
            keyboardType="numeric"
          />
        </View>

        {/* --- 📝 Description Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe fabric type, style, fitting, or special notes"
            value={formData.description}
            onChangeText={text => handleChange('description', text)}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.guidelineText}>
            This description will help customers and may be used for search
            indexing.
          </Text>
        </View>

        {/* --- 📸 Images Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            Service Images ({formData.images.length} / 5)
          </Text>
          <View style={styles.imageContainer}>
            {/* Display existing images */}
            {formData.images.map((imageUri, index) => (
              <View key={index} style={styles.imageThumbnailWrapper}>
                <Image
                  source={renderImageSource(imageUri)} // Use helper function
                  style={styles.imageThumbnail}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                  disabled={isSaving}
                >
                  <Icon name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Upload Button */}
            {formData.images.length < 5 && (
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={handleImageUpload}
                disabled={isSaving || isImageUploading}
              >
                {isImageUploading ? (
                  <ActivityIndicator size="small" color="#007AFF" />
                ) : (
                  <>
                    <Icon
                      name="cloud-upload"
                      type="material"
                      size={30}
                      color="#007AFF"
                    />
                    <Text style={styles.uploadText}>Upload Image</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.guidelineText}>
            Clear images increase customer trust. Supported: JPG / PNG.
          </Text>
        </View>
      </ScrollView>

      {/* --- 💾 Action Buttons (Footer) --- */}
      <View style={styles.footer}>
        <Button
          title="Cancel"
          type="outline"
          containerStyle={{ flex: 1, marginRight: 10 }}
          buttonStyle={styles.cancelButton}
          titleStyle={styles.cancelTitle}
          onPress={() => navigation.goBack()}
          disabled={isSaving}
        />
        <Button
          title={mode === 'edit' ? 'Save Changes' : 'Save Service'}
          containerStyle={{ flex: 2 }}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveTitle}
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
        />
      </View>
    </View>
  );
};

// --- Stylesheet --- (No changes needed here, keeping previous styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 8,
  },
  cancelIcon: {
    fontSize: 20,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    paddingTop: 10,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  guidelineText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  uploadBox: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#F0F8FF',
  },
  uploadText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
    textAlign: 'center',
  },
  imageThumbnailWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  cancelButton: {
    borderColor: '#DDDDDD',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
  cancelTitle: {
    color: '#555555',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
  saveTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddEditServiceScreen;
