import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OnboardingButton } from "@/components/OnboardingFormComponents";

const COLORS = {
  bg: "#E9E7FF",
  text: "#1F1F1F",
  muted: "#4B5563",
  accent: "#4339CC",
  statusBg: "rgba(46, 211, 183, 0.4)",
  statusText: "#1B9984",
};

const SUCCESS_ICON = require("@/assets/images/volunteer/submission-success.png");

function TicketSummary({ label, value, status }) {
  return (
    <View style={styles.ticketCard}>
      <View style={[styles.ticketNotch, styles.ticketNotchLeft]} />
      <View style={[styles.ticketNotch, styles.ticketNotchRight]} />

      <View style={styles.ticketContent}>
        <View style={styles.ticketLeft}>
          <Text style={styles.ticketLabel}>{label}</Text>
          <Text style={styles.ticketValue} numberOfLines={1}>
            {value}
          </Text>
        </View>

        <View style={styles.ticketRight}>
          <Text style={styles.ticketLabel}>Status</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ApplyVolunteerHoursSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const hours = Array.isArray(params.hours) ? params.hours[0] : params.hours;
  const activity = Array.isArray(params.activity)
    ? params.activity[0]
    : params.activity;

  const hoursLabel = hours ? `${hours} hrs` : "—";
  const activityLabel = activity?.trim() || "Volunteer activity";

  const handleBackHome = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.glowTop} />

      <View style={styles.content}>
        <View style={styles.heroWrap}>
          <View style={styles.blobOuter} />
          <View style={styles.blobInner} />
          <Image source={SUCCESS_ICON} style={styles.heroIcon} resizeMode="contain" />
        </View>

        <Text style={styles.mainMessage}>Submission Successful!</Text>

        <Text style={styles.title}>Hours submitted</Text>
        <Text style={styles.subtitle}>
          Your volunteer contribution is being reviewed.
        </Text>

        <TicketSummary
          label="Activity"
          value={activityLabel}
          status="Pending"
        />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Hours logged</Text>
          <Text style={styles.summaryValue}>{hoursLabel}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <OnboardingButton label="Back Home" onPress={handleBackHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  glowTop: {
    position: "absolute",
    top: 220,
    left: -40,
    right: -40,
    height: 250,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    opacity: 0.55,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: "center",
  },
  heroWrap: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  blobOuter: {
    position: "absolute",
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: "rgba(67, 57, 204, 0.08)",
  },
  blobInner: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(67, 57, 204, 0.04)",
  },
  heroIcon: {
    width: 240,
    height: 240,
  },
  mainMessage: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  ticketCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    overflow: "visible",
    marginBottom: 16,
  },
  ticketNotch: {
    position: "absolute",
    top: "50%",
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
  },
  ticketNotchLeft: {
    left: -12,
  },
  ticketNotchRight: {
    right: -12,
  },
  ticketContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  ticketLeft: {
    flex: 1,
    gap: 4,
  },
  ticketRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  ticketLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },
  ticketValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  statusPill: {
    backgroundColor: COLORS.statusBg,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.statusText,
  },
  summaryRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.muted,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 10,
  },
});
