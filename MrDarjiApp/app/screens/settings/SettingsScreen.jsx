import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../../navigation/AppNavigator';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            signOut();
          } catch (e) {
            console.error('Error during logout:', e);
            Alert.alert('Error', 'Could not complete logout process.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSettingPress = settingName => {
    if (settingName === 'Services') {
      navigation.navigate('ServicesList');
    } else if (settingName === 'ShopProfile') {
      navigation.navigate('ShopProfile');
    } else {
      Alert.alert('Setting Pressed', `You pressed: ${settingName}`);
    }
  };

  const SettingItem = ({ icon, text, onPress, isLogout = false }) => (
    <TouchableOpacity
      style={[styles.item, isLogout && styles.logoutItem]}
      onPress={onPress}
    >
      <View style={styles.iconTextContainer}>
        {icon}
        <Text style={[styles.itemText, isLogout && styles.logoutText]}>
          {text}
        </Text>
      </View>
      {!isLogout && <AntDesign name="right" size={16} color="#B0B0B0" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Settings Section */}
        <Text style={styles.sectionHeader}>Account</Text>
        <SettingItem
          icon={<Ionicons name="person-outline" size={24} color="#333" />}
          text="Edit Profile"
          onPress={() => handleSettingPress('Edit Profile')}
        />

        {/* ShopProfile */}
        <SettingItem
          icon={
            <Ionicons name="document-text-outline" size={24} color="#333" />
          }
          text="Shop Profile"
          onPress={() => handleSettingPress('ShopProfile')}
        />

        {/* Services */}
        <SettingItem
          icon={
            <Ionicons name="document-text-outline" size={24} color="#333" />
          }
          text="Services"
          onPress={() => handleSettingPress('Services')}
        />

        <SettingItem
          icon={<Ionicons name="key-outline" size={24} color="#333" />}
          text="Change Password"
          onPress={() => handleSettingPress('Change Password')}
        />
        <SettingItem
          icon={<Ionicons name="language-outline" size={24} color="#333" />}
          text="Language Preference"
          onPress={() => handleSettingPress('Language')}
        />

        {/* General Settings Section */}
        <Text style={styles.sectionHeader}>General</Text>
        <SettingItem
          icon={<Feather name="bell" size={24} color="#333" />}
          text="Notifications"
          onPress={() => handleSettingPress('Notifications')}
        />

        <SettingItem
          icon={
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#333"
            />
          }
          text="About Mr. Darji"
          onPress={() => handleSettingPress('About')}
        />

        {/* Support Section */}
        <Text style={styles.sectionHeader}>Support</Text>
        <SettingItem
          icon={
            <Ionicons name="document-text-outline" size={24} color="#333" />
          }
          text="Terms & Conditions"
          onPress={() => handleSettingPress('Terms')}
        />

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <SettingItem
            icon={<Ionicons name="log-out-outline" size={24} color="#FF3B30" />}
            text="Log Out"
            onPress={handleLogout}
            isLogout={true}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 25,
    marginBottom: 10,
    paddingLeft: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  logoutItem: {
    borderBottomWidth: 0,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 10,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default SettingsScreen;
