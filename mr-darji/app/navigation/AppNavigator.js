import React, { useState, useEffect, createContext, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

export const AuthContext = createContext();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
      setIsLoading(false);
    };

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

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken ? <MainTabs /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
