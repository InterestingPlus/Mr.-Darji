import { View, Button, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "1041457370478-gqcn52k482vhso8c2454v6dkeurgncud.apps.googleusercontent.com",
    androidClientId:
      "1041457370478-nre9n3bgl5i0l3vh335n60urrqr2gf6v.apps.googleusercontent.com",
  });

  // const userInfo = async (token) => {
  //   const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   return await res.json();
  // };

  useEffect(() => {
    // if (response?.type === "success") {
    //   const { accessToken } = response.authentication;
    //   userInfo(accessToken).then(console.log);
    // }

    if (response?.type === "success") {
      console.log("AUTH:", response.authentication);
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        disabled={!request}
        title="Sign in with Google"
        onPress={() => promptAsync()}
      />
    </View>
  );
}

// import { useEffect } from "react";
// import { Alert, Button, View } from "react-native";

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   isErrorWithCode,
//   isSuccessResponse,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";

// GoogleSignin.configure({
//   webClientId:
//     "1041457370478-gqcn52k482vhso8c2454v6dkeurgncud.apps.googleusercontent.com",
// });

// export default function GoogleLogin() {
//   const [userInfo, setUserInfo] = useState(null);

//   const handleGoogleSignIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();

//       const response = GoogleSignin.signIn();

//       if (isSuccessResponse(response)) {
//         setUserInfo(response.data);
//       } else {
//         Alert.alert("Cancled", "sign in was cancelled by user");
//       }
//     } catch (error) {
//       if (isErrorWithCode(error)) {
//         switch (error.code) {
//           case statusCodes.IN_PROGRESS:
//             Alert.alert("sign in already in progress");
//             break;
//           case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//             Alert.alert("play services not available or outdated");
//             break;
//           default:
//           // some other error happened
//         }
//       } else {
//         Alert.alert("Error", error.response.data.message);
//       }
//     }
//   };

//   console.log(userInfo);

//   return (
//     <View style={{ flex: 1, justifyContent: "center" }}>
//       <Text>User Info: {JSON.stringify(userInfo, null, 2)} </Text>

//       <GoogleSigninButton
//         style={{ width: 192, height: 48 }}
//         size={GoogleSigninButton.Size.Wide}
//         color={GoogleSigninButton.Color.Dark}
//         onPress={handleGoogleSignIn}
//       />
//     </View>
//   );
// }
