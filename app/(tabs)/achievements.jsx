import React, { useEffect } from "react";
import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import Reanimated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import {
  MoreVertical,
  Flame,
  CalendarCheck,
  Lock,
  Award,
} from "lucide-react-native";
import { useVolunteerImpact } from "@/hooks/useVolunteerImpact";
import {
  buildVolunteerImpact,
  formatCount,
  milestoneImageSource,
} from "@/lib/volunteerUtils";

const RANK_RING_SIZE = 192;
const RANK_RING_STROKE = 12;
const RANK_RING_R = (RANK_RING_SIZE - RANK_RING_STROKE) / 2;
const RANK_RING_C = 2 * Math.PI * RANK_RING_R;

const AnimatedCircle = Reanimated.createAnimatedComponent(Circle);

const COLORS = {
  bg: "#FFFFFF",
  textDark: "#111827",
  textGray: "#6B7280",
  red: "#FF0000",
  border: "#E5E7EB",
  track: "#F3F4F6",
  green: "#16A34A",
};

function StatCard({ icon, label, value, active }) {
  return (
    <View style={[styles.statCard, active && styles.statCardActive]}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function MilestoneBadge({ image, label, locked, completed, onPress }) {
  const content = (
    <>
      <View
        style={[
          styles.badgeCircle,
          locked && styles.badgeCircleLocked,
          completed && styles.badgeCircleCompleted,
        ]}
      >
        {locked && !image ? (
          <View style={styles.lockedInner}>
            <Lock size={20} color={COLORS.textDark} strokeWidth={2} />
          </View>
        ) : image ? (
          <Image
            source={image}
            style={[styles.badgeImage, locked && styles.badgeImageLocked]}
            resizeMode="contain"
          />
        ) : (
          <Award
            size={36}
            color={completed ? COLORS.green : COLORS.textGray}
            strokeWidth={2}
          />
        )}
      </View>
      <Text style={[styles.badgeLabel, locked && styles.badgeLabelLocked]}>
        {label}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.badgeItem} activeOpacity={0.8} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.badgeItem}>{content}</View>;
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { impact, isLoading, isRefreshing, refresh } = useVolunteerImpact();

  const progress = impact?.next_rank_progress ?? 0;
  const points = impact?.volunteer_points ?? 0;
  const pointsToNext = impact?.points_to_next ?? 0;
  const nextTitle = impact?.next_rank_title;
  const milestones =
    impact?.milestones?.length > 0
      ? impact.milestones
      : buildVolunteerImpact().milestones;

  const ringProgress = useSharedValue(0);
  useEffect(() => {
    ringProgress.value = withDelay(
      200,
      withTiming(progress, {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [progress, ringProgress]);

  const rankRingProps = useAnimatedProps(() => ({
    strokeDashoffset: RANK_RING_C * (1 - ringProgress.value),
  }));

  const openMilestone = (milestone) => {
    router.push({
      pathname: "/volunteer",
      params: { id: milestone.id },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <MoreVertical size={20} color={COLORS.textDark} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing || isLoading} onRefresh={refresh} />
        }
      >
          <View style={styles.rankSection}>
            <View style={styles.ringWrapper}>
              <Svg
                width={RANK_RING_SIZE}
                height={RANK_RING_SIZE}
                style={StyleSheet.absoluteFill}
              >
                <Circle
                  cx={RANK_RING_SIZE / 2}
                  cy={RANK_RING_SIZE / 2}
                  r={RANK_RING_R}
                  stroke={COLORS.track}
                  strokeWidth={RANK_RING_STROKE}
                  fill="none"
                />
                <AnimatedCircle
                  cx={RANK_RING_SIZE / 2}
                  cy={RANK_RING_SIZE / 2}
                  r={RANK_RING_R}
                  stroke={COLORS.red}
                  strokeWidth={RANK_RING_STROKE}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={RANK_RING_C}
                  animatedProps={rankRingProps}
                  originX={RANK_RING_SIZE / 2}
                  originY={RANK_RING_SIZE / 2}
                  rotation={-90}
                />
              </Svg>
              <View style={styles.ringCenter}>
                <Text style={styles.rankLabel}>RANK</Text>
                <Text style={styles.rankNumber}>
                  #{impact?.community_rank || 0}
                </Text>
                <Text style={styles.rankSub}>
                  of {formatCount(impact?.total_members || 0)}
                </Text>
              </View>
            </View>

            <View style={styles.rankInfo}>
              <Text style={styles.rankTitle}>{impact?.rank_title || "Member"}</Text>
              <Text style={styles.rankCaption}>
                {formatCount(points)} points earned
              </Text>
            </View>
          </View>

          <View style={styles.bentoRow}>
            <StatCard
              icon={<Flame size={26} color={COLORS.red} strokeWidth={2} />}
              label="Hours Volunteered"
              value={formatCount(impact?.hours_volunteered || 0)}
            />
            <StatCard
              icon={<CalendarCheck size={26} color={COLORS.green} strokeWidth={2} />}
              label="Events Attended"
              value={formatCount(impact?.events_attended || 0)}
              active
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Volunteering Milestones</Text>
            </View>

            <View style={styles.badgeGrid}>
              {milestones.map((milestone) => {
                const completed = milestone.status === "completed";
                const locked = milestone.status === "locked";
                return (
                  <MilestoneBadge
                    key={milestone.id}
                    image={milestoneImageSource(milestone.image_key)}
                    label={milestone.name}
                    locked={locked}
                    completed={completed}
                    onPress={() => openMilestone(milestone)}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Next Rank Progress</Text>
              <View style={styles.progressPill}>
                <Text style={styles.progressPillText}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>

            <View style={styles.progressFooter}>
              <Text style={styles.progressFooterText}>
                {formatCount(points)} points
              </Text>
              <Text style={styles.progressFooterText}>
                {nextTitle
                  ? `${formatCount(pointsToNext)} to ${nextTitle}`
                  : "All milestones unlocked"}
              </Text>
            </View>
          </View>
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
    height: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.track,
    backgroundColor: COLORS.bg,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  headerButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  rankSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  ringWrapper: {
    width: 192,
    height: 192,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  rankLabel: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 1,
    color: COLORS.textGray,
  },
  rankNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: COLORS.textDark,
    marginVertical: 2,
  },
  rankSub: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  rankInfo: {
    alignItems: "center",
    marginTop: 16,
  },
  rankTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  rankCaption: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  bentoRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 21,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  statCardActive: {
    borderColor: COLORS.border,
  },
  statIcon: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textGray,
    textAlign: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  section: {
    marginBottom: 40,
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
    color: COLORS.textDark,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
    rowGap: 16,
  },
  badgeItem: {
    width: 106,
    alignItems: "center",
  },
  badgeCircle: {
    width: 106,
    height: 106,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeCircleLocked: {
    backgroundColor: COLORS.bg,
  },
  badgeCircleCompleted: {
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  badgeImage: {
    width: 78,
    height: 78,
  },
  badgeImageLocked: {
    opacity: 0.45,
  },
  lockedInner: {
    opacity: 0.5,
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
    textAlign: "center",
  },
  badgeLabelLocked: {
    color: COLORS.textGray,
  },
  progressCard: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    flex: 1,
  },
  progressPill: {
    backgroundColor: COLORS.red,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  progressPillText: {
    color: COLORS.bg,
    fontSize: 13,
    fontWeight: "600",
  },
  progressTrack: {
    height: 12,
    borderRadius: 9999,
    backgroundColor: COLORS.track,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: COLORS.red,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressFooterText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
});
