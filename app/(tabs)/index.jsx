import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, Edit3, ChevronRight } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

const HEADER_MAX_HEIGHT = 74;
const HEADER_MIN_HEIGHT = 54;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const categories = [
    {
      id: "impact",
      title: "Impact Stories",
      subtitle: "5 New Stories",
      image: "https://picsum.photos/seed/impact_stories/600/300",
      route: "/impact",
    },
    {
      id: "news",
      title: "News & Updates",
      subtitle: "5 New Updates",
      image: "https://picsum.photos/seed/news_updates/600/300",
      route: "/news",
    },
    {
      id: "connect",
      title: "Connect",
      subtitle: "2 New Connections",
      image: "https://picsum.photos/seed/connect_people/600/300",
      route: "/connect",
    },
    {
      id: "programs",
      title: "Programs & Activities",
      subtitle: "2 New Programs",
      image: "https://picsum.photos/seed/programs_activities/600/300",
      route: "/programs",
    },
    {
      id: "surveys",
      title: "Surveys & Feedback",
      subtitle: "2 New Surveys",
      image: "https://picsum.photos/seed/surveys_feedback/600/300",
      route: "/surveys",
    },
  ];

  // Header Animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [HEADER_MAX_HEIGHT + insets.top, HEADER_MIN_HEIGHT + insets.top],
    extrapolate: "clamp",
  });

  const headerBorderBottomWidth = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerBorderBottomColor = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: ["transparent", "#F0F0F0"],
    extrapolate: "clamp",
  });

  const avatarSize = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [48, 34],
    extrapolate: "clamp",
  });

  const welcomeLabelOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const welcomeLabelHeight = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [14, 0],
    extrapolate: "clamp",
  });

  const welcomeLabelMarginTop = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [0, -2],
    extrapolate: "clamp",
  });

  const profileNameSize = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [18, 14],
    extrapolate: "clamp",
  });

  const iconButtonSize = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [40, 32],
    extrapolate: "clamp",
  });

  const iconScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.85],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Collapsible Header */}
      <Animated.View
        style={[
          styles.headerRowAbsolute,
          {
            height: headerHeight,
            paddingTop: insets.top,
            borderBottomWidth: headerBorderBottomWidth,
            borderBottomColor: headerBorderBottomColor,
          },
        ]}
      >
        <View style={styles.profileSection}>
          <Animated.Image
            source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" }}
            style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
          />
          <View style={styles.welcomeTextContainer}>
            <Animated.Text
              style={[
                styles.welcomeLabel,
                {
                  opacity: welcomeLabelOpacity,
                  height: welcomeLabelHeight,
                  marginTop: welcomeLabelMarginTop,
                },
              ]}
            >
              Hello,
            </Animated.Text>
            <Animated.Text style={[styles.profileName, { fontSize: profileNameSize }]}>
              Amanda Boakye
            </Animated.Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButtonTouch} activeOpacity={0.7}>
            <Animated.View
              style={[
                styles.iconButtonAnimated,
                {
                  width: iconButtonSize,
                  height: iconButtonSize,
                  transform: [{ scale: iconScale }],
                },
              ]}
            >
              <View style={styles.bellWrapper}>
                <Bell size={20} color="#111" strokeWidth={2} />
                <View style={styles.notificationDot} />
              </View>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButtonTouch} activeOpacity={0.7}>
            <Animated.View
              style={[
                styles.iconButtonAnimated,
                {
                  width: iconButtonSize,
                  height: iconButtonSize,
                  transform: [{ scale: iconScale }],
                },
              ]}
            >
              <Edit3 size={18} color="#111" strokeWidth={2} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_MAX_HEIGHT + insets.top + 15 },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Affiliation Badge Row */}
        <TouchableOpacity
          style={styles.affiliationCard}
          activeOpacity={0.9}
          onPress={() => router.push("/affiliation")}
        >
          <View style={styles.affiliationLeft}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Affiliation 2026</Text>
            </View>
            <Text style={styles.unpaidText}>Unpaid</Text>
          </View>
          <TouchableOpacity
            style={styles.payButton}
            activeOpacity={0.8}
            onPress={() => router.push("/affiliation")}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Category Cards */}
        <View style={styles.categoriesList}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryCard}
              activeOpacity={0.95}
              onPress={() => router.push(item.route)}
            >
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.cardBg}
                imageStyle={styles.cardImageStyle}
              >
                <View style={styles.overlay}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                  </View>
                  <View style={styles.arrowCircle}>
                    <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerRowAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    borderRadius: 24,
    backgroundColor: "#F0F0F0",
  },
  welcomeTextContainer: {
    marginLeft: 12,
  },
  welcomeLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400",
  },
  profileName: {
    fontWeight: "500",
    color: "#111",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButtonTouch: {
    marginLeft: 10,
  },
  iconButtonAnimated: {
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  bellWrapper: {
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#FF3B30",
    borderWidth: 1.5,
    borderColor: "#F5F5F7",
  },
  affiliationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  affiliationLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeContainer: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  unpaidText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#Ffff",
    marginLeft: 12,
  },
  payButton: {
    backgroundColor: "#000000",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "400",
  },
  categoriesList: {
    width: "100%",
  },
  categoryCard: {
    width: "100%",
    height: 130,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardBg: {
    width: "100%",
    height: "100%",
  },
  cardImageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});
