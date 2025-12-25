import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../navigation/AppNavigator';
import BASE_URL from '../../config';

// --- Icon Component (Mimicking Lucide Icons) ---
const Icon = ({ name, style, onPress }) => {
  let iconContent;
  let size = 24;

  switch (name) {
    case 'Mail':
      iconContent = '📞';
      break;
    case 'Lock':
      iconContent = '🔒';
      break;
    case 'ArrowLeft':
      iconContent = '←';
      size = 28;
      break;
    case 'Eye':
      iconContent = '👁️';
      break;
    case 'EyeOff':
      iconContent = '🚫';
      break;
    default:
      iconContent = '?';
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} style={style}>
      <Text style={{ fontSize: size * 0.7, color: style.color || '#6B7280' }}>
        {iconContent}
      </Text>
    </TouchableOpacity>
  );
};

// Interface definition converted to comment for JSX/JS compatibility
/*
interface LoginScreenProps {
  onNavigate: (screen: 'welcome' | 'login' | 'signup') => void;
}
*/

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const { signIn } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Kripya phone aur password bharein.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          phone,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const token = response.data.token;
      signIn(token);

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('Axios Error Object:', e);
      Alert.alert('Error', e.response.data.message);

      if (!e.response) {
        console.log('This is a Network Failure (e.g., Timeout or DNS error).');
        Alert.alert('Network Error');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Background Decoration - Simplified to a corner View for RN */}
        <View style={styles.decoration}></View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.navigate('Register');
          }}
          activeOpacity={0.7}
        >
          <Icon name="ArrowLeft" style={{ color: '#4B5563' }} />
        </TouchableOpacity>

        {/* Header Text */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>
            Sign in to continue managing your shop
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          {/* phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'phone' && styles.inputFocused,
              ]}
            >
              <Icon
                name="Mail"
                style={{
                  color: focusedField === 'phone' ? '#4F46E5' : '#9CA3AF',
                  marginLeft: 16,
                }}
              />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                placeholder="Phone Number"
                keyboardType="numeric"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'password' && styles.inputFocused,
              ]}
            >
              <Icon
                name="Lock"
                style={{
                  color: focusedField === 'password' ? '#4F46E5' : '#9CA3AF',
                  marginLeft: 16,
                }}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
                returnKeyType="done"
              />
              <Icon
                name={showPassword ? 'EyeOff' : 'Eye'}
                onPress={() => setShowPassword(!showPassword)}
                style={{ color: '#9CA3AF', marginRight: 16 }}
              />
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              // onPress={() => setRememberMe(!rememberMe)}
            >
              {/* <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Remember me</Text> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Comming Soon',
                  'This Feature is Under Contruction!',
                );

                console.log('Forgot Password Pressed');
              }}
            >
              <Text style={styles.forgotText}>Forgot?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {
              if (loading) return;
              handleSubmit();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>
              {loading ? 'Logging in...' : 'Login'}{' '}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate('Register')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background for the entire screen
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: 'white',
    // Simulating the card-like style from the web template
    margin: 0,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  // Simplified background decoration
  decoration: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E0E7FF', // Indigo/Purple light blend
    opacity: 0.4,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
    padding: 8, // Increase touch target
  },
  headerTextContainer: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700', // Semibold/Bold
    color: '#1F2937', // Gray-900
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4B5563', // Gray-600
  },
  formContainer: {
    marginBottom: 20,
    gap: 20, // space-y-5 equivalent
  },
  inputGroup: {
    // space-y-2
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // Gray-700
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB', // Gray-200
    borderRadius: 16, // rounded-2xl
    paddingRight: 12,
    height: 56, // py-4 equivalent
    transitionProperty: 'border-color',
  },
  inputFocused: {
    borderColor: '#4F46E5', // Indigo-600
  },
  input: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },

  // Checkbox and Forgot Password
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5', // Indigo-600
    borderColor: '#4F46E5',
  },
  checkboxTick: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: '#4B5563', // Gray-600
    fontSize: 14,
  },
  forgotText: {
    color: '#4F46E5', // Indigo-600
    fontSize: 14,
  },

  // Sign In Button
  signInButton: {
    width: '100%',
    height: 56,
    borderRadius: 16, // rounded-2xl
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    // Gradient simulation - using primary color as fallback
    backgroundColor: '#6366F1', // Indigo-500/600 blend
    // For a real gradient, use 'expo-linear-gradient'
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  signInButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },

  // Sign Up Link
  signupContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 20, // Bottom padding for safety
  },
  signupText: {
    color: '#4B5563', // Gray-600
    fontSize: 15,
  },
  signupLink: {
    color: '#4F46E5', // Indigo-600
    fontWeight: '600',
  },
});
