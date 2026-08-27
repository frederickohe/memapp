import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, Play } from "lucide-react-native";
import { OnboardingButton } from "@/components/OnboardingFormComponents";
import { setVolunteerApplyDraft } from "@/lib/volunteerUtils";

const VIDEO_PREVIEW =
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50e?auto=format&fit=crop&w=800&q=80";

const STEPS = ["Upload", "Details"];

export default function ApplyVolunteerHoursScreen() {
  const router = useRouter();
  const [video, setVideo] = useState(null);

  const goToForm = (nextVideo = video) => {
    setVolunteerApplyDraft({ video: nextVideo || null });
    router.push("/apply-volunteer-hours-form");
  };

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Video access needed", "Allow photo access to attach a volunteer video.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setVideo({
        uri: asset.uri,
        name: asset.fileName || "volunteer-video.mp4",
        type: asset.mimeType || "video/mp4",
      });
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
          <Text style={styles.stepTitle}>Upload Video Content</Text>

          <View style={styles.mediaPadding}>
            <TouchableOpacity
              style={styles.videoCard}
              activeOpacity={0.95}
              onPress={pickVideo}
            >
              <ImageBackground
                source={{ uri: VIDEO_PREVIEW }}
                style={styles.videoImage}
                imageStyle={styles.videoImageStyle}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.45)", "rgba(0,0,0,0.1)"]}
                  style={styles.videoOverlay}
                />
                <View style={styles.playButton}>
                  <Play
                    size={16}
                    color="#fff"
                    fill="#fff"
                    style={styles.playIcon}
                  />
                </View>
                <View style={styles.videoBar}>
                  <View style={styles.scrubberFilled} />
                  <View style={styles.scrubberTrack} />
                </View>
              </ImageBackground>
            </TouchableOpacity>
            <Text style={styles.videoHint}>
              {video ? "Video selected. Tap to replace it." : "Tap to add a volunteer video (optional)."}
            </Text>
          </View>

          <View style={styles.progressRow}>
            {STEPS.map((step, index) => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  index === 0
                    ? styles.progressDotActive
                    : styles.progressDotInactive,
                ]}
              />
            ))}
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.description}>
              We will be very glad if you can share a video of your volunteer
              contribution.
            </Text>
            <Text style={styles.descriptionSecondary}>
              This may appear in our impact stories feed and also our social
              handles.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <OnboardingButton label="Next" onPress={goToForm} />
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => goToForm(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Skip for now</Text>
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
  videoCard: {
    width: "100%",
    height: 170,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  videoImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoImageStyle: {
    borderRadius: 16,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  playButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,200,80,0.92)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  playIcon: {
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
  videoHint: {
    marginTop: 10,
    fontSize: 13,
    color: "#666",
    textAlign: "center",
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
  copyBlock: {
    paddingHorizontal: 24,
    gap: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#333",
    textAlign: "center",
  },
  descriptionSecondary: {
    fontSize: 13,
    lineHeight: 20,
    color: "#666",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 18,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
});
