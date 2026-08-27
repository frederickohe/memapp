import React, { useEffect, useMemo, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Bell, ChevronRight, Star, MapPin, Crown } from "lucide-react-native";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";
import { useImpactStories, useLatestNews, usePublishedNewsCount } from "@/hooks/useNews";
import { useProminentProfiles } from "@/hooks/useProminentProfiles";
import { usePublishedProgramsCount } from "@/hooks/usePrograms";
import { useOpenSurveysCount } from "@/hooks/useSurveys";
import { useVolunteerImpact } from "@/hooks/useVolunteerImpact";
import ProfileAvatar from "@/components/ProfileAvatar";
import { formatNewsUpdatesLabel } from "@/lib/newsUtils";
import { shortProfileName } from "@/lib/profileUtils";
import { formatCount } from "@/lib/volunteerUtils";

const DARK = "#1D3108";
const SUBTLE = "#4B5563";
const CARD_BG = "#F7F8FC";

const FALLBACK_STORIES = [
  {
    id: "fallback-story-1",
    title: "Youth Leadership Camp",
    summary: "Members spent the week building skills and serving their community.",
    image:
      "https://images.unsplash.com/photo-1610441572339-bdf395d1c410?auto=format&fit=crop&w=600&q=80",
    isFallback: true,
    fallbackRoute: "/impact",
  },
  {
    id: "fallback-story-2",
    title: "Branch Outreach Day",
    summary: "Volunteers hosted games, health checks, and family activities.",
    image:
      "https://images.unsplash.com/photo-1660675134044-6f1990caba94?auto=format&fit=crop&w=600&q=80",
    isFallback: true,
    fallbackRoute: "/impact",
  },
];

const FALLBACK_NEWS = [
  {
    id: "fallback-news-1",
    title: "New Programs This Month",
    summary: "See the latest classes, camps, and member activities at your branch.",
    image:
      "https://images.unsplash.com/photo-1630386226447-af0a955c1009?auto=format&fit=crop&w=600&q=80",
    isFallback: true,
    fallbackRoute: "/news",
  },
  {
    id: "fallback-news-2",
    title: "Membership Updates",
    summary: "Stay current on branch news, events, and important notices.",
    image:
      "https://images.unsplash.com/photo-1680801237121-13222ddd73ba?auto=format&fit=crop&w=600&q=80",
    isFallback: true,
    fallbackRoute: "/news",
  },
];

const { width: SCREEN_W } = Dimensions.get("window");
// Points card inner width: screen padding (16*2) + card padding (16*2).
const CARD_INNER_W = SCREEN_W - 32 - 32;
const GLARE_W = 90;

// Greeting block: remaining gap after the 32px header row + 23px text.
const GREETING_H = 30;

