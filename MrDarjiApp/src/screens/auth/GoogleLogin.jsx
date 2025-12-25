import { useEffect, useState } from 'react';
import { Alert, Button, View } from 'react-native';

import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '1041457370478-gqcn52k482vhso8c2454v6dkeurgncud.apps.googleusercontent.com',
  scopes: [
    /* what APIs you want to access on behalf of the user, default is email and profile
    this is just an example, most likely you don't need this option at all! */
    'https://www.googleapis.com/auth/drive.readonly',
  ],
});

export default function GoogleLogin() {
  const [userInfo, setUserInfo] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const response = GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        setUserInfo(response?.data?.user || {});
      } else {
        Alert.alert('Cancled', 'sign in was cancelled by user');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('sign in already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('play services not available or outdated');
            break;
          default:
          // some other error happened
        }
      } else {
        Alert.alert('Error', error.response.data.message);
      }
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await GoogleSignin.signOut(); // Google se logout
      setUser(null); // local user clear
      Alert.alert('Logged out', 'You have been signed out');
    } catch (error) {
      console.log('LOGOUT ERROR:', error);
      Alert.alert('Error', 'Logout failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {userInfo && (
        <View style={styles.card}>
          <Image
            source={{ uri: user?.photo || '' }}
            style={styles?.image || ''}
          />

          <Text style={styles.text}>Name: {user?.name || ''}</Text>
          <Text style={styles.text}>Email: {user?.email || ''}</Text>
          <Text style={styles.text}>ID: {user?.id || ''}</Text>

          <Text style={styles.json}>{JSON.stringify(user || {}, null, 2)}</Text>
        </View>
      )}

      <Text>User Info: {JSON.stringify(userInfo, null, 2)} </Text>

      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
    </View>
  );
}
