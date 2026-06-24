import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Search, Calendar, MapPin, Users } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

export default function ProgramsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Sports", "Aquatics", "Fitness", "Youth"];

  const programs = [
    {
      id: "p1",
      title: "Youth Basketball League",
      category: "Sports",
      age: "6 - 16 Years",
      schedule: "Saturdays, 9:00 AM - 12:00 PM",
      location: "Main Gym Court A",
      image: "https://picsum.photos/seed/prog_bball/600/300",
      fee: "$75 / Season",
    },
    {
      id: "p2",
      title: "Adult Swim Lessons (Beginner)",
      category: "Aquatics",
      age: "18+ Years",
      schedule: "Mon & Wed, 7:00 PM - 8:00 PM",
      location: "Indoor Lap Pool",
      image: "https://picsum.photos/seed/prog_swim/600/300",
      fee: "$90 / 8 Sessions",
    },
    {
      id: "p3",
      title: "Mindfulness Yoga & Meditation",
      category: "Fitness",
      age: "All Ages",
      schedule: "Tuesdays, 6:00 PM - 7:00 PM",
      location: "Studio 2B (Upper Level)",
      image: "https://picsum.photos/seed/prog_yoga/600/300",
      fee: "Free (Members)",
    },
    {
      id: "p4",
      title: "Summer Outdoor Camp 2026",
      category: "Youth",
      age: "8 - 14 Years",
      schedule: "Mon - Fri, 8:00 AM - 4:00 PM",
      location: "YMCA Nature Park",
      image: "https://picsum.photos/seed/prog_camp/600/300",
      fee: "$180 / Week",
    },
  ];

  const handleRegister = (title) => {
    Alert.alert(
      "Confirm Registration",
      `Would you like to register for the "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: () => Alert.alert("Success 🎉", `You are now registered for the "${title}"! Check your email for confirmation and schedules.`) 
        }
      ]
    );
  };

  // Filter programs based on category and search query
  const filteredPrograms = programs.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <Text style={styles.headerTitle}>Programs & Activities</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Search size={18} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search programs or activities..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories Tab Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                activeCategory === category && styles.categoryTabActive,
              ]}
              onPress={() => setActiveCategory(category)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  activeCategory === category && styles.categoryTabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Programs Listing */}
        <Text style={styles.sectionTitle}>
          Available Programs ({filteredPrograms.length})
        </Text>

        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((item) => (
            <View key={item.id} style={styles.programCard}>
              <Image source={{ uri: item.image }} style={styles.programImage} />
              <View style={styles.programInfo}>
                <View style={styles.categoryRow}>
                  <Text style={styles.programCategory}>{item.category.toUpperCase()}</Text>
                  <Text style={styles.programFee}>{item.fee}</Text>
                </View>
                <Text style={styles.programTitle}>{item.title}</Text>
                
                <View style={styles.detailRow}>
                  <Users size={14} color="#666" style={{ marginRight: 6 }} />
                  <Text style={styles.detailText}>Age: {item.age}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Calendar size={14} color="#666" style={{ marginRight: 6 }} />
                  <Text style={styles.detailText}>{item.schedule}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={14} color="#666" style={{ marginRight: 6 }} />
                  <Text style={styles.detailText}>{item.location}</Text>
                </View>

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => handleRegister(item.title)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.registerButtonText}>Register Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No programs match your search.</Text>
          </View>
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    padding: 0,
  },
  categoriesScroll: {
    paddingBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    marginRight: 10,
  },
  categoryTabActive: {
    backgroundColor: "#FF3B30",
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#666",
  },
  categoryTabTextActive: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#111",
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  programCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 20,
    overflow: "hidden",
  },
  programImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#F5F5F7",
  },
  programInfo: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  programCategory: {
    fontSize: 10,
    fontWeight: "400",
    color: "#FF3B30",
    letterSpacing: 0.5,
  },
  programFee: {
    fontSize: 12,
    fontWeight: "500",
    color: "#34C759",
  },
  programTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400",
  },
  registerButton: {
    backgroundColor: "#000000",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 14,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "400",
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
