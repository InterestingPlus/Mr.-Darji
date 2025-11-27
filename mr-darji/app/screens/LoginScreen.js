import { View, Text, TouchableOpacity } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>
        Login
      </Text>

      <TouchableOpacity
        onPress={() => navigation.replace("MainTabs")}
        style={{
          backgroundColor: "#333",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
