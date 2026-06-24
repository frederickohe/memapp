import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

/**
 * Shared header component for all onboarding form screens.
 * Shows a video placeholder at the top.
 */
export function OnboardingVideoHeader({ title, currentStep, totalSteps }) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      {/* Video Placeholder */}
      <View style={styles.videoContainer}>
        <View style={styles.videoBg} />
        {/* Play button */}
        <View style={styles.playButton}>
          <View style={styles.playTriangle} />
        </View>
        {/* Bottom bar overlay */}
        <View style={styles.videoBar}>
          <View style={styles.videoBarLeft} />
          <View style={styles.videoBarRight} />
        </View>
      </View>

      {/* Progress bar */}
      {totalSteps && (
        <View style={styles.progressContainer}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i < currentStep ? styles.progressDotActive : styles.progressDotInactive,
              ]}
            />
          ))}
        </View>
      )}

      {/* Title */}
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
  },
  videoContainer: {
    width: "100%",
    height: 160,
    backgroundColor: "#1a1a1a",
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  videoBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2a2a2a",
    opacity: 0.8,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,200,80,0.9)",
    justifyContent: "center",
    alignItems: "center",
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
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 8,
  },
  videoBarLeft: {
    width: 60,
    height: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  videoBarRight: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
  },
  progressDotActive: {
    width: 20,
    backgroundColor: "#000",
  },
  progressDotInactive: {
    width: 12,
    backgroundColor: "#ddd",
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    paddingBottom: 8,
    paddingHorizontal: 24,
  },
});
