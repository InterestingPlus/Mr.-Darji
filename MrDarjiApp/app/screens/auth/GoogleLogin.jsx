import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import LinearGradient from 'react-native-linear-gradient';

GoogleSignin.configure({
  webClientId:
    '1041457370478-gqcn52k482vhso8c2454v6dkeurgncud.apps.googleusercontent.com',
});

import BASE_URL from '../../config';
import { AuthContext } from '../../navigation/AppNavigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';

const GoogleLogin = ({ setVerifiedUser }) => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  const { t } = useTranslation();

  useEffect(() => {
    async function signOutUser() {
      try {
        await GoogleSignin.signOut();
        setVerifiedUser(null);
        // Alert.alert('Logged out', 'You have been signed out');
      } catch (error) {
        console.log('LOGOUT ERROR:', error);
      }
    }

    signOutUser();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      setLoading(true);

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo?.data?.idToken;

      const response = await axios.post(`${BASE_URL}/api/auth/google`, {
        idToken,
      });

      if (response.data.user == null) {
        setVerifiedUser(userInfo?.data?.user);
      } else {
        const token = response.data.token;

        await AsyncStorage.setItem(
          'user',
          JSON.stringify(response.data?.user || {}),
        );
        await AsyncStorage.setItem(
          'shop',
          JSON.stringify(response.data?.shop || {}),
        );

        console.log(response.data?.user?.language);

        i18n.changeLanguage(response.data?.user?.language);

        signIn(token);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('User cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available');
      } else {
        console.log(error);
        Alert.alert('SIGNIN ERROR', error.message || JSON.stringify(error));
        // Alert.alert('Unknown error', error.message || JSON.stringify(error));
      }
    }
  };

  return (
    <View
      contentContainerStyle={styles.container}
      style={{ borderRadius: 30, overflow: 'hidden', width: 300 }}
    >
      <TouchableOpacity
        onPress={() => {
          if (loading) return;
          handleGoogleSignIn();
        }}
        activeOpacity={0.85}
        style={styles.outerContainer}
      >
        {/* 1. Deep Contrast Gradient (Matching your Indigo/Purple theme) */}
        <LinearGradient
          colors={['#312E81', '#1E1B4B']} // Darker indigo to Deep night purple
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonBody}
        >
          {/* 2. White Glow Icon Box */}
          <View style={styles.whiteBox}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
              }}
              style={styles.googleIcon}
            />
          </View>

          <Text style={styles.buttonText}>
            {loading
              ? t('register.google.loading')
              : t('register.google.button')}
          </Text>

          {/* 3. Subtle Inner Border for Depth */}
          <View style={styles.innerBorder} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  outerContainer: {
    marginHorizontal: 35,
    marginTop: 10,
    borderRadius: 18,

    elevation: 12,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  buttonBody: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 62,
    borderRadius: 18,
    paddingHorizontal: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  whiteBox: {
    backgroundColor: '#FFFFFF',
    height: 48,
    width: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow inside the button
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  googleIcon: {
    width: 26,
    height: 26,
  },
  buttonText: {
    color: '#F8FAFC', // Off-white for premium look
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.6,
    flex: 1,
    textAlign: 'center',
    marginRight: 48,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle highlight on the edge
  },
});

export default GoogleLogin;
