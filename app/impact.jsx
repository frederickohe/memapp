import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Heart, Award, Users } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

export default function ImpactStoriesScreen() {
  const router = useRouter();

  const impactStats = [
    { label: "Lives Impacted", value: "1,200+", icon: Users, color: "#34C759" },
    { label: "Scholarships", value: "150+", icon: Award, color: "#007AFF" },
    { label: "Donations", value: "$25K+", icon: Heart, color: "#FF3B30" },
  ];

  const stories = [
    {
      id: "1",
      title: "Sarah's Journey: Empowering the Next Generation",
      description: "How the YMCA youth scholarship program provided Sarah with the coaching and mentorship she needed to succeed in school and sport.",
      image: "https://picsum.photos/seed/impact_sarah/600/350",
      date: "June 15, 2026",
      likes: 56,
    },
    {
      id: "2",
      title: "Healthy Aging: Seniors Finding Joy in Water Aerobics",
      description: "For Albert and Martha, the YMCA aquatic center became more than a fitness center—it became a vital place for connection, health, and laughter.",
      image: "https://picsum.photos/seed/impact_seniors/600/350",
      date: "June 10, 2026",
      likes: 84,
    },
    {
      id: "3",
      title: "Green Shoots: Community Gardens Feeding Families",
      description: "Our backyard garden initiative grew over 500 lbs of fresh vegetables this season, all donated directly to local member families in need.",
      image: "https://picsum.photos/seed/impact_garden/600/350",
      date: "June 01, 2026",
      likes: 112,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Impact Stories</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Impact Stats Banner */}
        <Text style={styles.sectionTitle}>Our 2026 Footprint</Text>
        <View style={styles.statsRow}>
          {impactStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <View key={idx} style={styles.statCard}>
                <View style={[styles.iconWrapper, { backgroundColor: stat.color + "15" }]}>
                  <Icon size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Stories List */}
        <Text style={styles.sectionTitle}>Featured Stories</Text>
        {stories.map((story) => (
          <View key={story.id} style={styles.storyCard}>
            <Image source={{ uri: story.image }} style={styles.storyImage} />
            <View style={styles.storyInfo}>
              <Text style={styles.storyDate}>{story.date}</Text>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <Text style={styles.storyDescription}>{story.description}</Text>
              
              <View style={styles.storyFooter}>
                <TouchableOpacity style={styles.likeButton} activeOpacity={0.7}>
                  <Heart size={16} color="#FF3B30" fill="#FF3B30" />
                  <Text style={styles.likeText}>{story.likes} Likes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.readButton} activeOpacity={0.7}>
                  <Text style={styles.readButtonText}>Read Story</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#111",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#EEF0F2",
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "#111",
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "400",
    marginTop: 2,
    textAlign: "center",
  },
  storyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 20,
    overflow: "hidden",
  },
  storyImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#F5F5F7",
  },
  storyInfo: {
    padding: 16,
  },
  storyDate: {
    fontSize: 11,
    color: "#888",
    fontWeight: "400",
    marginBottom: 6,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    lineHeight: 22,
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginBottom: 16,
  },
  storyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F7",
    paddingTop: 12,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: {
    fontSize: 12,
    color: "#FF3B30",
    fontWeight: "400",
    marginLeft: 6,
  },
  readButton: {
    backgroundColor: "#000000",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  readButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "400",
  },
});
