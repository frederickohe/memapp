import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  RotateCw,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Share2,
  ChevronDown,
} from "lucide-react-native";
import { useNews } from "@/hooks/useNews";
import { formatTimeAgo } from "@/lib/newsUtils";

export default function NewsFeedScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const { newsList, isLoading, isRefreshing, error, lastUpdated, refresh } =
    useNews(activeFilter);

  const renderNewsItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.newsCard}
        activeOpacity={0.95}
        onPress={() => router.push(`/news/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.categoryRow}>
            <View
              style={[
                styles.categoryBadge,
                item.category === "Projects"
                  ? styles.badgeProjects
                  : styles.badgeActivities,
              ]}
            >
              <Text
                style={[
                  styles.categoryBadgeText,
                  item.category === "Projects"
                    ? styles.textProjects
                    : styles.textActivities,
                ]}
              >
                {item.category}
              </Text>
            </View>
            <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
          </View>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postSummary}>{item.summary}</Text>
        </View>

        <Image source={{ uri: item.image }} style={styles.postImage} />

        <View style={styles.statsRow}>
          <View style={styles.leftStats}>
            <TouchableOpacity style={styles.statButton} activeOpacity={0.7}>
              <ThumbsUp size={16} color="#666" strokeWidth={2} />
              <Text style={styles.statText}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statButton} activeOpacity={0.7}>
              <MessageSquare size={16} color="#666" strokeWidth={2} />
              <Text style={styles.statText}>{item.comments}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightStats}>
            <TouchableOpacity style={styles.actionIconButton} activeOpacity={0.7}>
              <Bookmark size={16} color="#666" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconButton} activeOpacity={0.7}>
              <Share2 size={16} color="#666" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const updatedLabel = lastUpdated
    ? `Updated ${formatTimeAgo(lastUpdated.toISOString())}`
    : "Updated just now";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News&Updates</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refresh}
          activeOpacity={0.7}
        >
          <RotateCw
            size={20}
            color="#111"
            style={isRefreshing ? styles.rotating : null}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.subtitleRow}>
        <Text style={styles.subtitleText}>{updatedLabel}</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {["All", "Projects", "Activities"].map((filter) => (
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
          <TouchableOpacity style={styles.filterDropdownPill} activeOpacity={0.8}>
            <Text style={styles.filterDropdownText}>Filter</Text>
            <ChevronDown size={14} color="#666" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      ) : (
        <FlatList
          data={newsList}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshing={isRefreshing}
          onRefresh={refresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {error || "No updates found in this category."}
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
  refreshButton: {
    padding: 4,
  },
  rotating: {
    transform: [{ rotate: "45deg" }],
  },
  subtitleRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  subtitleText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  filterContainer: {
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 20,
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
  filterDropdownPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    marginRight: 20,
  },
  filterDropdownText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#666",
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  newsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 20,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeProjects: {
    backgroundColor: "#E5F6FF",
  },
  badgeActivities: {
    backgroundColor: "#EAFBF0",
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  textProjects: {
    color: "#007AFF",
  },
  textActivities: {
    color: "#34C759",
  },
  timeAgoText: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    lineHeight: 22,
    marginBottom: 6,
  },
  postSummary: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  postImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F0F0F0",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F7",
  },
  leftStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    paddingVertical: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400",
    marginLeft: 6,
  },
  rightStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIconButton: {
    padding: 6,
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
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
