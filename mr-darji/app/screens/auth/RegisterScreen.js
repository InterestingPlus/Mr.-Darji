import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // For beautiful gradients
import axios from "axios";

import BASE_URL from "../../config";
import { useContext } from "react";
import { AuthContext } from "../../navigation/AppNavigator";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// --- Icon Component (Adapted from LoginScreen style) ---
const CustomIcon = ({ name, color = "#4B5563", size = 20, style }) => {
  let iconContent;
  switch (name) {
    case "User":
      iconContent = "👤";
      break;
    case "Calendar":
      iconContent = "🗓️";
      break;
    case "Phone":
      iconContent = "📱";
      break;
    case "Lock":
      iconContent = "🔑";
      break;
    case "Shop":
      iconContent = "🛍️";
      break;
    case "Year":
      iconContent = "⏳";
      break;
    case "MapPin":
      iconContent = "📍";
      break;
    case "ArrowLeft":
      iconContent = "←";
      size = 28;
      break;
    case "Check":
      iconContent = "✅";
      break;
    default:
      iconContent = "?";
  }
  return (
    <Text style={[{ fontSize: size * 0.7, color }, style]}>{iconContent}</Text>
  );
};

// --- Reusable Simple Step Container Component ---
const StepContainer = ({ children }) => (
  <View style={styles.stepContainerView}>{children}</View>
);

