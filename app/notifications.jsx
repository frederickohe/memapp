import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, CheckCheck } from "lucide-react-native";
import { useNotifications } from "@/hooks/useNotifications";

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

function NotificationCard({ item, onPress }) {
  const Icon = item.Icon;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
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
  const {
    sections,
    isLoading,
    isRefreshing,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
  } = useNotifications(activeFilter);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

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
          <TouchableOpacity
            style={styles.iconBox}
            activeOpacity={0.7}
            onPress={markAllAsRead}
          >
            <CheckCheck size={20} color="#636268" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const active = filter === activeFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={active ? styles.pillTextActive : styles.pillText}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1D3108" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
          }
        >
          {error ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{error}</Text>
              <TouchableOpacity onPress={refresh} style={styles.retryButton}>
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!error &&
            sections.map((section) => (
              <View key={section.label} style={styles.section}>
                <Text style={styles.sectionLabel}>{section.label}</Text>
                {section.items.map((item) => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    onPress={() => {
                      if (item.unread) {
                        markAsRead(item.id);
                      }
                    }}
                  />
                ))}
              </View>
            ))}

          {!error && sections.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No notifications here.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
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
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
  empty: {
    paddingTop: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.sectionLabel,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#000",
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
  },
});
