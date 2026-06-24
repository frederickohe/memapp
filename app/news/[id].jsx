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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Share2, Heart, Bookmark, Clock } from "lucide-react-native";
import { scaleFont } from "@/components/scale";
import { mockNews } from "./index";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 300;

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Find the article based on route id
  const article = mockNews.find((item) => item.id === id) || mockNews[0];

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.summary}\n\nRead more in the YMCA Member App!`,
      });
    } catch (error) {
      console.log("Error sharing: ", error.message);
    }
  };

  // Stretchy Header Animations
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Stretchy Background Image */}
      <Animated.Image
        source={{ uri: article.image }}
        style={[
          styles.headerImage,
          {
            transform: [
              { translateY: headerTranslateY },
              { scale: headerScale },
            ],
          },
        ]}
        resizeMode="cover"
      />

      {/* Header Overlay Buttons (Floating above the image) */}
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
            <TouchableOpacity style={styles.floatingButton} onPress={handleShare} activeOpacity={0.8}>
              <Share2 size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Main Scroll Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Spacer to push content below the absolute header image */}
        <View style={styles.headerSpacer} />

        {/* Article Content Container */}
        <View style={styles.contentContainer}>
          {/* Category Badge & Date Row */}
          <View style={styles.metaRow}>
            <View
              style={[
                styles.categoryBadge,
                article.category === "Projects" ? styles.badgeProjects : styles.badgeActivities,
              ]}
            >
              <Text
                style={[
                  styles.categoryBadgeText,
                  article.category === "Projects" ? styles.textProjects : styles.textActivities,
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

          {/* Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Article Body */}
          <Text style={styles.bodyText}>{article.content}</Text>

          {/* Bottom Action Section */}
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
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    width: width,
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
    height: HEADER_HEIGHT - 30, // Slight overlap for a modern card-like feel
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
    marginBottom: 20,
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
