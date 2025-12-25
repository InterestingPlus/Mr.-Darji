// ShopProfileScreen.js (Darji Bhai ka View)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Icon, Button, Divider } from 'react-native-elements';
import moment from 'moment';
import axios from 'axios';
import BASE_URL, { WEB_URL } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- MOCK DATA BASED ON FINAL MONGODB SCHEMA ---
// Production mein, yeh data API se fetch hoga
const mockShopData = {
  _id: '60c72b1f9b3e1e001c8e4d1a',
  shopCode: 'MRD-RAJ-0011',
  owner_id: 'user123',
  name: 'Ramesh Tailors & Boutique',
  slug: 'ramesh-tailors',
  shopType: 'Boutique',
  tagline: 'Custom Stitching Since 1995',

  logo: {
    url: 'https://via.placeholder.com/100/1E90FF/FFFFFF?text=RT',
    publicId: 'logo_rt',
  },
  coverImage: {
    url: 'https://via.placeholder.com/600x200/4682B4/FFFFFF?text=Shop+Cover',
    publicId: 'cover_rt',
  },
  gallery: [
    {
      url: 'https://via.placeholder.com/150/008080/FFFFFF?text=Work+1',
      type: 'work',
    },
    {
      url: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Design+2',
      type: 'design',
    },
  ],

  contact: {
    phone: '+91 98765 43210',
    alternatePhone: '+91 88888 77777',
    whatsappNumber: '9876543210',
    googleMap: 'https://maps.app.goo.gl/example',
    address: {
      line1: 'Shop No 10, Near City Mall',
      area: 'Rajendra Nagar',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      pincode: '302001',
    },
    workingHours: {
      monday: { open: '09:00', close: '19:00' } /* ... other days */,
    },
  },
  socialLinks: {
    instagram: 'ramesh.tailors',
    facebook: 'rameshTailorsJaipur',
    googleBusiness: 'rameshTailorsGBP',
    website: 'https://ramesh-tailors.com',
  },
  about: {
    description:
      'We specialize in high-end ethnic and western wear for women. With 25 years of experience, we guarantee perfect fit and finish for all your tailoring needs.',
    experienceYears: 25,
    specialities: [
      'Blouse Design',
      'Bridal Wear',
      'Lehenga Choli',
      'Western Gowns',
    ],
  },
  verification: {
    phoneVerified: true,
    kycStatus: 'verified', // "pending", "verified", "rejected", "not_applied"
    verifiedAt: new Date(),
    documents: {
      ownerIdProof: 'URL/ID',
      shopLicense: 'URL/ID',
      gstNumber: 'N/A',
    },
  },
  memberSince: new Date('2024-01-01T00:00:00Z'),
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-12-14T10:00:00Z'),
};

// --- PROFILE COMPLETION LOGIC ---
const calculateCompletion = shop => {
  let completedSteps = 0;

  // Total possible points: 100
  // Basic Info: 20%
  if (shop.name && shop.shopType && shop.tagline) completedSteps += 10;
  if (shop.logo?.url) completedSteps += 10;

  // Contact + Social: 20%
  if (shop.contact?.phone && shop.contact.address?.pincode)
    completedSteps += 10;
  if (shop.socialLinks?.instagram || shop.socialLinks?.facebook)
    completedSteps += 10;

  // Services (Assuming services are managed in a separate collection/count is available)
  // We'll mock this for now, assume 3 services = full 30%
  // In real-world, you'd check a services collection count.
  completedSteps += 30; // Mocked

  // Gallery: 10%
  if (shop.gallery && shop.gallery.length >= 3) completedSteps += 10;

  // KYC: 20%
  if (shop?.verification?.kycStatus === 'verified') completedSteps += 20;

  return Math.min(100, completedSteps);
};

