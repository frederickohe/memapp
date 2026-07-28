import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Upload } from "lucide-react-native";
import {
  FormField,
  OnboardingButton,
} from "@/components/OnboardingFormComponents";

const STEPS = ["Upload", "Details"];

export default function ApplyVolunteerHoursFormScreen() {
  const router = useRouter();
  const [hours, setHours] = useState("3");
  const [activity, setActivity] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    router.push({
      pathname: "/apply-volunteer-hours-success",
      params: {
        hours,
        activity: activity.trim() || "Volunteer activity",
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.stepTitle}>Apply Hours</Text>

          <View style={styles.mediaPadding}>
            <TouchableOpacity style={styles.receiptCard} activeOpacity={0.9}>
              <View style={styles.receiptInner}>
                <View style={styles.uploadIconWrap}>
                  <Upload size={24} color="#111" strokeWidth={2} />
                </View>
                <Text style={styles.receiptTitle}>Upload receipt</Text>
                <Text style={styles.receiptHint}>
                  Tap to add a photo of your volunteer receipt
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.progressRow}>
            {STEPS.map((step, index) => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  index === 1
                    ? styles.progressDotActive
                    : styles.progressDotInactive,
                ]}
              />
            ))}
          </View>

          <View style={styles.formContainer}>
            <FormField
              label="Hours volunteered"
              value={hours}
              onChangeText={setHours}
              placeholder="0"
              keyboardType="number-pad"
            />
            <FormField
              label="Activity"
              value={activity}
              onChangeText={setActivity}
              placeholder="What did you volunteer for?"
            />
            <FormField
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="Where did this take place?"
            />
            <FormField
              label="Date"
              value={date}
              onChangeText={setDate}
              placeholder="DD / MM / YYYY"
            />
            <FormField
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Tell us about your contribution"
              multiline
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <OnboardingButton label="Submit" onPress={handleSubmit} />
          <TouchableOpacity
            style={styles.backStepButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backStepButtonText}>Previous Step</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  stepTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    paddingTop: 14,
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  mediaPadding: {
    paddingHorizontal: 20,
  },
  receiptCard: {
    width: "100%",
    minHeight: 170,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECECEF",
    backgroundColor: "#FAFAFA",
    overflow: "hidden",
  },
  receiptInner: {
    flex: 1,
    minHeight: 170,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  uploadIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F1F1F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  receiptTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },
  receiptHint: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 19,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingVertical: 36,
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
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
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
