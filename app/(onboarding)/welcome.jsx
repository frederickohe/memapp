import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

/**
 * Onboarding Welcome Screen (Onboarding 1)
 * Shows YMCA welcome message with video placeholder and a "Next" button.
 */
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Placeholder */}
        <View style={{paddingHorizontal: 20, marginTop: "10%"}}>
        <View style={styles.videoContainer}>
          <View style={styles.videoDarkBg} />
          {/* Gym background shapes */}
          <View style={styles.videoDecorLeft} />
          <View style={styles.videoDecorRight} />
          {/* Play button */}
          <View style={styles.playButton}>
            <View style={styles.playTriangle} />
          </View>
          {/* Bottom scrubber bar */}
          <View style={styles.videoControls}>
            <View style={styles.scrubberFilled} />
            <View style={styles.scrubberEmpty} />
          </View>
        </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Welcome To The Ymca Family</Text>
          <Text style={styles.body}>
            Your Y connects you to other members and to all the things that matter: sports and fitness, arts and education, camps and community programs, and much, much more.
          </Text>
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push("/(onboarding)/stepper")}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flexGrow: 1,
  },
  // Video placeholder
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
  videoDarkBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#222",
  },
  videoDecorLeft: {
    position: "absolute",
    left: 20,
    top: 20,
    bottom: 30,
    width: width * 0.28,
    backgroundColor: "#333",
    borderRadius: 4,
    opacity: 0.7,
  },
  videoDecorRight: {
    position: "absolute",
    right: 20,
    top: 20,
    bottom: 30,
    width: width * 0.28,
    backgroundColor: "#333",
    borderRadius: 4,
    opacity: 0.7,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,200,80,0.92)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 16,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#fff",
    marginLeft: 4,
  },
  videoControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
  },
  scrubberFilled: {
    width: 55,
    height: 3,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  scrubberEmpty: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 2,
  },
  // Content
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    marginBottom: 14,
    lineHeight: 26,
  },
  body: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  nextButton: {
    backgroundColor: "#000",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
  },
});
