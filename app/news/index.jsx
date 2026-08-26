import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import FeedCard, { feedCardStyles } from "@/components/FeedCard";

const NEWS_FILTERS = ["All", "Projects", "Activities"];

export default function NewsFeedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rawFilter = Array.isArray(params.filter) ? params.filter[0] : params.filter;
  const initialFilter = NEWS_FILTERS.includes(rawFilter) ? rawFilter : "All";
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const { newsList, isLoading, isRefreshing, error, lastUpdated, refresh } =
    useNews(activeFilter);

  const renderNewsItem = ({ item }) => {
    return (
      <FeedCard
        image={item.image}
        category={item.category}
        timeLabel={item.timeAgo}
        title={item.title}
        summary={item.summary}
        onPress={() => router.push(`/news/${item.id}`)}
        footer={
          <>
            <View style={feedCardStyles.footerLeft}>
              <TouchableOpacity style={feedCardStyles.statButton} activeOpacity={0.7}>
                <ThumbsUp size={16} color="#666" strokeWidth={2} />
                <Text style={feedCardStyles.statText}>{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={feedCardStyles.statButton} activeOpacity={0.7}>
                <MessageSquare size={16} color="#666" strokeWidth={2} />
                <Text style={feedCardStyles.statText}>{item.comments}</Text>
              </TouchableOpacity>
            </View>
            <View style={feedCardStyles.footerRight}>
              <TouchableOpacity
                style={feedCardStyles.actionIconButton}
                activeOpacity={0.7}
              >
                <Bookmark size={16} color="#666" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                style={feedCardStyles.actionIconButton}
                activeOpacity={0.7}
              >
                <Share2 size={16} color="#666" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </>
        }
      />
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
          {NEWS_FILTERS.map((filter) => (
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
          ItemSeparatorComponent={() => <View style={feedCardStyles.separator} />}
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
    paddingBottom: 30,
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
