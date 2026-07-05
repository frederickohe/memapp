import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  CheckCheck,
  CreditCard,
  CalendarDays,
  Award,
  Megaphone,
  Dumbbell,
} from "lucide-react-native";

const COLORS = {
  bg: "#FFFFFF",
  headerBg: "#F4F4F6",
  headerBorder: "#D4D8E0",
  cardBg: "#F4F4F6",
  title: "#192126",
  dark: "#1A1C1D",
  sectionLabel: "#B1B2B4",
  date: "#9CA3AF",
  body: "#6B7280",
  red: "#FF0000",
  pillBorder: "#B1B2B4",
};

const FILTERS = ["All", "New", "Old", "Unread"];

const NOTIFICATIONS = [
  {
    id: "n1",
    section: "Today",
    Icon: CreditCard,
    title: "Membership Renewal",
    date: "9:41 AM",
    body: "Your Gold membership has been renewed successfully for another year.",
    unread: true,
  },
  {
    id: "n2",
    section: "Today",
    Icon: CalendarDays,
    title: "Upcoming Event",
    date: "8:15 AM",
    body: "Community Cleanup Drive starts this Saturday at 8:00 AM. Tap to RSVP.",
    unread: true,
  },
  {
    id: "n3",
    section: "Today",
    Icon: Award,
    title: "Points Earned",
    date: "7:02 AM",
    body: "You earned 250 points for attending the leadership workshop.",
    unread: false,
  },
  {
    id: "n4",
    section: "Today",
    Icon: Megaphone,
    title: "New Announcement",
    date: "6:30 AM",
    body: "The Koforidua branch will host its annual youth conference next month.",
    unread: false,
  },
  {
    id: "n5",
    section: "Yesterday",
    Icon: Dumbbell,
    title: "Class Booking",
    date: "5:20 PM",
    body: "Your spot in the Beginners' strength class (legs & shoulders) is confirmed.",
    unread: false,
  },
];

function NotificationCard({ item }) {
  const Icon = item.Icon;
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      <View style={styles.avatar}>
        <Icon size={20} color="#FFFFFF" strokeWidth={2} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.cardMeta}>
            {item.unread && <View style={styles.unreadDot} />}
            <Text style={styles.cardDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={styles.cardText} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const sections = useMemo(() => {
    const filtered = NOTIFICATIONS.filter((n) => {
      if (activeFilter === "New" || activeFilter === "Unread") return n.unread;
      if (activeFilter === "Old") return !n.unread;
      return true;
    });

    const order = ["Today", "Yesterday"];
    return order
      .map((label) => ({
        label,
        items: filtered.filter((n) => n.section === label),
      }))
      .filter((s) => s.items.length > 0);
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconBox}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <ChevronLeft size={22} color="#636268" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.iconBox} activeOpacity={0.7}>
            <CheckCheck size={20} color="#636268" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={active ? styles.pillTextActive : styles.pillText}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section) => (
          <View key={section.label} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            {section.items.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </View>
        ))}

        {sections.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No notifications here.</Text>
          </View>
        )}
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
    backgroundColor: COLORS.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.headerBorder,
    paddingBottom: 20,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.headerBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.title,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 8,
  },
  pill: {
    flex: 1,
    height: 38,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: {
    backgroundColor: "#000000",
  },
  pillInactive: {
    borderWidth: 1,
    borderColor: COLORS.pillBorder,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  pillTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* Content */
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.sectionLabel,
    textAlign: "center",
    marginBottom: 12,
  },

  /* Card */
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 12,
    marginBottom: 4,
    alignItems: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.red,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
    marginRight: 8,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },
  cardDate: {
    fontSize: 12,
    color: COLORS.date,
  },
  cardText: {
    fontSize: 13,
    color: COLORS.body,
    lineHeight: 20,
  },

  /* Empty */
  empty: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.sectionLabel,
  },
});
