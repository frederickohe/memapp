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
import { useAuthStore } from "@/stores/useAuthStore";
import { mapAuthToProfile } from "@/lib/userProfile";

const DARK = "#1D3108";
const SUBTLE = "#4B5563";
const CARD_BG = "#F7F8FC";

const { width: SCREEN_W } = Dimensions.get("window");
// Points card inner width: screen padding (16*2) + card padding (16*2).
const CARD_INNER_W = SCREEN_W - 32 - 32;
const PROGRESS_RATIO = 0.61;
const FILL_W = CARD_INNER_W * PROGRESS_RATIO;
const GLARE_W = 90;

const GREETING_H = 34;

export default function HomeScreen() {
  const router = useRouter();
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const user = useAuthStore((state) => state.user);
  const phone = useAuthStore((state) => state.phone);
  const email = useAuthStore((state) => state.email);

  const profile = useMemo(
    () => mapAuthToProfile({ user, phone, email }),
    [user, phone, email]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
    outputRange: [-GLARE_W, FILL_W],
  });

  const impactStories = [
    {
      id: "food",
      title: "Food Festival",
      desc: "Discover international street food, cooking demos, and live music performances.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "fashion",
      title: "Fashion Week",
      desc: "Experience runway shows featuring local and international fashion brands and designers.",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "sports",
      title: "Sports Gala",
      desc: "Cheer on members competing across athletics, basketball, and community games.",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const prominentProfiles = [
    { id: "chatime", name: "Chatime", logo: require("@/assets/logos/chatime.png") },
    { id: "informa", name: "Informa", logo: require("@/assets/logos/informa.png") },
    { id: "zara", name: "Zara", logo: require("@/assets/logos/zara.png") },
    { id: "hm", name: "H&M", logo: require("@/assets/logos/hm.png") },
    { id: "starbucks", name: "Starbucks", logo: require("@/assets/logos/starbucks.png") },
  ];

  const categories = [
    {
      id: "news",
      title: "News & Updates",
      subtitle: "5 New Updates",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
      route: "/news",
    },
    {
      id: "connect",
      title: "Connect",
      subtitle: "2 New Connections",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",
      route: "/connect",
    },
    {
      id: "programs",
      title: "Programs & Activities",
      subtitle: "2 New Programs",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80",
      route: "/programs",
    },
    {
      id: "surveys",
      title: "Surveys & Feedback",
      subtitle: "2 New Surveys",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      route: "/surveys",
    },
  ];

  const promotions = [
    {
      id: "promo1",
      title: "20% Off Gym Gear",
      desc: "Members save on all fitness equipment in store this month.",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "promo2",
      title: "Free Smoothie",
      desc: "Grab a complimentary smoothie with any class booking this week.",
      image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const renderStoryCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.storyCard}
      activeOpacity={0.9}
      onPress={() => router.push("/impact")}
    >
      <Image source={{ uri: item.image }} style={styles.storyImage} />
      <View style={styles.storyBody}>
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.storyDesc} numberOfLines={2}>
          {item.desc}
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
            <MapPin size={18} color={DARK} fill={DARK} />
            <Text style={styles.locationText}>{branchLabel}</Text>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
            onPress={() => router.push("/notifications")}
          >
            <Bell size={24} color="#111" strokeWidth={2} fill="#111" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
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
                <Star size={9} color="#fff" fill="#fff" />
              </View>
              <Text style={styles.pointsValue}>15,240</Text>
              <Text style={styles.pointsLabel}>Points</Text>
            </View>
            <LinearGradient
              colors={["#D4AF37", "#F7D774"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.goldPill}
            >
              <Text style={styles.goldPillText}>GOLD MEMBER</Text>
              <Crown size={12} color="#fff" fill="#fff" />
            </LinearGradient>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill}>
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
          <Text style={styles.pointsToNext}>4,760 pts to Platinum</Text>

          <TouchableOpacity
            style={styles.qrButton}
            activeOpacity={0.85}
            onPress={() => router.push("/achievements")}
          >
            <Text style={styles.qrButtonText}>Achievement and Impact</Text>
            <ChevronRight size={18} color={DARK} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* Impact Stories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Impact Stories</Text>
          <TouchableOpacity
            style={styles.viewAll}
            activeOpacity={0.7}
            onPress={() => router.push("/impact")}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={14} color={DARK} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {impactStories.map(renderStoryCard)}
        </ScrollView>

        {/* Prominent Profiles */}
        <View style={[styles.sectionHeader, { marginTop: 26 }]}>
          <Text style={styles.sectionTitle}>Prominent Profiles</Text>
          <TouchableOpacity style={styles.viewAll} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={14} color={DARK} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {prominentProfiles.map((brand) => (
            <View key={brand.id} style={styles.profileItem}>
              <View style={styles.logoBox}>
                <Image
                  source={brand.logo}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.profileName}>{brand.name}</Text>
            </View>
          ))}
        </ScrollView>

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
                  colors={["rgba(0,0,0,0.78)", "rgba(0,0,0,0.15)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
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

        {/* Latest Promotions */}
        <View style={[styles.sectionHeader, { marginTop: 26 }]}>
          <Text style={styles.sectionTitle}>Latest Promotions</Text>
          <TouchableOpacity style={styles.viewAll} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={14} color={DARK} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {promotions.map(renderStoryCard)}
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
    paddingTop: 8,
    backgroundColor: "#FFFFFF",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 16,
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
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
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
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  greeting: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  headerHairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  pointsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  pointsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  pointsSummary: {
    flexDirection: "row",
    alignItems: "center",
  },
  coin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E6A817",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  pointsLabel: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
  },
  goldPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  goldPillText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  progressTrack: {
    height: 8,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    width: `${PROGRESS_RATIO * 100}%`,
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
    color: "#000",
    marginBottom: 16,
  },
  qrButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 40,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  qrButtonText: {
    color: DARK,
    fontSize: 14,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DARK,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    color: DARK,
    fontWeight: "500",
  },
  hScroll: {
    paddingRight: 4,
  },
  storyCard: {
    width: 240,
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
    paddingTop: 10,
    paddingBottom: 16,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DARK,
  },
  storyDesc: {
    fontSize: 12,
    color: SUBTLE,
    lineHeight: 18,
    marginTop: 4,
  },
  profileItem: {
    alignItems: "center",
    marginRight: 16,
    width: 56,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF0F4",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 12,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  profileName: {
    fontSize: 12,
    color: DARK,
    marginTop: 8,
  },
  categoriesList: {
    width: "100%",
    marginTop: 26,
  },
  categoryCard: {
    width: "100%",
    height: 118,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
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
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  cardPill: {
    marginTop: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  cardPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
});
