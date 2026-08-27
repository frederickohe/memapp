import React, { useState } from "react";
import {
  Alert,
  Image,
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
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, Upload } from "lucide-react-native";
import {
  FormField,
  OnboardingButton,
} from "@/components/OnboardingFormComponents";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { submitVolunteerHours, uploadVolunteerProof } from "@/lib/api/vhs";
import {
  clearVolunteerApplyDraft,
  getVolunteerApplyDraft,
  parseVolunteerDate,
  todayDisplayDate,
} from "@/lib/volunteerUtils";

const STEPS = ["Upload", "Details"];

export default function ApplyVolunteerHoursFormScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const profile = useUserProfile();
  const [hours, setHours] = useState("");
  const [activity, setActivity] = useState("");
  const [location, setLocation] = useState(
    profile.branch && profile.branch !== "—" ? profile.branch : ""
  );
  const [date, setDate] = useState(todayDisplayDate());
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const pickReceipt = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Allow photo access to attach proof of your hours.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setReceipt({
        uri: asset.uri,
        name: asset.fileName || "volunteer-receipt.jpg",
        type: asset.mimeType || "image/jpeg",
      });
    }
  };

  const handleSubmit = async () => {
    const parsedHours = Number(hours);
    if (!parsedHours || parsedHours <= 0 || parsedHours > 24) {
      Alert.alert("Hours required", "Enter the hours you volunteered, up to 24.");
      return;
    }
    if (activity.trim().length < 2) {
      Alert.alert("Activity required", "Tell us what you volunteered for.");
      return;
    }
    const volunteerDate = parseVolunteerDate(date);
    if (!volunteerDate) {
      Alert.alert("Date required", "Use the date format DD / MM / YYYY.");
      return;
    }

    setSubmitting(true);
    try {
      const proofFile = receipt || getVolunteerApplyDraft().video;
      let proofUrl = null;
      if (proofFile?.uri) {
        const uploaded = await uploadVolunteerProof(proofFile, token);
        proofUrl = uploaded?.file_url || uploaded?.fileUrl || null;
      }

      await submitVolunteerHours(
        {
          hours: parsedHours,
          activity_name: activity.trim(),
          activity_description: description.trim() || null,
          branch: location.trim() || null,
          volunteer_date: volunteerDate,
          proof_document_url: proofUrl,
        },
        token
      );

      clearVolunteerApplyDraft();
      router.replace({
        pathname: "/apply-volunteer-hours-success",
        params: {
          hours: String(parsedHours),
          activity: activity.trim(),
        },
      });
    } catch (err) {
      Alert.alert("Could not submit", err.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Apply Hours</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.stepTitle}>Apply Hours</Text>

          <View style={styles.mediaPadding}>
            <TouchableOpacity
              style={styles.receiptCard}
              activeOpacity={0.9}
              onPress={pickReceipt}
            >
              {receipt?.uri ? (
                <Image source={{ uri: receipt.uri }} style={styles.receiptPreview} />
              ) : (
                <View style={styles.receiptInner}>
                  <View style={styles.uploadIconWrap}>
                    <Upload size={24} color="#111" strokeWidth={2} />
                  </View>
                  <Text style={styles.receiptTitle}>Upload receipt</Text>
                  <Text style={styles.receiptHint}>
                    Tap to add a photo of your volunteer receipt
                  </Text>
                </View>
              )}
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
              keyboardType="decimal-pad"
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
          <OnboardingButton
            label={submitting ? "Submitting…" : "Submit"}
            onPress={handleSubmit}
            disabled={submitting}
          />
          <TouchableOpacity
            style={styles.backStepButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
            disabled={submitting}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
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
    paddingTop: 8,
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
  receiptPreview: {
    width: "100%",
    height: 170,
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
