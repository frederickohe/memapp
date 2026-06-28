import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MoreVertical,
  Flame,
  CalendarCheck,
  Medal,
  Lock,
  DollarSign,
} from "lucide-react-native";

const COLORS = {
  bg: "#FFFFFF",
  textDark: "#111827",
  textGray: "#6B7280",
  red: "#FF0000",
  redBorder: "#EF4444",
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

function MilestoneBadge({ tierColor, label, locked }) {
  return (
    <View style={styles.badgeItem}>
      <View
        style={[
          styles.badgeCircle,
          locked && styles.badgeCircleLocked,
        ]}
      >
        {locked ? (
          <View style={styles.lockedInner}>
            <Lock size={20} color={COLORS.textDark} strokeWidth={2} />
          </View>
        ) : (
          <Medal size={40} color={tierColor} strokeWidth={1.75} />
        )}
      </View>
      <Text style={[styles.badgeLabel, locked && styles.badgeLabelLocked]}>
        {label}
      </Text>
    </View>
  );
}

function DuesBadge({ label, locked, active }) {
  return (
    <View style={styles.duesItem}>
      <View
        style={[
          styles.duesSquare,
          active && styles.duesSquareActive,
          locked && styles.duesSquareLocked,
        ]}
      >
        {locked ? (
          <View style={styles.lockedInner}>
            <Lock size={20} color={COLORS.textDark} strokeWidth={2} />
          </View>
        ) : (
          <DollarSign size={36} color={COLORS.green} strokeWidth={2} />
        )}
      </View>
      <Text style={[styles.badgeLabel, locked && styles.badgeLabelLocked]}>
        {label}
      </Text>
    </View>
  );
}

export default function AchievementsScreen() {
  const progress = 0.83;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Header - Top App Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <MoreVertical size={20} color={COLORS.textDark} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Rank Section */}
        <View style={styles.rankSection}>
          <View style={styles.ringWrapper}>
            <View style={styles.ringTrack} />
            <View
              style={[
                styles.ringProgress,
                { transform: [{ rotate: "45deg" }] },
              ]}
            />
            <View style={styles.ringCenter}>
              <Text style={styles.rankLabel}>RANK</Text>
              <Text style={styles.rankNumber}>#3</Text>
              <Text style={styles.rankSub}>of 156</Text>
            </View>
          </View>

          <View style={styles.rankInfo}>
            <Text style={styles.rankTitle}>Gold Member</Text>
            <Text style={styles.rankCaption}>1,250 points earned</Text>
          </View>
        </View>

        {/* Section - Stats Cards Bento */}
        <View style={styles.bentoRow}>
          <StatCard
            icon={<Flame size={26} color={COLORS.red} strokeWidth={2} />}
            label="Hours Volunteered"
            value="120"
          />
          <StatCard
            icon={<CalendarCheck size={26} color={COLORS.green} strokeWidth={2} />}
            label="Events Attended"
            value="18"
            active
          />
        </View>

        {/* Section - Volunteering Milestones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Volunteering Milestones</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.badgeGrid}>
            <MilestoneBadge tierColor="#CD7F32" label="First Step" />
            <MilestoneBadge tierColor="#9CA3AF" label="Helper" />
            <MilestoneBadge tierColor="#F59E0B" label="Champion" />
            <MilestoneBadge label="Leader" locked />
            <MilestoneBadge label="Legend" locked />
          </View>
        </View>

        {/* Section - Financial Contributions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Financial Contributions</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.duesRow}>
            <DuesBadge label="Dues Master" active />
            <DuesBadge label="Patron" locked />
            <DuesBadge label="Benefactor" locked />
          </View>
        </View>

        {/* Section - Progress Tracking */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Next Rank Progress</Text>
            <View style={styles.progressPill}>
              <Text style={styles.progressPillText}>83%</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.progressFooterText}>1,250 points</Text>
            <Text style={styles.progressFooterText}>250 to go</Text>
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

  /* Header */
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

  /* Rank Section */
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
  ringTrack: {
    position: "absolute",
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 12,
    borderColor: COLORS.track,
  },
  ringProgress: {
    position: "absolute",
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 12,
    borderColor: "transparent",
    borderTopColor: COLORS.red,
    borderRightColor: COLORS.red,
    borderLeftColor: COLORS.red,
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

  /* Stats Bento */
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

  /* Sections */
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
  viewAll: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.red,
  },

  /* Milestone badge grid */
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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

  /* Financial dues */
  duesRow: {
    flexDirection: "row",
    gap: 16,
  },
  duesItem: {
    flex: 1,
    alignItems: "center",
  },
  duesSquare: {
    width: "100%",
    height: 106,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  duesSquareActive: {
    borderWidth: 2,
    borderColor: COLORS.redBorder,
  },
  duesSquareLocked: {
    backgroundColor: COLORS.bg,
  },

  /* Progress Tracking */
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
