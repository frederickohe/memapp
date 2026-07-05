import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Pencil,
  Award,
  Trash2,
  BookOpen,
  Package,
  Laptop,
  ArrowRight,
} from "lucide-react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import Reanimated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

const COLORS = {
  bg: "#FFFFFF",
  dark: "#1A1C1D",
  brown: "#5C403C",
  gray: "#5D5E5F",
  red: "#FF0000",
  redText: "#DC2626",
  pink: "#FEF2F2",
  pinkBorder: "#FEE2E2",
  grayBg: "#F9FAFB",
  border: "#F3F4F6",
  circleBorder: "#D4D8E0",
};

// Circular progress ring geometry (community championship level).
const RING_SIZE = 224;
const RING_STROKE = 12;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_C = 2 * Math.PI * RING_R;
const LEVEL_PROGRESS = 0.85; // 85% toward the next championship level

const AnimatedCircle = Reanimated.createAnimatedComponent(Circle);

const contributions = [
  {
    id: "c1",
    title: "Park Cleanup Drive",
    meta: "Oct 12, 2023 • 3 Hours",
    points: "+30 pts",
    Icon: Trash2,
    accent: true,
  },
  {
    id: "c2",
    title: "Local Library Support",
    meta: "Oct 05, 2023 • 4 Hours",
    points: "+40 pts",
    Icon: BookOpen,
    accent: false,
  },
  {
    id: "c3",
    title: "Food Bank Sorting",
    meta: "Sep 28, 2023 • 2 Hours",
    points: "+20 pts",
    Icon: Package,
    accent: false,
  },
  {
    id: "c4",
    title: "Senior Tech Help",
    meta: "Sep 20, 2023 • 2 Hours",
    points: "+20 pts",
    Icon: Laptop,
    accent: true,
  },
];

export default function VolunteerScreen() {
  const router = useRouter();

  // Draw the progress ring on first load.
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      250,
      withTiming(LEVEL_PROGRESS, {
        duration: 1600,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, []);

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_C * (1 - progress.value),
  }));

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color="#636268" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volunteer</Text>
        <TouchableOpacity style={styles.circleBtn} activeOpacity={0.7}>
          <Pencil size={20} color="#B1B2B4" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.ringWrapper}>
            {/* Animated progress ring */}
            <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgGradient id="goldRing" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#F9E08A" />
                  <Stop offset="0.5" stopColor="#E6A817" />
                  <Stop offset="1" stopColor="#B8760A" />
                </SvgGradient>
              </Defs>
              {/* Track */}
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_R}
                stroke="#F3EBD6"
                strokeWidth={RING_STROKE}
                fill="none"
              />
              {/* Progress */}
              <AnimatedCircle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_R}
                stroke="url(#goldRing)"
                strokeWidth={RING_STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                animatedProps={ringProps}
                originX={RING_SIZE / 2}
                originY={RING_SIZE / 2}
                rotation={-90}
              />
            </Svg>

            {/* Gold badge inside the ring */}
            <View style={styles.badge}>
              <LinearGradient
                colors={["#F9E08A", "#E6A817", "#B8760A"]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.badgeGradient}
              >
                <Award size={60} color="#FFFFFF" strokeWidth={1.6} />
                <Text style={styles.badgeLevel}>LEVEL 8</Text>
              </LinearGradient>
            </View>
          </View>

          <Text style={styles.heroTitle}>Gold Volunteer</Text>
          <Text style={styles.heroSubtitle}>
            You're in the top 15% of volunteers — Community Championship Level 8.
          </Text>
        </View>

        {/* Progress Tracking */}
        <View style={styles.card}>
          <View style={styles.progressTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.progressLabel}>Progress to Platinum</Text>
              <Text style={styles.progressValue}>85 Hours</Text>
            </View>
            <View style={styles.percentPill}>
              <Text style={styles.percentPillText}>85%</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${LEVEL_PROGRESS * 100}%` }]}
            />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.footerMuted}>85 hours completed</Text>
            <Text style={styles.footerDark}>100 hours goal</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumberRed}>12</Text>
              <Text style={styles.statLabel}>Events Joined</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumberGray}>#3</Text>
              <Text style={styles.statLabel}>Community Rank</Text>
            </View>
          </View>
        </View>

        {/* Recent Contributions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Contributions</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {contributions.map((item) => {
          const Icon = item.Icon;
          return (
            <View key={item.id} style={styles.contribCard}>
              <View
                style={[
                  styles.contribIcon,
                  { backgroundColor: item.accent ? COLORS.pink : COLORS.grayBg },
                ]}
              >
                <Icon
                  size={20}
                  color={item.accent ? COLORS.red : COLORS.gray}
                  strokeWidth={2}
                />
              </View>
              <View style={styles.contribBody}>
                <Text style={styles.contribTitle}>{item.title}</Text>
                <Text style={styles.contribMeta}>{item.meta}</Text>
              </View>
              <View
                style={[
                  styles.pointsPill,
                  { backgroundColor: item.accent ? COLORS.pink : COLORS.grayBg },
                ]}
              >
                <Text
                  style={[
                    styles.pointsText,
                    { color: item.accent ? COLORS.red : COLORS.gray },
                  ]}
                >
                  {item.points}
                </Text>
              </View>
            </View>
          );
        })}

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
          <Text style={styles.ctaText}>Apply for Volunteer Hours</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.ctaSubtitle}>
          Earn 15 more hours to unlock Platinum Tier
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  circleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.circleBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#192126",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  /* Hero */
  hero: {
    alignItems: "center",
    marginBottom: 40,
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  badge: {
    width: RING_SIZE - RING_STROKE * 2 - 20,
    height: RING_SIZE - RING_STROKE * 2 - 20,
    borderRadius: (RING_SIZE - RING_STROKE * 2 - 20) / 2,
    shadowColor: "#E6A817",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  badgeGradient: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLevel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.brown,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  /* Progress card */
  card: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 12,
    padding: 25,
    marginBottom: 40,
  },
  progressTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.brown,
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.dark,
  },
  percentPill: {
    backgroundColor: COLORS.pink,
    borderWidth: 1,
    borderColor: COLORS.pinkBorder,
    borderRadius: 9999,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },
  percentPillText: {
    color: COLORS.redText,
    fontSize: 13,
    fontWeight: "600",
  },
  progressTrack: {
    height: 8,
    borderRadius: 9999,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: COLORS.red,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footerMuted: {
    fontSize: 13,
    color: COLORS.brown,
  },
  footerDark: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: "500",
  },
  statRow: {
    flexDirection: "row",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#F7F8F9",
    paddingTop: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumberRed: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.red,
    marginBottom: 4,
  },
  statNumberGray: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.gray,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.brown,
  },

  /* Section header */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.red,
  },

  /* Contribution card */
  contribCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contribIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contribBody: {
    flex: 1,
  },
  contribTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 4,
  },
  contribMeta: {
    fontSize: 13,
    color: COLORS.brown,
  },
  pointsPill: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: "600",
  },

  /* CTA */
  ctaButton: {
    backgroundColor: "#000000",
    borderRadius: 16,
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  ctaSubtitle: {
    fontSize: 14,
    color: COLORS.brown,
    textAlign: "center",
    marginTop: 16,
  },
});
