import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { ICON_BACK } from "@/components/authIcons";
import { SignupButton } from "@/components/SignupButton";
import { SignupFormCard } from "@/components/SignupFormCard";
import { SignupVideoCard } from "@/components/SignupVideoCard";
import {
  isValidEmail,
  MIN_PASSWORD_LENGTH,
} from "@/lib/authValidation";
import { useSignupStore } from "@/stores/useSignupStore";

const GENDER_MALE = require("@/assets/images/signup/gender-male.png");
const GENDER_FEMALE = require("@/assets/images/signup/gender-female.png");

const NATIONALITIES = [
  "Ghanaian",
  "Nigerian",
  "American",
  "British",
  "Other",
];

const MEMBERSHIP_TYPES = ["Student", "Individual", "Family", "Corporate"];

const BRANCHES = ["Madina", "Accra", "Kumasi", "Tamale", "Other"];

const STEPS = [
  { key: "personal", title: "Personal Information" },
  { key: "social", title: "Social Handles" },
  { key: "contact", title: "Contact Details" },
  { key: "membership", title: "Your Membership" },
  { key: "education", title: "Education & Career" },
  { key: "consent", title: "Consent & Agreement" },
  { key: "secure", title: "Secure Your Account" },
];

export default function OnboardingStepperScreen() {
  const router = useRouter();
  const form = useSignupStore();
  const setField = useSignupStore((state) => state.setField);
  const toggle = useSignupStore((state) => state.toggle);
  const scrollRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);

  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentSlide = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(1)).current;

  const animateToStep = (nextStep, direction = "forward") => {
    const isForward = direction === "forward";
    const slideOutTo = isForward ? -12 : 12;
    const slideInFrom = isForward ? 18 : -18;

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
      setCurrentStep(nextStep);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
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

  const goBackToWelcome = useCallback(() => {
    router.replace("/(onboarding)/welcome");
  }, [router]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      animateToStep(currentStep - 1, "backward");
      return true;
    }
    goBackToWelcome();
    return true;
  }, [currentStep, goBackToWelcome]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBack
      );
      return () => subscription.remove();
    }, [handleBack])
  );

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      animateToStep(currentStep + 1, "forward");
      return;
    }

    if (!form.fullName?.trim()) {
      Alert.alert("Missing name", "Please enter your full name.");
      return;
    }

    if (!isValidEmail(form.email || form.username)) {
      Alert.alert(
        "Valid email required",
        "Enter the email address you will use to sign in."
      );
      return;
    }

    if (!form.password || form.password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(
        "Password too short",
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert(
        "Password mismatch",
        "Password and confirmation do not match."
      );
      return;
    }

    router.push("/(onboarding)/processing");
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].key) {
      case "personal":
        return (
          <>
            <SignupFormCard
              label="Full Name"
              value={form.fullName}
              onChangeText={(value) => setField("fullName", value)}
              autoCapitalize="words"
            />
            <SignupFormCard
              label="Nationality"
              value={form.nationality}
              options={NATIONALITIES}
              onSelect={(value) => setField("nationality", value)}
              showDropdown
            />
            <SignupFormCard
              label="Date of Birth"
              value={form.dateOfBirth}
              onChangeText={(value) => setField("dateOfBirth", value)}
              placeholder="DD/MM/YYYY"
              showCalendar
            />
            <SignupFormCard
              label="Your Gender"
              value="(Male)"
              selected={form.gender === "male"}
              filled={form.gender === "male"}
              portrait={GENDER_MALE}
              onPress={() => setField("gender", "male")}
            />
            <SignupFormCard
              label="Your Gender"
              value="(Female)"
              selected={form.gender === "female"}
              filled={form.gender === "female"}
              portrait={GENDER_FEMALE}
              onPress={() => setField("gender", "female")}
            />
          </>
        );

      case "social":
        return (
          <>
            <SignupFormCard
              label="Facebook"
              value={form.facebook}
              onChangeText={(value) => setField("facebook", value)}
              showDropdown
            />
            <SignupFormCard
              label="Instagram"
              value={form.instagram}
              onChangeText={(value) => setField("instagram", value)}
              showDropdown
            />
            <SignupFormCard
              label="LinkedIn"
              value={form.linkedin}
              onChangeText={(value) => setField("linkedin", value)}
            />
          </>
        );

      case "contact":
        return (
          <>
            <SignupFormCard
              label="Phone Number"
              value={form.phone}
              onChangeText={(value) => setField("phone", value)}
              keyboardType="phone-pad"
            />
            <SignupFormCard
              label="Email"
              value={form.email}
              onChangeText={(value) => setField("email", value)}
              keyboardType="email-address"
            />
            <SignupFormCard
              label="Address"
              value={form.address}
              onChangeText={(value) => setField("address", value)}
            />
          </>
        );

      case "membership":
        return (
          <>
            <SignupFormCard
              label="Membership Type"
              value={form.membershipType}
              options={MEMBERSHIP_TYPES}
              onSelect={(value) => setField("membershipType", value)}
              showDropdown
            />
            <SignupFormCard
              label="Ymca Branch"
              value={form.currentBranch}
              options={BRANCHES}
              onSelect={(value) => setField("currentBranch", value)}
              showDropdown
            />
            <SignupFormCard
              label="Membership ID"
              value={form.membershipId}
              onChangeText={(value) => setField("membershipId", value)}
            />
          </>
        );

      case "education":
        return (
          <>
            <SignupFormCard
              label="Occupation"
              value={form.goJointer}
              onChangeText={(value) => setField("goJointer", value)}
            />
            <SignupFormCard
              label="Articular Wellbeing"
              value={form.articularWellbeing}
              onChangeText={(value) => setField("articularWellbeing", value)}
            />
            <SignupFormCard
              label="Skills"
              value={form.skills}
              onChangeText={(value) => setField("skills", value)}
            />
          </>
        );

      case "consent":
        return (
          <>
            <SignupFormCard
              label="Terms & Agreements"
              value="Click to read"
              selected={form.termsAccepted}
              filled={form.termsAccepted}
              onPress={() => toggle("termsAccepted")}
            />
            <SignupFormCard
              label="Data Privacy Policy"
              value="Click to read"
              selected={form.privacyAccepted}
              filled={form.privacyAccepted}
              onPress={() => toggle("privacyAccepted")}
            />
            <SignupFormCard
              label="Photo Display"
              value="Click to read"
              selected={form.photoAccepted}
              filled={form.photoAccepted}
              onPress={() => toggle("photoAccepted")}
            />
            <SignupFormCard
              label="Notifications"
              value="Click to read"
              selected={form.notifAccepted}
              filled={form.notifAccepted}
              onPress={() => toggle("notifAccepted")}
            />
          </>
        );

      case "secure":
        return (
          <>
            <SignupFormCard
              label="Password"
              value={form.password}
              onChangeText={(value) => setField("password", value)}
              secureTextEntry
            />
            <SignupFormCard
              label="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(value) => setField("confirmPassword", value)}
              secureTextEntry
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <View style={styles.backIcon}>
              <SvgXml xml={ICON_BACK} width={7.33} height={10} />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.Text style={[styles.stepTitle, { opacity: titleOpacity }]}>
            {STEPS[currentStep].title}
          </Animated.Text>

          <SignupVideoCard />

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

        <View style={styles.footer}>
          <SignupButton label="Next" onPress={handleNext} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
  },
  flex: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 56,
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4D8E0",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 56,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
    textTransform: "capitalize",
  },
  formContainer: {
    gap: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 12,
    backgroundColor: "#F4F4F6",
  },
});
