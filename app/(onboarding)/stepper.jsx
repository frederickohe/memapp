import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FormField,
  ConsentRow,
  OnboardingButton,
} from "@/components/OnboardingFormComponents";

// ─── Step definitions ────────────────────────────────────────
const STEPS = [
  { key: "personal", title: "Personal Information" },
  { key: "social", title: "Social Handles" },
  { key: "contact", title: "Contact Details" },
  { key: "membership", title: "Your Membership" },
  { key: "education", title: "Education & Career" },
  { key: "consent", title: "Consent & Agreement" },
  { key: "secure", title: "Secure Your Account" },
];

// ─── Main screen ─────────────────────────────────────────────
export default function OnboardingStepperScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Animation values
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentSlide = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(1)).current;

  // ─── Form data (persisted across steps) ──────────────────
  const [form, setForm] = useState({
    // Step 1
    fullName: "",
    nationality: "",
    dateOfBirth: "",
    gender: "",
    // Step 2
    facebook: "",
    instagram: "",
    linkedin: "",
    // Step 3
    phone: "",
    email: "",
    address: "",
    // Step 4
    membershipType: "",
    numberOfBonds: "",
    membershipId: "",
    skills: "",
    // Step 5
    goJointer: "",
    articularWellbeing: "",
    educationId: "",
    // Step 6
    termsAccepted: false,
    privacyAccepted: false,
    photoAccepted: false,
    notifAccepted: false,
    // Step 7
    password: "",
    confirmPassword: "",
  });

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const toggle = (field) =>
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));


  // ─── Transition animation ────────────────────────────────
  const animateToStep = (nextStep, direction = "forward") => {
    const isForward = direction === "forward";
    const slideOutTo = isForward ? -12 : 12;
    const slideInFrom = isForward ? 18 : -18;

    // Phase 1: fade + slide current content out
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: slideOutTo,
        duration: 160,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Update step
      setCurrentStep(nextStep);
      scrollRef.current?.scrollTo({ y: 0, animated: false });

      // Phase 2: position below/above, then spring into place
      contentSlide.setValue(slideInFrom);

      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(contentSlide, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      animateToStep(currentStep + 1, "forward");
    } else {
      // Final step → success
      router.push("/(onboarding)/success");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateToStep(currentStep - 1, "backward");
    }
  };

  // ─── Step content renderers ──────────────────────────────
  const renderStepContent = () => {
    switch (STEPS[currentStep].key) {
      case "personal":
        return (
          <>
            <FormField
              label="Full Name"
              value={form.fullName}
              onChangeText={(v) => set("fullName", v)}
              placeholder="Full Name"
            />
            <FormField
              label="Nationality"
              value={form.nationality}
              placeholder="Nationality"
              isDropdown
              options={["Ghanaian", "Nigerian", "American", "British", "Other"]}
              onSelect={(v) => set("nationality", v)}
            />
            <FormField
              label="Date of Birth"
              value={form.dateOfBirth}
              onChangeText={(v) => set("dateOfBirth", v)}
              placeholder="DD/MM/YYYY"
              keyboardType="numeric"
            />
            {/* Gender selector */}
            <View style={styles.genderSection}>
              <Text style={styles.genderLabel}>Your Gender: (from)</Text>
              <View style={styles.genderOptions}>
                <TouchableOpacity
                  style={[
                    styles.genderCard,
                    form.gender === "male" && styles.genderCardActive,
                  ]}
                  onPress={() => set("gender", "male")}
                >
                  <View style={styles.genderAvatar}>
                    <Text style={styles.genderEmoji}>🧍‍♂️</Text>
                  </View>
                  <Text style={styles.genderText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderCard,
                    form.gender === "female" && styles.genderCardActive,
                  ]}
                  onPress={() => set("gender", "female")}
                >
                  <View style={styles.genderAvatar}>
                    <Text style={styles.genderEmoji}>🧍‍♀️</Text>
                  </View>
                  <Text style={styles.genderText}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );

      case "social":
        return (
          <>
            <FormField
              label="Facebook"
              value={form.facebook}
              onChangeText={(v) => set("facebook", v)}
              placeholder="Facebook profile URL"
            />
            <FormField
              label="Instagram"
              value={form.instagram}
              onChangeText={(v) => set("instagram", v)}
              placeholder="Instagram handle"
            />
            <FormField
              label="LinkedIn"
              value={form.linkedin}
              onChangeText={(v) => set("linkedin", v)}
              placeholder="LinkedIn profile URL"
            />
          </>
        );

      case "contact":
        return (
          <>
            <FormField
              label="Phone Number"
              value={form.phone}
              onChangeText={(v) => set("phone", v)}
              placeholder="+1 000 000 0000"
              keyboardType="phone-pad"
            />
            <FormField
              label="Email"
              value={form.email}
              onChangeText={(v) => set("email", v)}
              placeholder="example@email.com"
              keyboardType="email-address"
            />
            <FormField
              label="Residential Address"
              value={form.address}
              onChangeText={(v) => set("address", v)}
              placeholder="Enter your residential address"
              multiline
            />
          </>
        );

      case "membership":
        return (
          <>
            <FormField
              label="Membership Type"
              value={form.membershipType}
              placeholder="Select membership type"
              isDropdown
              options={["Student", "Individual", "Family", "Corporate"]}
              onSelect={(v) => set("membershipType", v)}
            />
            <FormField
              label="No. of Bonds"
              value={form.numberOfBonds}
              placeholder="Select number of bonds"
              isDropdown
              options={["1 Bond", "2 Bonds", "3 Bonds", "4 Bonds", "5+ Bonds"]}
              onSelect={(v) => set("numberOfBonds", v)}
            />
            <FormField
              label="Membership ID"
              value={form.membershipId}
              onChangeText={(v) => set("membershipId", v)}
              placeholder="Enter membership ID"
            />
            <FormField
              label="Skills"
              value={form.skills}
              onChangeText={(v) => set("skills", v)}
              placeholder="Enter your skills"
            />
          </>
        );

      case "education":
        return (
          <>
            <FormField
              label="Go Jointer"
              value={form.goJointer}
              onChangeText={(v) => set("goJointer", v)}
              placeholder="Enter go jointer details"
            />
            <FormField
              label="Articular Wellbeing"
              value={form.articularWellbeing}
              onChangeText={(v) => set("articularWellbeing", v)}
              placeholder="Enter articular wellbeing"
            />
            <FormField
              label="Membership ID"
              value={form.educationId}
              onChangeText={(v) => set("educationId", v)}
              placeholder="Enter membership ID"
            />
          </>
        );

      case "consent":
        return (
          <>
            <ConsentRow
              label="Terms & Agreements —"
              link="Click to read"
              checked={form.termsAccepted}
              onToggle={() => toggle("termsAccepted")}
            />
            <ConsentRow
              label="Data Privacy Policy —"
              link="Click to read"
              checked={form.privacyAccepted}
              onToggle={() => toggle("privacyAccepted")}
            />
            <ConsentRow
              label="Photo Display —"
              link="Click to read"
              checked={form.photoAccepted}
              onToggle={() => toggle("photoAccepted")}
            />
            <ConsentRow
              label="Notifications —"
              link="Click to read"
              checked={form.notifAccepted}
              onToggle={() => toggle("notifAccepted")}
            />
          </>
        );

      case "secure":
        return (
          <>
            <FormField
              label="Password"
              value={form.password}
              onChangeText={(v) => set("password", v)}
              placeholder="Enter password"
              secureTextEntry
            />
            <FormField
              label="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(v) => set("confirmPassword", v)}
              placeholder="Confirm password"
              secureTextEntry
              hasError={
                form.confirmPassword.length > 0 &&
                form.password !== form.confirmPassword
              }
            />
          </>
        );

      default:
        return null;
    }
  };

  // ─── Render ──────────────────────────────────────────────
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Step title (animated) ── */}
          <Animated.Text style={[styles.stepTitle, { opacity: titleOpacity }]}>
            {STEPS[currentStep].title}
          </Animated.Text>

          {/* ── Video placeholder (static — never animates) ── */}
          <View style={styles.videoPadding}>
            <View style={styles.videoContainer}>
              {/* Dark background */}
              <View style={styles.videoBg} />
              {/* Decorative silhouettes */}
              <View style={styles.videoDecorLeft} />
              <View style={styles.videoDecorRight} />
              {/* Green play button */}
              <View style={styles.playButton}>
                <View style={styles.playTriangle} />
              </View>
              {/* Bottom scrubber bar */}
              <View style={styles.videoBar}>
                <View style={styles.scrubberFilled} />
                <View style={styles.scrubberTrack} />
              </View>
            </View>
          </View>

          {/* ── Progress dots (updates instantly) ── */}
          <View style={styles.progressRow}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i <= currentStep
                    ? styles.progressDotActive
                    : styles.progressDotInactive,
                ]}
              />
            ))}
          </View>

          {/* ── Form content (animated) ── */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentSlide }],
              },
            ]}
          >
            {renderStepContent()}
          </Animated.View>
        </ScrollView>

        {/* ── Fixed footer button ── */}
        <View style={styles.footer}>
          <OnboardingButton
            label={isLastStep ? "Submit" : "Next"}
            onPress={handleNext}
          />
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.backStepButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backStepButtonText}>Previous Step</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 12,
  },

  // ── Title ──
  stepTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    paddingTop: 14,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },

  // ── Video ──
  videoPadding: {
    paddingHorizontal: 20,
  },
  videoContainer: {
    width: "100%",
    height: 170,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  videoBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#222",
  },
  videoDecorLeft: {
    position: "absolute",
    left: 18,
    top: 18,
    bottom: 34,
    width: "26%",
    backgroundColor: "#333",
    borderRadius: 6,
    opacity: 0.65,
  },
  videoDecorRight: {
    position: "absolute",
    right: 18,
    top: 18,
    bottom: 34,
    width: "26%",
    backgroundColor: "#333",
    borderRadius: 6,
    opacity: 0.65,
  },
  playButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,200,80,0.92)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 14,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#fff",
    marginLeft: 3,
  },
  videoBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
  },
  scrubberFilled: {
    width: 52,
    height: 3,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  scrubberTrack: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 2,
  },

  // ── Progress ──
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingVertical: 50,
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
  },
  progressDotActive: {
    width: 22,
    backgroundColor: "#000",
  },
  progressDotInactive: {
    width: 14,
    backgroundColor: "#ddd",
  },

  // ── Form ──
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },

  // ── Gender (step 1) ──
  genderSection: {
    marginTop: 6,
    marginBottom: 4,
  },
  genderLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: "row",
    gap: 14,
  },
  genderCard: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#eee",
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: "#fafafa",
  },
  genderCardActive: {
    borderColor: "#000",
    backgroundColor: "#f0f0f0",
  },
  genderAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e8e8e8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  genderEmoji: {
    fontSize: 26,
  },
  genderText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#333",
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 18,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  backStepButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  backStepButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
});
