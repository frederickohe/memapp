import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
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
import { useVolunteerImpact } from "@/hooks/useVolunteerImpact";
import {
  contributionIcon,
  formatHoursLabel,
  formatVolunteerDate,
  milestoneImageSource,
} from "@/lib/volunteerUtils";

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
};

const RING_SIZE = 224;
const RING_STROKE = 12;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_C = 2 * Math.PI * RING_R;

const AnimatedCircle = Reanimated.createAnimatedComponent(Circle);

export default function VolunteerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const milestoneId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { impact, isLoading, error, refresh } = useVolunteerImpact();

  const milestone = useMemo(() => {
    const milestones = impact?.milestones || [];
    if (!milestones.length) return null;
    return (
      milestones.find((item) => item.id === milestoneId) ||
      milestones.find((item) => item.status === "in_progress") ||
      milestones.find((item) => item.id === impact?.current_milestone_id) ||
      milestones[0]
    );
  }, [impact, milestoneId]);

  const hours = impact?.hours_volunteered || 0;
  const viewingCompleted = milestone?.status === "completed";
  const goalHours =
    viewingCompleted && milestone?.next_hours_required
      ? milestone.next_hours_required
      : milestone?.hours_required || 0;
  const progressValue =
    goalHours > 0 ? Math.min(1, hours / goalHours) : milestone?.progress ?? 0;
  const remainingHours = Math.max(0, goalHours - hours);
  const nextName = milestone?.next_name;
  const imageSource = milestoneImageSource(milestone?.image_key);
  const contributions = impact?.recent_contributions || [];

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      250,
      withTiming(progressValue, {
        duration: 1600,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [progress, progressValue]);

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_C * (1 - progress.value),
  }));

  if (isLoading && !impact) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.red} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volunteer</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {error && !milestone ? (
          <TouchableOpacity onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryText}>{error}. Try again</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.hero}>
          <View style={styles.ringWrapper}>
            <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgGradient id="goldRing" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#F9E08A" />
                  <Stop offset="0.5" stopColor="#E6A817" />
                  <Stop offset="1" stopColor="#B8760A" />
                </SvgGradient>
              </Defs>
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_R}
                stroke="#F3EBD6"
                strokeWidth={RING_STROKE}
                fill="none"
              />
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

            <View style={styles.badge}>
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={styles.badgeImage}
                  resizeMode="contain"
                />
              ) : (
                <Award size={88} color="#E6A817" strokeWidth={1.6} />
              )}
              <Text style={styles.badgeLevel}>
                LEVEL {milestone?.level || 1}
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{milestone?.title || "Volunteer"}</Text>
          <Text style={styles.heroSubtitle}>
            {milestone?.status === "completed"
              ? `You've unlocked ${milestone?.name}. Keep volunteering to reach the next milestone.`
              : `You're working toward ${milestone?.name}. Log approved hours to unlock this milestone.`}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.progressTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.progressLabel}>
                {milestone?.status === "completed" && nextName
                  ? `Progress to ${nextName}`
                  : `Progress to ${milestone?.name || "next milestone"}`}
              </Text>
              <Text style={styles.progressValue}>{formatHoursLabel(hours)}</Text>
            </View>
            <View style={styles.percentPill}>
              <Text style={styles.percentPillText}>
                {Math.round(progressValue * 100)}%
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progressValue * 100}%` }]}
            />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.footerMuted}>
              {formatHoursLabel(hours)} completed
            </Text>
            <Text style={styles.footerDark}>
              {formatHoursLabel(goalHours)} goal
            </Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumberRed}>
                {impact?.events_attended || 0}
              </Text>
              <Text style={styles.statLabel}>Events Joined</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumberGray}>
                #{impact?.community_rank || 0}
              </Text>
              <Text style={styles.statLabel}>Community Rank</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Contributions</Text>
        </View>

        {contributions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No volunteer hours submitted yet. Apply hours to start this milestone.
            </Text>
          </View>
        ) : (
          contributions.map((item, index) => {
            const Icon = contributionIcon(item.title);
            const accent = index % 2 === 0;
            const pending = item.status === "pending";
            const rejected = item.status === "rejected";
            const pointsLabel = rejected
              ? "Rejected"
              : pending
                ? "Pending"
                : `+${item.points || 0} pts`;
            return (
              <View key={item.id} style={styles.contribCard}>
                <View
                  style={[
                    styles.contribIcon,
                    { backgroundColor: accent ? COLORS.pink : COLORS.grayBg },
                  ]}
                >
                  <Icon
                    size={20}
                    color={accent ? COLORS.red : COLORS.gray}
                    strokeWidth={2}
                  />
                </View>
                <View style={styles.contribBody}>
                  <Text style={styles.contribTitle}>{item.title}</Text>
                  <Text style={styles.contribMeta}>
                    {formatVolunteerDate(item.volunteer_date)} • {formatHoursLabel(item.hours)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.pointsPill,
                    { backgroundColor: accent ? COLORS.pink : COLORS.grayBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.pointsText,
                      { color: accent ? COLORS.red : COLORS.gray },
                    ]}
                  >
                    {pointsLabel}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.9}
          onPress={() => router.push("/apply-volunteer-hours")}
        >
          <Text style={styles.ctaText}>Apply for Volunteer Hours</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.ctaSubtitle}>
          {milestone?.status === "completed"
            ? nextName
              ? `Keep going to unlock ${nextName}`
              : "You've reached the highest volunteer milestone"
            : remainingHours > 0
              ? `Earn ${formatHoursLabel(remainingHours)} more to unlock ${milestone?.name || "this milestone"}`
              : "Apply hours to start your first milestone"}
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
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  retryButton: {
    marginBottom: 16,
    alignItems: "center",
  },
  retryText: {
    fontSize: 14,
    color: COLORS.red,
  },
  hero: {
    alignItems: "center",
    marginBottom: 35,
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
    alignItems: "center",
    justifyContent: "center",
  },
  badgeImage: {
    width: 140,
    height: 140,
  },
  badgeLevel: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 3,
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
  card: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 12,
    padding: 25,
    marginBottom: 30,
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
  emptyCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.brown,
    textAlign: "center",
    lineHeight: 20,
  },
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
