import React, { useState } from "react";
import {
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
import { scaleFont } from "@/components/scale";


// Export the mock news database so it can be shared with the detail screen
export const mockNews = [
  {
    id: "1",
    title: "YMCA Launches New Youth Basketball League",
    summary: "Register today for the upcoming season! Open to all kids aged 6-16. Join us for a season of teamwork, skills development, and fun.",
    content: "The YMCA is thrilled to announce the launch of our new Youth Basketball League for the 2026 season. Designed for youth of all skill levels from ages 6 to 16, this program focuses on building confidence, teaching fundamental skills, and fostering team spirit.\n\nGames and practices will be held at our main gymnasium starting next month. Our certified coaches are dedicated to creating a positive and inclusive environment where every player can thrive.\n\nRegistration is now officially open online and at our front desk. Early bird pricing is available until the end of this week, so make sure to secure your spot today! We look forward to seeing our community come together for a fantastic season on the court.",
    image: "https://picsum.photos/seed/basketball/800/500",
    category: "Activities",
    date: "June 24, 2026",
    timeAgo: "15 min ago",
    likes: 42,
    comments: 12,
    bookmarks: 8,
  },
  {
    id: "2",
    title: "Community Clean-Up Campaign a Huge Success",
    summary: "Over 200 volunteers joined forces this weekend to clean up and beautify our local community parks and recreational spaces.",
    content: "Our annual Spring Community Clean-Up Campaign exceeded all expectations this year. On Saturday morning, over 200 volunteers—including families, local business owners, and youth groups—gathered at the YMCA center before heading out to work on five key parks in our neighborhood.\n\nTogether, we collected over 150 bags of litter, planted 50 new native trees, and repainted worn-out playground equipment. It was an inspiring display of community cooperation and environmental stewardship.\n\nWe want to extend a massive thank you to everyone who dedicated their Saturday morning to making our neighborhood cleaner, greener, and more beautiful. Check out the photos from the event above!",
    image: "https://picsum.photos/seed/cleanup/800/500",
    category: "Projects",
    date: "June 22, 2026",
    timeAgo: "2 days ago",
    likes: 128,
    comments: 34,
    bookmarks: 25,
  },
  {
    id: "3",
    title: "New Fitness Center Equipment Installed",
    summary: "We've upgraded our gym with state-of-the-art cardio and strength training equipment. Come try them out today!",
    content: "Great news for all fitness enthusiasts! As part of our commitment to providing the best wellness resources for our members, the YMCA has fully upgraded its main fitness center with brand-new, state-of-the-art cardio and strength training equipment.\n\nThe new additions include premium smart treadmills, elliptical trainers with interactive virtual routes, and a complete line of selectorized strength machines. We've also expanded our free weight zone to accommodate more workouts during peak hours.\n\nOur personal trainers will be offering free orientation sessions all week to help you get familiar with the new machines and customize your workout routines. Drop by and elevate your fitness journey today!",
    image: "https://picsum.photos/seed/fitness/800/500",
    category: "Activities",
    date: "June 20, 2026",
    timeAgo: "4 days ago",
    likes: 85,
    comments: 19,
    bookmarks: 14,
  },
];

export default function NewsFeedScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [newsList, setNewsList] = useState(mockNews);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter the list based on filter pill selection
  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === "All") {
      setNewsList(mockNews);
    } else {
      setNewsList(mockNews.filter((item) => item.category === filter));
    }
  };

  // Fake refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const renderNewsItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.newsCard}
        activeOpacity={0.95}
        onPress={() => router.push(`/news/${item.id}`)}
      >
        {/* Card Header & Blurb Text (above image) */}
        <View style={styles.cardHeader}>
          <View style={styles.categoryRow}>
            <View
              style={[
                styles.categoryBadge,
                item.category === "Projects" ? styles.badgeProjects : styles.badgeActivities,
              ]}
            >
              <Text
                style={[
                  styles.categoryBadgeText,
                  item.category === "Projects" ? styles.textProjects : styles.textActivities,
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

        {/* Full-width Image */}
        <Image source={{ uri: item.image }} style={styles.postImage} />

        {/* Stats Row at the bottom */}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Bar */}
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
          onPress={handleRefresh}
          activeOpacity={0.7}
        >
          <RotateCw size={20} color="#111" style={isRefreshing ? styles.rotating : null} />
        </TouchableOpacity>
      </View>

      {/* List Subtitle */}
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitleText}>Updated 15min ago</Text>
      </View>

      {/* Filter Tabs Row */}
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
              onPress={() => handleFilter(filter)}
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

      {/* News FlatList */}
      <FlatList
        data={newsList}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No updates found in this category.</Text>
          </View>
        }
      />
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
    backgroundColor: "#FF3B30", // Highlighted red by default
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
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
  },
});