export default function HomeScreen() {
  const router = useRouter();
  const profile = useUserProfile();
  const unreadCount = useUnreadNotificationCount();
  const { stories: impactStories } = useImpactStories(5);
  const { profiles: prominentProfiles } = useProminentProfiles(12);
  const { articles: latestNews } = useLatestNews(5);
  const newsCount = usePublishedNewsCount();
  const programsCount = usePublishedProgramsCount();
  const surveysCount = useOpenSurveysCount();
  const { impact } = useVolunteerImpact();

  const stories = impactStories.length > 0 ? impactStories : FALLBACK_STORIES;
  const newsItems = latestNews.length > 0 ? latestNews : FALLBACK_NEWS;
  const volunteerPoints = impact?.volunteer_points ?? 0;
  const progressRatio = impact?.next_rank_progress ?? 0;
  const fillW = CARD_INNER_W * progressRatio;
  const rankPillLabel = (impact?.rank_title || "Member").toUpperCase();
  const pointsToNextLabel = impact?.next_rank_title
    ? `${formatCount(impact.points_to_next)} pts to ${impact.next_rank_title}`
    : "All volunteer milestones unlocked";

  const branchLabel =
    profile.branch === "—" ? "Your Branch" : `${profile.branch} Branch`;

  const scrollY = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  // Looping glare that sweeps across the progress fill.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(900),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const greetingHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [GREETING_H, 0],
    extrapolate: "clamp",
  });
  const greetingOpacity = scrollY.interpolate({
    inputRange: [0, 38],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const greetingTranslate = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -8],
    extrapolate: "clamp",
  });
  const hairlineOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const glareTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-GLARE_W, fillW],
  });

  const categories = useMemo(
    () => [
      {
        id: "news",
        title: "News & Updates",
        subtitle: formatNewsUpdatesLabel(newsCount),
        image:
          "https://images.unsplash.com/photo-1669418989936-fae7f3cebd56?auto=format&fit=crop&w=1200&q=80",
        route: "/news",
      },
      {
        id: "connect",
        title: "Y Social",
        subtitle: "Posts & impact",
        image:
          "https://images.unsplash.com/photo-1648301033733-44554c74ec50?auto=format&fit=crop&w=1200&q=80",
        route: "/social",
      },
      {
        id: "programs",
        title: "Programs & Activities",
        subtitle:
          programsCount === 0
            ? "No programs yet"
            : programsCount === 1
              ? "1 Program"
              : `${programsCount} Programs`,
        image:
          "https://images.unsplash.com/photo-1610441572339-bdf395d1c410?auto=format&fit=crop&w=1200&q=80",
        route: "/programs",
      },
      {
        id: "surveys",
        title: "Surveys & Feedback",
        subtitle:
          surveysCount === 0
            ? "No surveys yet"
            : surveysCount === 1
              ? "1 Survey"
              : `${surveysCount} Surveys`,
        image:
          "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?auto=format&fit=crop&w=1200&q=80",
        route: "/surveys",
      },
    ],
    [newsCount, programsCount, surveysCount]
  );

  const openCard = (item) => {
    if (item.isFallback) {
      router.push(item.fallbackRoute || "/news");
      return;
    }
    router.push(`/news/${item.id}`);
  };

  const renderStoryCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.storyCard}
      activeOpacity={0.9}
      onPress={() => openCard(item)}
    >
      <Image source={{ uri: item.image }} style={styles.storyImage} />
      <View style={styles.storyBody}>
        <Text style={styles.storyTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.storyDesc} numberOfLines={2}>
          {item.summary || item.desc}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Collapsing Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.locationRow}>
            <MapPin size={16} color={DARK} fill={DARK} />
            <Text style={styles.locationText}>{branchLabel}</Text>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
            onPress={() => router.push("/notifications")}
          >
            <Bell size={24} color="#111" strokeWidth={2} fill="#111" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.greetingWrap,
            {
              height: greetingHeight,
              opacity: greetingOpacity,
              transform: [{ translateY: greetingTranslate }],
            },
          ]}
        >
          <Text style={styles.greeting}>Hello, {profile.firstName} </Text>
        </Animated.View>

        <Animated.View style={[styles.headerHairline, { opacity: hairlineOpacity }]} />
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Points / Rewards Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsTopRow}>
            <View style={styles.pointsSummary}>
              <View style={styles.coin}>
                <Star size={8} color="#fff" fill="#fff" />
              </View>
              <Text style={styles.pointsValue}>{formatCount(volunteerPoints)}</Text>
              <Text style={styles.pointsLabel}>Points</Text>
            </View>
            <LinearGradient
              colors={["#D4AF37", "#F7D774"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.goldPill}
            >
              <Text style={styles.goldPillText} numberOfLines={1}>
                {rankPillLabel}
              </Text>
              <Crown size={12} color="#fff" fill="#fff" />
            </LinearGradient>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(progressRatio * 100, 0)}%` }]}>
              <Animated.View
                style={[
                  styles.glare,
                  { transform: [{ translateX: glareTranslate }, { skewX: "-20deg" }] },
                ]}
              >
                <LinearGradient
                  colors={[
                    "rgba(255,255,255,0)",
                    "rgba(255,255,255,0.65)",
                    "rgba(255,255,255,0)",
                  ]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
          </View>
          <Text style={styles.pointsToNext}>{pointsToNextLabel}</Text>

          <TouchableOpacity
            style={styles.qrButton}
            activeOpacity={0.85}
            onPress={() => router.push("/achievements")}
          >
            <Text style={styles.qrButtonText}>Achievement and Impact</Text>
            <ChevronRight size={20} color={DARK} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Impact Stories</Text>
          <TouchableOpacity
            style={styles.viewAll}
            activeOpacity={0.7}
            onPress={() => router.push("/impact")}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color={DARK} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {stories.map(renderStoryCard)}
        </ScrollView>

        {prominentProfiles.length > 0 ? (
          <>
            <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
              <Text style={styles.sectionTitle}>Prominent Profiles</Text>
              <TouchableOpacity
                style={styles.viewAll}
                activeOpacity={0.7}
                onPress={() => router.push("/profiles")}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={DARK} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {prominentProfiles.map((person) => (
                <TouchableOpacity
                  key={person.id}
                  style={styles.profileItem}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/profiles/${person.id}`)}
                >
                  <ProfileAvatar
                    name={person.fullName}
                    photoUrl={person.photoUrl}
                    size={64}
                  />
                  <Text style={styles.profileName} numberOfLines={1}>
                    {shortProfileName(person.fullName)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : null}

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
                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0.75)",
                    "rgba(0,0,0,0.28)",
                    "rgba(0,0,0,0.06)",
                  ]}
                  locations={[0, 0.52, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.overlay}
                >
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.cardPill}>
                    <Text style={styles.cardPillText}>{item.subtitle}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
          <Text style={styles.sectionTitle}>Latest News</Text>
          <TouchableOpacity
            style={styles.viewAll}
            activeOpacity={0.7}
            onPress={() => router.push("/news")}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color={DARK} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {newsItems.map(renderStoryCard)}
        </ScrollView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 14,
    backgroundColor: "#FFFFFF",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 32,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: "#000",
  },
  bellButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -2,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: "#FF0000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
  greetingWrap: {
    justifyContent: "flex-end",
    overflow: "hidden",
    paddingHorizontal: 18,
  },
  greeting: {
    fontSize: 15,
    lineHeight: 23,
    color: "#000",
    fontWeight: "500",
  },
  headerHairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 20,
  },
  pointsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    overflow: "hidden",
  },
  pointsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pointsSummary: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  coin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E6A817",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 7,
  },
  pointsValue: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "700",
    color: "#000",
  },
  pointsLabel: {
    fontSize: 14,
    lineHeight: 23,
    color: "#333",
    marginLeft: 4,
  },
  goldPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 20,
    borderRadius: 40,
    paddingHorizontal: 8,
    maxWidth: "58%",
  },
  goldPillText: {
    color: "#FFFFFF",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  progressTrack: {
    height: 8,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 24,
    backgroundColor: "#FF0000",
    overflow: "hidden",
  },
  glare: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: GLARE_W,
  },
  pointsToNext: {
    fontSize: 12,
    lineHeight: 17,
    color: "#000",
    marginBottom: 24,
  },
  qrButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  qrButtonText: {
    color: DARK,
    fontSize: 14,
    lineHeight: 23,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 24,
    marginBottom: 16,
  },
  sectionHeaderSpaced: {
    marginTop: 37,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: DARK,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 20,
  },
  viewAllText: {
    fontSize: 13,
    lineHeight: 20,
    color: DARK,
    fontWeight: "500",
  },
  hScroll: {
    paddingRight: 4,
  },
  storyCard: {
    width: 240,
    height: 201,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
  },
  storyImage: {
    width: "100%",
    height: 112,
    backgroundColor: "#ECECEC",
  },
  storyBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  storyTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
    color: DARK,
  },
  storyDesc: {
    fontSize: 12,
    color: SUBTLE,
    lineHeight: 18,
    marginTop: 2,
  },
  profileItem: {
    alignItems: "center",
    marginRight: 16,
    width: 72,
  },
  profileName: {
    fontSize: 12,
    lineHeight: 19,
    color: DARK,
    marginTop: 6,
    textAlign: "center",
  },
  categoriesList: {
    width: "100%",
    marginTop: 37,
    gap: 12,
  },
  categoryCard: {
    width: "100%",
    height: 118,
    borderRadius: 16,
    overflow: "hidden",
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 29,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  cardPill: {
    height: 26,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 9,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  cardPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
});