// --- Custom Gradient Button ---
const GradientButton = ({
  onPress,
  text,
  colors,
  disabled,
  loading = false,
  style,
  textStyle,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.7}
    style={style}
  >
    <LinearGradient
      colors={disabled ? ["#d1d5db", "#9ca3af"] : colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientButton}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[styles.gradientButtonText, textStyle]}>{text}</Text>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const { height } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState("home");
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { signIn } = useContext(AuthContext);

  const SHOP_TYPES = [
    "Tailor",
    "Boutique",
    "Fashion Designer",
    "Men Tailor",
    "Women Tailor",
    "Unisex",
  ];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",

    shopName: "",
    shopType: "",
    shopAddress: "",
  });
  async function register() {
    console.log(form);

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (!language) {
      Alert.alert("Error", "Please select a language.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/api/auth/register-owner-shop`,
        {
          name: form.name,
          phone: form.phone,
          password: form.password,
          language: language,

          shopName: form.shopName,
          shopType: form.shopType,
          addressLine1: form.shopAddress,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Registration Successful!");

      const token = response.data.token;
      signIn(token);

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("Axios Error Object:", e);

      const serverMessage =
        e.response?.data?.error || e.response?.data?.message;

      const errorMessage =
        serverMessage ||
        "Network Error or Server Unreachable. Check the console log.";

      Alert.alert("Registration Failed", errorMessage);

      if (!e.response) {
        console.log("This is a Network Failure (e.g., Timeout or DNS error).");
      }
    }
  }

  const renderTextInput = (
    key,
    placeholder,
    iconName,
    keyboardType = "default",
    isSecure = false
  ) => (
    <View style={styles.inputGroup}>
      <View
        style={[
          styles.inputWrapper,
          focusedField === key && styles.inputFocused,
        ]}
      >
        <CustomIcon
          name={iconName}
          color={focusedField === key ? "#4F46E5" : "#9CA3AF"} // Indigo focus color
          style={{ marginLeft: 15 }}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={form[key]}
          onChangeText={(t) => setForm({ ...form, [key]: t })}
          onFocus={() => setFocusedField(key)}
          onBlur={() => setFocusedField(null)}
          keyboardType={keyboardType}
          secureTextEntry={isSecure}
          returnKeyType="next"
        />
      </View>
    </View>
  );

  /* ---------------- SHOP TYPE SELECTOR ---------------- */
  const ShopTypeSelector = ({ value, onSelect }) => {
    const [visible, setVisible] = useState(false);

    return (
      <>
        <TouchableOpacity
          style={shopTypeStyles.input}
          onPress={() => setVisible(true)}
        >
          <Text style={shopTypeStyles.inputText}>
            {value || "Select your primary shop category"}
          </Text>
        </TouchableOpacity>

        <Modal visible={visible} transparent animationType="slide">
          <View style={shopTypeStyles.modalOverlay}>
            <View style={shopTypeStyles.modalContent}>
              <FlatList
                data={SHOP_TYPES}
                keyExtractor={(i) => i}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={shopTypeStyles.option}
                    onPress={() => {
                      onSelect(item);
                      setVisible(false);
                    }}
                  >
                    <Text style={shopTypeStyles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={shopTypeStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View style={styles.container}>
        {/* Background Decoration */}
        <View style={styles.decoration}></View>

        {/* Back Button and Header Title */}
        {step !== "home" && (
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                setStep((prev) => {
                  if (prev === "language") return "home";
                  if (prev === "owner") return "language";
                  if (prev === "contact") return "owner";
                  if (prev === "shop") return "contact";
                  return "home";
                })
              }
              activeOpacity={0.7}
            >
              <CustomIcon name="ArrowLeft" color="#4B5563" size={30} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{step.toUpperCase()}</Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HOME SCREEN */}
          {step === "home" && (
            <View style={styles.container}>
              {/* --- TOP PART (50%) - Branding & Logo --- */}
              <LinearGradient
                colors={["#1E1B4B", "#312E81"]} // Premium Deep Indigo
                style={homeScreenStyles.topSection}
              >
                <View style={homeScreenStyles.brandContent}>
                  {/* Logo Icon */}
                  <View style={homeScreenStyles.logoContainer}>
                    {/* <MaterialCommunityIcons
                      name="scissors-cutting"
                      size={50}
                      color="#FBBF24"
                    /> */}

                    {/* Custom Logo Image */}
                    <Image
                      source={require("../../../assets/Mr-Darji.png")}
                      style={homeScreenStyles.logo}
                    />
                  </View>

                  {/* Title & Subtitle */}
                  <Text style={homeScreenStyles.mainTitle}>Mr. Darji</Text>
                  <View style={homeScreenStyles.divider} />
                  <Text style={homeScreenStyles.subTitle}>
                    Tailor Shop{"\n"}Management
                  </Text>
                  <Text style={homeScreenStyles.tagline}>
                    Precision in every stitch.
                  </Text>
                </View>
              </LinearGradient>

              {/* --- BOTTOM PART (50%) - Navigation --- */}
              <View style={homeScreenStyles.bottomSection}>
                <View style={homeScreenStyles.buttonWrapper}>
                  <Text style={homeScreenStyles.welcomeText}>
                    Welcome back,
                  </Text>
                  <Text style={homeScreenStyles.instructionText}>
                    Manage your shop with ease.
                  </Text>

                  {/* Primary Action */}
                  <GradientButton
                    onPress={() => setStep("language")}
                    text="Start Registration"
                    colors={["#4F46E5", "#818CF8"]}
                    style={homeScreenStyles.mainBtn}
                  />

                  {/* Secondary Action */}
                  <GradientButton
                    onPress={() => navigation.navigate("Login")}
                    text="Login to Account"
                    colors={["#F97316", "#FBBF24"]}
                    style={homeScreenStyles.secondaryBtn}
                  />
                </View>

                <View style={homeScreenStyles.footer}>
                  <Text style={homeScreenStyles.developerText}>
                    Developed by{" "}
                    <Text style={homeScreenStyles.devName}>Jatin Poriya</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* LANGUAGE SCREEN */}
          {step === "language" && (
            <StepContainer>
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>1. Choose Your Language</Text>

                {["English", "Hindi", "Gujarati"].map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => setLanguage(lang)}
                    style={[
                      styles.languageOption,
                      language === lang && styles.languageOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        language === lang && styles.languageTextSelected,
                      ]}
                    >
                      {lang}
                    </Text>
                    {language === lang && (
                      <CustomIcon name="Check" color="#4F46E5" size={24} />
                    )}
                  </TouchableOpacity>
                ))}

                <GradientButton
                  disabled={!language}
                  onPress={() => setStep("owner")}
                  text="Next: Owner Details"
                  colors={["#10B981", "#34D399"]} // Emerald Green
                  style={{ marginTop: 40 }}
                />
              </View>
            </StepContainer>
          )}

          {/* OWNER DETAILS */}
          {step === "owner" && (
            <StepContainer>
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>2. Owner Information</Text>

                {renderTextInput("name", "Your Full Name", "User")}

                <GradientButton
                  onPress={() => setStep("contact")}
                  text="Next: Contact & Login"
                  colors={["#EC4899", "#F472B6"]} // Pink
                  style={{ marginTop: 20 }}
                />
              </View>
            </StepContainer>
          )}

          {/* PHONE + PASSWORD */}
          {step === "contact" && (
            <StepContainer>
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>3. Contact & Security</Text>

                {renderTextInput("phone", "Phone Number", "Phone", "phone-pad")}

                {renderTextInput(
                  "password",
                  "Password (Min 6 chars)",
                  "Lock",
                  "default",
                  true
                )}
                {renderTextInput(
                  "confirmPassword",
                  "Confirm Password",
                  "Lock",
                  "default",
                  true
                )}

                <GradientButton
                  onPress={() => setStep("shop")}
                  text="Next: Shop Details"
                  colors={["#FBBF24", "#F97316"]} // Amber/Orange
                  style={{ marginTop: 20 }}
                />
              </View>
            </StepContainer>
          )}

          {/* SHOP INFO (FINAL STEP) */}
          {step === "shop" && (
            <StepContainer>
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>4. Shop Details</Text>

                {renderTextInput("shopName", "Shop Name", "Shop")}

                <ShopTypeSelector
                  value={form.shopType}
                  onSelect={(v) => setForm({ ...form, shopType: v })}
                />

                {renderTextInput(
                  "shopAddress",
                  "Shop Address",
                  "MapPin",
                  "default"
                )}

                <GradientButton
                  onPress={register}
                  loading={loading}
                  text="REGISTER & FINISH"
                  colors={["#4F46E5", "#6366F1"]} // Final Indigo
                  style={{ marginTop: 30 }}
                  textStyle={{ fontSize: 20 }}
                />
              </View>
            </StepContainer>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Light gray background for the entire screen
    // paddingTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 24,
  },
  decoration: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E0E7FF", // Indigo/Purple light blend
    opacity: 0.4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
  },
  // --- Header/Navigation ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",

    marginTop: 30,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 1,
  },
  // --- Main Screen (Home) ---
  homeScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#4F46E5", // Indigo 600
    textShadowColor: "rgba(79, 70, 229, 0.3)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: "#6B7280", // Gray-600
    marginBottom: 60,
  },
  developerText: {
    position: "absolute",
    bottom: -30, // Adjusted for ScrollView context
    color: "#9CA3AF",
    fontSize: 12,
  },
  // --- Form Steps ---
  stepContainerView: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingVertical: 10,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 30,
    textAlign: "center",
  },
  // --- Form Elements (Reused from Login Styles) ---
  inputGroup: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB", // Gray-200
    borderRadius: 16,
    overflow: "hidden",
    height: 56,
    // Modern Shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  inputFocused: {
    borderColor: "#4F46E5", // Indigo focus
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  input: {
    flex: 1,
    color: "#1F2937", // Dark text color
    paddingHorizontal: 15,
    fontSize: 16,
    height: "100%",
  },
  // --- Language Selection ---
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB", // Very light background
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  languageOptionSelected: {
    borderColor: "#4F46E5", // Highlight with Indigo
    backgroundColor: "#E0E7FF", // Light Indigo background for contrast
  },
  languageText: {
    color: "#1F2937", // Default dark text color
    fontSize: 18,
    fontWeight: "600",
  },
  languageTextSelected: {
    color: "#1F2937", // Keep dark color when selected background is light
  },
  // --- Gradient Button Styles ---
  gradientButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(79, 70, 229, 0.5)", // Shadow matches Indigo
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  gradientButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});

const shopTypeStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  inputText: { fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 20 },
  option: { padding: 15 },
  optionText: { fontSize: 14 },
  cancelText: { color: "red", textAlign: "center", marginTop: 10 },
});

const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  // Top Part Styles
  topSection: {
    height: height * 0.45,
    justifyContent: "center",
    paddingHorizontal: 40,
    borderBottomRightRadius: 80, // Premium curve
  },
  logo: {
    width: 70,
    height: 70,
  },
  brandContent: {
    marginTop: 20,
  },
  logoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  divider: {
    width: 40,
    height: 4,
    backgroundColor: "#F97316",
    marginVertical: 10,
    borderRadius: 2,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: "300",
    color: "#E0E7FF",
    lineHeight: 28,
  },
  tagline: {
    fontSize: 14,
    color: "#818CF8",
    marginTop: 10,
    fontStyle: "italic",
  },

  // Bottom Part Styles
  bottomSection: {
    height: height * 0.45,
    paddingHorizontal: 30,
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  instructionText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 40,
  },
  mainBtn: {
    height: 58,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  secondaryBtn: {
    height: 58,
    marginTop: 15,
    borderRadius: 16,
    elevation: 4,
  },
  footer: {
    alignItems: "center",
  },
  developerText: {
    fontSize: 12,
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
  devName: {
    color: "#4F46E5",
    fontWeight: "600",
  },
});
