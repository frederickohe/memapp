import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Share,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Share2, Heart, Bookmark, Clock, MapPin } from "lucide-react-native";
import { useNewsArticle } from "@/hooks/useNews";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 300;

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const newsId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { article, isLoading, error } = useNewsArticle(newsId);

  const handleShare = async () => {
    if (!article) return;

    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.summary}\n\nRead more in the YMCA Member App!`,
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

  if (error || !article) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorBack}>
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.errorText}>{error || "Article not found."}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.Image
        source={{ uri: article.image }}
        style={[
          styles.headerImage,
          {
            transform: [{ translateY: headerTranslateY }, { scale: headerScale }],
          },
        ]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.floatingHeader}>
        <View style={styles.headerActionRow}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.rightActions}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Share2 size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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
            <View
              style={[
                styles.categoryBadge,
                article.category === "Projects"
                  ? styles.badgeProjects
                  : styles.badgeActivities,
              ]}
            >
              <Text
                style={[
                  styles.categoryBadgeText,
                  article.category === "Projects"
                    ? styles.textProjects
                    : styles.textActivities,
                ]}
              >
                {article.category}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Clock size={12} color="#888" style={{ marginRight: 4 }} />
              <Text style={styles.dateText}>{article.date}</Text>
            </View>
          </View>

          <Text style={styles.title}>{article.title}</Text>

          {article.eventLocation ? (
            <View style={styles.locationRow}>
              <MapPin size={14} color="#666" />
              <Text style={styles.locationText}>{article.eventLocation}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.bodyText}>{article.content}</Text>

          <View style={styles.footerActions}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Heart size={18} color="#FF3B30" fill="#FF3B30" />
              <Text style={styles.actionButtonText}>Liked</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Bookmark size={18} color="#666" />
              <Text style={styles.actionButtonText}>Bookmark</Text>
            </TouchableOpacity>
          </View>
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
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
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
  badgeProjects: {
    backgroundColor: "#E5F6FF",
  },
  badgeActivities: {
    backgroundColor: "#EAFBF0",
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  textProjects: {
    color: "#007AFF",
  },
  textActivities: {
    color: "#34C759",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  title: {
    fontSize: 22,
    fontWeight: "400",
    color: "#111",
    lineHeight: 30,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
    fontWeight: "400",
    marginBottom: 30,
  },
  footerActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginLeft: 8,
  },
});
