import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Search,
  Calendar,
  MapPin,
  Users,
} from "lucide-react-native";
import { usePrograms } from "@/hooks/usePrograms";
import { useUpcomingEvents } from "@/hooks/useNews";
import FeedCard, { feedCardStyles } from "@/components/FeedCard";

export default function ProgramsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { programs, categories, isLoading, isRefreshing, error, refresh } =
    usePrograms();
  const { events } = useUpcomingEvents(20);

  const filters = useMemo(
    () => ["All", ...categories, "Events"],
    [categories]
  );

  const feedItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (activeFilter === "Events") {
      return events.filter((item) => {
        if (!query) return true;
        return (
          item.title.toLowerCase().includes(query) ||
          (item.summary || "").toLowerCase().includes(query)
        );
      });
    }

    return programs.filter((item) => {
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        (item.category || "").toLowerCase().includes(query) ||
        (item.summary || "").toLowerCase().includes(query)
      );
    });
  }, [activeFilter, events, programs, searchQuery]);

  const openItem = (item) => {
    if (activeFilter === "Events") {
      router.push(`/news/${item.id}`);
      return;
    }
    router.push(`/programs/${item.id}`);
  };

  const renderItem = ({ item }) => {
    const isEvent = activeFilter === "Events";
    return (
      <FeedCard
        image={item.image}
        category={isEvent ? item.category || "Events" : item.category}
        timeLabel={isEvent ? item.timeAgo : item.dateRange || item.timeAgo}
        title={item.title}
        summary={item.summary}
        onPress={() => openItem(item)}
        footer={
          <>
            <View style={feedCardStyles.footerLeft}>
              {item.location || item.eventLocation ? (
                <View style={feedCardStyles.statButton}>
                  <MapPin size={16} color="#666" strokeWidth={2} />
                  <Text style={feedCardStyles.statText} numberOfLines={1}>
                    {item.location || item.eventLocation}
                  </Text>
                </View>
              ) : (
                <View style={feedCardStyles.statButton}>
                  <Calendar size={16} color="#666" strokeWidth={2} />
                  <Text style={feedCardStyles.statText}>
                    {item.dateRange || item.date || "See details"}
                  </Text>
                </View>
              )}
            </View>
            <View style={feedCardStyles.footerRight}>
              {!isEvent ? (
                <View style={feedCardStyles.statButton}>
                  <Users size={16} color="#666" strokeWidth={2} />
                  <Text style={feedCardStyles.statText}>
                    {item.participantCount ?? 0}
                  </Text>
                </View>
              ) : null}
            </View>
          </>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Programs & Activities</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Search size={18} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search programs or events..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                activeFilter === filter && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === filter && styles.filterPillTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading && activeFilter !== "Events" ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      ) : (
        <FlatList
          data={feedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={feedCardStyles.separator} />}
          refreshing={isRefreshing}
          onRefresh={refresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {error ||
                  (activeFilter === "Events"
                    ? "No upcoming events right now."
                    : "No programs match your search.")}
              </Text>
              {error ? (
                <TouchableOpacity onPress={refresh} style={styles.retryButton}>
                  <Text style={styles.retryText}>Try again</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
        />
      )}
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
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    padding: 0,
  },
  filterContainer: {
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    marginRight: 10,
  },
  filterPillActive: {
    backgroundColor: "#FF3B30",
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#666",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 24,
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
});
