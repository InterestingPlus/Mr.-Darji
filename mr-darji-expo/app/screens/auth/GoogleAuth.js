import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import BASE_URL from "../../config";

WebBrowser.maybeCompleteAuthSession();

const ANDROID_CLIENT_ID =
  "1041457370478-nre9n3bgl5i0l3vh335n60urrqr2gf6v.apps.googleusercontent.com";
const WEB_CLIENT_ID =
  "1041457370478-gqcn52k482vhso8c2454v6dkeurgncud.apps.googleusercontent.com";

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  async function handleGoogleLogin() {
    await promptAsync();
  }

  async function handleGoogleResponse(response) {
    if (response?.type === "success") {
      const { id_token } = response.params;

      // Send token to backend
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: id_token }),
      });

      const data = await res.json();

      // Store JWT securely
      await SecureStore.setItemAsync("token", data.token);

      return data;
    }
  }

  return {
    request,
    response,
    handleGoogleLogin,
    handleGoogleResponse,
  };
}
