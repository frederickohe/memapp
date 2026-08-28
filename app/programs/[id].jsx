import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Share,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Share2,
  Calendar,
  MapPin,
  Users,
  Clock,
} from "lucide-react-native";
import { useProgram } from "@/hooks/usePrograms";
import { useRecordSocialView } from "@/hooks/useSocial";
import { categoryTone } from "@/components/FeedCard";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 300;

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams();
  const programId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { program, isLoading, error } = useProgram(programId);
  useRecordSocialView(programId ? `PROGRAM:${programId}` : null);

  const handleShare = async () => {
    if (!program) return;
    try {
      await Share.share({
        title: program.title,
        message: `${program.title}\n\n${program.summary}\n\nSee this program in the YMCA Ghana App.`,
      });
    } catch (shareError) {
      console.log("Error sharing: ", shareError.message);
    }
  };

  const handleApply = () => {
    if (!program) return;
    router.push({
      pathname: "/programs/apply",
      params: { id: program.id },
    });
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

  if (error || !program) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorBack}>
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.errorText}>{error || "Program not found."}</Text>
      </SafeAreaView>
    );
  }

  const tone = categoryTone(program.category);
  const canApply = Boolean(program.allowRegistration && program.applyAction);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.Image
        source={{ uri: program.image }}
        style={[
          styles.headerImage,
          {
            transform: [{ translateY: headerTranslateY }, { scale: headerScale }],
          },
        ]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.floatingHeader} edges={["top"]}>
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

        <View style={styles.contentContainer}>
          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, { backgroundColor: tone.bg }]}>
              <Text style={[styles.categoryBadgeText, { color: tone.text }]}>
                {program.category}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Clock size={12} color="#888" style={{ marginRight: 4 }} />
              <Text style={styles.dateText}>{program.status}</Text>
            </View>
          </View>

          <Text style={styles.title}>{program.title}</Text>

          {program.dateRange ? (
            <View style={styles.detailRow}>
              <Calendar size={14} color="#666" />
              <Text style={styles.detailText}>{program.dateRange}</Text>
            </View>
          ) : null}

          {program.location ? (
            <View style={styles.detailRow}>
              <MapPin size={14} color="#666" />
              <Text style={styles.detailText}>{program.location}</Text>
            </View>
          ) : null}

          <View style={styles.detailRow}>
            <Users size={14} color="#666" />
            <Text style={styles.detailText}>
              {program.participantCount} enrolled
              {program.capacity ? ` · ${program.capacity} spots` : ""}
            </Text>
          </View>

          <View style={styles.divider} />

          {program.youtubeUrl ? (
            <YoutubeEmbed
              url={program.youtubeUrl}
              height={Math.round((width - 48) * 9 / 16)}
              style={styles.video}
            />
          ) : null}

          <Text style={styles.bodyText}>
            {program.description || "More details about this program will be shared soon."}
          </Text>
        </View>
      </Animated.ScrollView>

      {canApply ? (
        <SafeAreaView edges={["bottom"]} style={styles.applyBar}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.85}
          >
            <Text style={styles.applyButtonText}>
              {program.applyAction?.label || "Apply"}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      ) : null}
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  errorBack: {
    marginBottom: 20,
  },
  errorText: {
    fontSize: 15,
    color: "#666",
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    width,
    zIndex: 0,
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  floatingButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  headerSpacer: {
    height: HEADER_HEIGHT - 30,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  title: {
    fontSize: 22,
    fontWeight: "400",
    color: "#111",
    lineHeight: 30,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 20,
  },
  video: {
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
    fontWeight: "400",
  },
  applyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  applyButton: {
    backgroundColor: "#000",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});
