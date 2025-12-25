import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

GoogleSignin.configure({
  webClientId:
    '1041457370478-gqcn52k482vhso8c2454v6dkeurgncud.apps.googleusercontent.com',
});

// const safeAreaInsets = useSafeAreaInsets();
function AppContent() {
  const [user, setUser] = useState();

  // const handleGoogleSignIn = async () => {
  //   console.log('Clicked!');
  //   try {
  //     await GoogleSignin.hasPlayServices();

  //     console.log('Google Service!, waiting for response');

  //     const response = await GoogleSignin.signIn();

  //     console.log('response', response);

  //     if (isSuccessResponse(response)) {
  //       setUser(response.data);

  //       console.log('Sucees!!');
  //     } else {
  //       console.log('NOt Sucees!!');
  //       Alert.alert('Cancled', 'sign in was cancelled by user');
  //     }
  //   } catch (error) {
  //     if (isErrorWithCode(error)) {
  //       switch (error.code) {
  //         case statusCodes.IN_PROGRESS:
  //           Alert.alert('sign in already in progress');
  //           break;
  //         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
  //           Alert.alert('play services not available or outdated');
  //           break;
  //         default:
  //         // some other error happened
  //       }
  //     } else {
  //       Alert.alert('Error', error.response.data.message);
  //     }
  //   }
  // };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Clicked');

      await GoogleSignin.hasPlayServices();
      console.log('Play services OK');

      const userInfo = await GoogleSignin.signIn();
      console.log('USER INFO:', userInfo?.data?.user);

      setUser(userInfo?.data?.user);
    } catch (error) {
      console.log('SIGNIN ERROR:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('In progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log('Unknown error', error);
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
    <ScrollView contentContainerStyle={styles.container}>
      {user && (
        <View style={styles.card}>
          <Image
            source={{ uri: user?.photo || undefined }}
            style={styles?.image || ''}
          />

          <Text style={styles.text}>Name: {user?.name || ''}</Text>
          <Text style={styles.text}>Email: {user?.email || ''}</Text>
          <Text style={styles.text}>ID: {user?.id || ''}</Text>

          <Text style={styles.json}>{JSON.stringify(user || {}, null, 2)}</Text>
        </View>
      )}

      {!user ? (
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
        />
      ) : (
        <Button onPress={handleGoogleLogout} title="Sing Out"></Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    marginTop: 20,
    width: '100%',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
    textAlign: 'center',
  },
  json: {
    marginTop: 10,
    fontSize: 12,
    color: '#333',
  },
});

export default AppContent;
