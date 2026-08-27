import React, { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MapPin, Share2 } from "lucide-react-native";
import { useProminentProfile } from "@/hooks/useProminentProfiles";
import { profileInitials } from "@/lib/profileUtils";

const DARK = "#1D3108";
const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 320;

export default function ProminentProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const profileId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { profile, isLoading, error } = useProminentProfile(profileId);

  const handleShare = async () => {
    if (!profile) return;
    try {
      await Share.share({
        title: profile.fullName,
        message: `${profile.fullName}\n${profile.headline}\n\n${profile.bio}\n\nRead more in the YMCA Member App.`,
      });
    } catch (shareError) {
      console.log("Error sharing: ", shareError.message);
    }
  };

  const headerScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0],
    outputRange: [2, 1],
    extrapolateLeft: "extend",
    extrapolateRight: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0],
    outputRange: [-HEADER_HEIGHT / 2, 0],
    extrapolateLeft: "extend",
    extrapolateRight: "clamp",
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorBack}>
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.errorText}>{error || "Profile not found."}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {profile.photoUrl ? (
        <Animated.Image
          source={{ uri: profile.photoUrl }}
          style={[
            styles.headerImage,
            {
              transform: [{ translateY: headerTranslateY }, { scale: headerScale }],
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.headerImage, styles.headerFallback]}>
          <Text style={styles.headerInitials}>{profileInitials(profile.fullName)}</Text>
        </View>
      )}

      <View style={styles.headerScrim} />

      <SafeAreaView style={styles.floatingHeader}>
        <View style={styles.headerActionRow}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Share2 size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.headerSpacer} />
        <View style={styles.body}>
          <Text style={styles.category}>
            {profile.category === "GHANA" ? "Ghana YMCA" : "World YMCA"}
          </Text>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.headline}>{profile.headline}</Text>

          <View style={styles.metaRow}>
            {profile.country ? (
              <View style={styles.pill}>
                <MapPin size={12} color={DARK} />
                <Text style={styles.pillText}>{profile.country}</Text>
              </View>
            ) : null}
            {profile.era ? (
              <View style={styles.pill}>
                <Text style={styles.pillText}>{profile.era}</Text>
              </View>
            ) : null}
            {profile.occupation ? (
              <View style={styles.pill}>
                <Text style={styles.pillText}>{profile.occupation}</Text>
              </View>
            ) : null}
          </View>

          {profile.bio
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
              <Text key={index} style={styles.bio}>
                {paragraph}
              </Text>
            ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  errorBack: {
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height: HEADER_HEIGHT,
    backgroundColor: DARK,
  },
  headerFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerInitials: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "700",
  },
  headerScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height: HEADER_HEIGHT,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  headerSpacer: {
    height: HEADER_HEIGHT - 28,
  },
  body: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 24,
    minHeight: 400,
  },
  category: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "#B45309",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    color: DARK,
  },
  headline: {
    fontSize: 16,
    lineHeight: 23,
    color: "#4B5563",
    marginTop: 8,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 12,
    color: DARK,
    fontWeight: "500",
  },
  bio: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 16,
  },
});
