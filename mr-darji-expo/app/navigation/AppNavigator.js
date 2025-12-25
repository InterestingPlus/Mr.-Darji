import React, { useState, useEffect, createContext, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

import UpdateModal from "../components/UpdateModal";

export const AuthContext = createContext();
import Constants from "expo-constants";

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const [forceUpdate, setForceUpdate] = useState(false);
  const [softUpdate, setSoftUpdate] = useState(false);

  const compareVersions = (v1, v2) => {
    const a = v1.split(".").map(Number);
    const b = v2.split(".").map(Number);

    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const diff = (a[i] || 0) - (b[i] || 0);
      if (diff !== 0) return diff;
    }

    return 0;
  };

  const [updateConfig, setUpdateConfig] = useState(null);

  const checkAppVersion = async () => {
    try {
      const res = await fetch("https://mr-darji.netlify.app/app-version.json");
      const config = await res.json();

      setUpdateConfig(config);

      const current = Constants.expoConfig.version;

      if (compareVersions(current, config.minimumSupportedVersion) < 0) {
        setForceUpdate(true);
      } else if (compareVersions(current, config.latestVersion) < 0) {
        setSoftUpdate(true);
      }

      console.log(config, current, forceUpdate, softUpdate);
    } catch (err) {
      console.log("Version check failed", err);

      setUpdateConfig({
        forceUpdate: true,
      });
      setForceUpdate(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
    };

    checkAppVersion();
    loadToken();
  }, []);

  const authContext = {
    signIn: async (token) => {
      await AsyncStorage.setItem("userToken", token);
      setUserToken(token);
    },

    signOut: async () => {
      await AsyncStorage.removeItem("userToken");
      setUserToken(null);
    },
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (forceUpdate && updateConfig) {
    console.log("Force", forceUpdate, updateConfig);

    return (
      <UpdateModal
        visible={true}
        force={true}
        updateUrl={updateConfig.updateUrl}
      />
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken ? <MainTabs /> : <AuthStack />}
      </NavigationContainer>

      {softUpdate && updateConfig && (
        <UpdateModal
          visible={true}
          force={false}
          updateUrl={updateConfig.updateUrl}
          setLater={() => setSoftUpdate(false)}
        />
      )}
    </AuthContext.Provider>
  );
}
