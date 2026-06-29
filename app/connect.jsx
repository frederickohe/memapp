import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const VIDEO_IMAGE =
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80";

export default function ConnectEntranceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Container (same treatment as onboarding) */}
        <View style={styles.videoWrap}>
          <View style={styles.videoContainer}>
            <Image source={{ uri: VIDEO_IMAGE }} style={styles.videoImage} />
            <View style={styles.videoOverlay} />
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
          <Text style={styles.title}>Lorem ipsum dolor sit amet, consectetur</Text>
          <Text style={styles.body}>
            • adipiscing elit. Lobortis cras placerat diam ipsum ut. Nisi vel
            adipiscing massa bibendum diam. Suspendisse mattis dui maecenas duis
            mattis. Mattis aliquam at arcu, semper nunc, venenatis et
            pellentesque eu. Id tristique maecenas tristique habitasse eu
          </Text>
        </View>
      </ScrollView>

      {/* Connect Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.connectButton}
          activeOpacity={0.9}
          onPress={() => router.push("/connect-user")}
        >
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flexGrow: 1,
    paddingTop: 12,
  },
  videoWrap: {
    paddingHorizontal: 20,
    marginTop: "6%",
  },
  videoContainer: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  videoImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
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
  content: {
    paddingHorizontal: 28,
    paddingTop: 26,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
    marginBottom: 14,
    lineHeight: 22,
  },
  body: {
    fontSize: 13,
    color: "#666",
    lineHeight: 21,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  connectButton: {
    backgroundColor: "#111",
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: "center",
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});
