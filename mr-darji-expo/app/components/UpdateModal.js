import React from "react";
import { Modal, View, Text, TouchableOpacity, Linking } from "react-native";

export default function UpdateModal({ visible, force, updateUrl, setLater }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Update Available</Text>

          <Text style={styles.desc}>
            A new version of Mr. Darji is available. Please update to continue
            using the app.
          </Text>

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() =>
              Linking.openURL(updateUrl || "https://mr-darji.netlify.app")
            }
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Update Now</Text>
          </TouchableOpacity>

          {!force && (
            <TouchableOpacity
              style={styles.laterBtn}
              onPress={() => setLater()}
            >
              <Text style={{ color: "#666" }}>Later</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  updateBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  laterBtn: {
    marginTop: 12,
  },
};
