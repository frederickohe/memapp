import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, MapPin } from "lucide-react-native";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useProminentProfiles } from "@/hooks/useProminentProfiles";

const DARK = "#1D3108";
const FILTERS = ["All", "Ghana", "World"];

export default function ProminentProfilesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const { profiles, isLoading, isRefreshing, error, refresh } = useProminentProfiles(50);

  const filtered = useMemo(() => {
    if (activeFilter === "Ghana") {
      return profiles.filter((item) => item.category === "GHANA");
    }
    if (activeFilter === "World") {
      return profiles.filter((item) => item.category === "WORLD");
    }
    return profiles;
  }, [activeFilter, profiles]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prominent Profiles</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        <Text style={styles.intro}>
          People in Ghana and around the world whose lives are tied to the YMCA
          movement.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((filter) => {
            const active = filter === activeFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF3B30" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              {error || "No prominent profiles published yet."}
            </Text>
            {error ? (
              <TouchableOpacity onPress={refresh} style={styles.retryButton}>
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          filtered.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push(`/profiles/${profile.id}`)}
            >
              <ProfileAvatar
                name={profile.fullName}
                photoUrl={profile.photoUrl}
                size={64}
              />
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{profile.fullName}</Text>
                <Text style={styles.cardHeadline} numberOfLines={2}>
                  {profile.headline}
                </Text>
                {profile.country ? (
                  <View style={styles.metaRow}>
                    <MapPin size={12} color="#6B7280" />
                    <Text style={styles.metaText}>
                      {profile.country}
                      {profile.era ? ` · ${profile.era}` : ""}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    paddingTop: 16,
    paddingBottom: 30,
  },
  intro: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
    marginBottom: 16,
  },
  filters: {
    gap: 8,
    paddingBottom: 18,
  },
  filterChip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: DARK,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
    color: DARK,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#F7F8FC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
    color: DARK,
    marginBottom: 2,
  },
  cardHeadline: {
    fontSize: 13,
    lineHeight: 18,
    color: "#4B5563",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