const ShopProfileScreen = ({ navigation }) => {
  const [shopData, setShopData] = useState(mockShopData);
  const [isLoading, setIsLoading] = useState(false); // Assume initial load is done

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);

        const token = await AsyncStorage.getItem('userToken');

        const response = await axios.get(`${BASE_URL}/api/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
        const apiData = response.data;
        setShopData(apiData || {});
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
      }

      setIsLoading(false);
    };

    fetchShopData();
  }, []);

  const profileCompletion = calculateCompletion(shopData);
  const isPublicEligible =
    profileCompletion >= 80 && shopData?.verification?.kycStatus === 'verified';

  const handleEditProfile = () => {
    navigation.navigate('EditShopProfile', {
      shopData: shopData,
    });
  };

  const handleViewPublicProfile = () => {
    console.log('clicked');
    if (shopData?.slug) {
      console.log('redirecting');
      // Redirect to the public view Website
      Linking.openURL(`https://mr-darji.netlify.app/shop/${shopData.slug}`);
    } else {
      Alert.alert(
        'Action Required',
        'Profile must be 80% complete and KYC Verified to view public profile.',
      );
    }
  };

  const handleApplyVerification = () => {
    // Navigate to the KYC document upload screen
    navigation.navigate('KYCDocumentUpload');
  };

  // --- Components ---

  const SectionHeader = ({ title, iconName }) => (
    <View style={styles.sectionHeaderContainer}>
      <Icon
        name={iconName}
        type="material"
        size={24}
        color="#333"
        style={{ marginRight: 8 }}
      />
      <Text style={styles?.sectionHeaderTitle}>{title}</Text>
    </View>
  );

  const DetailItem = ({ label, value, icon, link = false }) => (
    <View style={styles.detailItem}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', width: '35%' }}
      >
        <Icon
          name={icon}
          type="material"
          size={16}
          color="#777"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text
        style={[styles.detailValue, link && styles.linkText]}
        numberOfLines={1}
      >
        {value || 'N/A'}
      </Text>
    </View>
  );

  // --- Main Render ---

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#007AFF"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. Header (Editable Preview) */}
        <View style={styles.headerContainer}>
          {/* Cover Image */}
          <Image
            source={{ uri: shopData?.coverImage?.url || '' }}
            style={styles.coverImage}
          />

          <View style={styles.headerDetails}>
            {/* Logo and Name */}
            <View style={styles.logoNameRow}>
              <View style={styles.logoWrapper}>
                <Image
                  source={{ uri: shopData?.logo?.url || '' }}
                  style={styles.shopLogo}
                />

                {shopData?.verification?.kycStatus === 'verified' && (
                  <Icon
                    name="verified"
                    type="material"
                    size={20}
                    color="#007AFF"
                    containerStyle={styles.verifiedBadge}
                  />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.shopName}>{shopData.name}</Text>
                </View>
                <Text style={styles.shopTagline}>{shopData.tagline}</Text>
              </View>
            </View>

            {/* Profile Completion */}
            <View style={styles.completionBarContainer}>
              <Text style={styles.completionText}>
                Profile Completion: **{profileCompletion}%**{' '}
                {isPublicEligible
                  ? ' (Eligible for Public View)'
                  : ' (Needs more steps)'}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${profileCompletion}%` },
                  ]}
                />
              </View>
            </View>

            {/* CTAs */}
            <View style={styles.ctaRow}>
              <Button
                title="Edit Profile"
                type="solid"
                onPress={handleEditProfile}
                buttonStyle={styles.editButton}
                titleStyle={styles.editButtonTitle}
                icon={
                  <Icon
                    name="edit"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginRight: 5 }}
                  />
                }
              />
              <Button
                title="View Public Profile"
                type="outline"
                onPress={handleViewPublicProfile}
                buttonStyle={[
                  styles.viewButton,
                  !isPublicEligible && styles.disabledViewButton,
                ]}
                titleStyle={[
                  styles.viewButtonTitle,
                  !isPublicEligible && styles.disabledViewTitle,
                ]}
              />
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* 2. Contact & Social Links (Editable) */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="Contact & Social Links" iconName="share" />

          <DetailItem
            label="Mobile Number"
            value={shopData?.contact?.phone}
            icon="call"
          />
          <DetailItem
            label="Alternate No."
            value={shopData?.contact?.alternatePhone}
            icon="phone-android"
          />

          <DetailItem
            label="WhatsApp Link"
            value={`wa.me/${shopData?.contact?.whatsappNumber}`}
            icon="whatsapp"
            type="font-awesome"
            link
          />

          <Text style={styles.addressTitle}>Address:</Text>
          <Text style={styles.addressText}>
            {shopData?.contact?.address.line1},{' '}
            {shopData?.contact?.address.area},{shopData?.contact?.address.city},{' '}
            {shopData?.contact?.address.pincode}
          </Text>
          <DetailItem
            label="Google Maps"
            value="View Pin"
            icon="location-pin"
            link
          />

          <Divider style={{ marginVertical: 15 }} />

          <Text style={styles.socialHeader}>Online Presence</Text>
          <DetailItem
            label="Instagram"
            value={shopData?.socialLinks?.instagram}
            icon="instagram"
            type="font-awesome"
            link
          />
          <DetailItem
            label="Facebook"
            value={shopData?.socialLinks?.facebook}
            icon="facebook-square"
            type="font-awesome"
            link
          />
          <DetailItem
            label="Website"
            value={shopData?.socialLinks?.website}
            icon="web"
            link
          />
        </View>

        <Divider style={styles.divider} />

        {/* 3. About Shop */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="About Shop" iconName="store" />

          <Text style={styles.aboutDescription}>
            {shopData?.about?.description}
          </Text>

          <DetailItem
            label="Experience"
            value={`${shopData?.about?.experienceYears} Years`}
            icon="schedule"
          />

          <Text style={styles.specialityTitle}>Specialities:</Text>
          <View style={styles.specialityTags}>
            {shopData?.about?.specialities.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* 4. Verification & Documents (Private) */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Verification & KYC Status"
            iconName="security"
          />

          <DetailItem
            label="Shop Code"
            value={shopData?.shopCode}
            icon="qr-code-2"
          />
          <DetailItem
            label="KYC Status"
            value={shopData?.verification?.kycStatus?.toUpperCase()}
            icon="verified-user"
          />

          <Text style={styles.documentStatus}>
            Uploaded Documents:{' '}
            {shopData?.verification?.kycStatus === 'verified'
              ? 'All Required'
              : 'N/A'}
          </Text>

          {shopData?.verification?.kycStatus !== 'verified' && (
            <Button
              title="Apply for Verification"
              type="solid"
              onPress={handleApplyVerification}
              buttonStyle={styles.verifyButton}
              titleStyle={styles.verifyButtonTitle}
              containerStyle={{ marginTop: 15 }}
            />
          )}
        </View>

        <View style={styles.memberSinceContainer}>
          <Text style={styles.memberSinceText}>
            Member Since: {moment(shopData.memberSince).format('MMMM YYYY')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 8,
    marginVertical: 15,
  },
  // --- Header Section ---
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#AAAAAA',
  },
  headerDetails: {
    paddingHorizontal: 20,
  },
  logoNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: -50,
  },
  logoWrapper: {
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 1,
  },

  shopLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#E0E0E0',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  shopTagline: {
    fontSize: 14,
    color: '#777777',
    marginTop: 2,
  },
  completionBarContainer: {
    marginTop: 20,
  },
  completionText: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50', // Success Green
    borderRadius: 4,
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    marginRight: 10,
  },
  editButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  viewButton: {
    borderColor: '#007AFF',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
  },
  viewButtonTitle: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledViewButton: {
    borderColor: '#AAAAAA',
    backgroundColor: 'transparent',
  },
  disabledViewTitle: {
    color: '#AAAAAA',
  },

  // --- General Section Styles ---
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  // --- Detail Item Styles ---
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#777',
  },
  detailValue: {
    fontSize: 15,
    color: '#333333',
    maxWidth: '60%',
    textAlign: 'right',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // --- Contact/Address ---
  addressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
  },
  addressText: {
    fontSize: 15,
    color: '#333333',
    marginTop: 5,
    lineHeight: 22,
  },
  socialHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#444',
    marginBottom: 5,
    marginTop: 10,
  },
  // --- About Shop ---
  aboutDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 15,
  },
  specialityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
  },
  specialityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E1F5FE', // Light Blue/Cyan
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#0288D1', // Darker Blue
    fontSize: 13,
    fontWeight: '600',
  },
  // --- Verification ---
  documentStatus: {
    fontSize: 14,
    color: '#555',
    marginTop: 15,
  },
  verifyButton: {
    backgroundColor: '#FF9800', // Orange for urgent action
    borderRadius: 8,
  },
  verifyButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  // --- Footer ---
  memberSinceContainer: {
    alignItems: 'center',
    padding: 10,
  },
  memberSinceText: {
    fontSize: 13,
    color: '#999999',
  },
});

export default ShopProfileScreen;
