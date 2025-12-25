import { TouchableOpacity, View, Text, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GoogleLogin from "./GoogleLogin";

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

const HomeScreen = () => {
  return (
    <>
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
            <Text style={homeScreenStyles.welcomeText}>Welcome back,</Text>
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

          <GoogleLogin />

          <View style={homeScreenStyles.footer}>
            <Text style={homeScreenStyles.developerText}>
              Developed by{" "}
              <Text style={homeScreenStyles.devName}>Jatin Poriya</Text>
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

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

export default HomeScreen;
