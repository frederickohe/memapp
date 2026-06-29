import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Search, ChevronDown, Flame } from "lucide-react-native";

const FILTERS = ["All", "Active", "Connected"];

const PEOPLE = [
  { id: "p1", name: "Kevin Asare", points: 100, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "p2", name: "Big Jay", points: 80, avatar: "https://randomuser.me/api/portraits/men/85.jpg" },
  { id: "p3", name: "Short Man", points: 88, avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
  { id: "p4", name: "Anna Boakye", points: 4, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: "p5", name: "Stella Botele", points: 200, avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
];

export default function ConnectListScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect</Text>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Search size={18} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <View style={styles.filterLeft}>
          {FILTERS.map((f) => {
            const active = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(f)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text
                  style={[styles.filterText, active && styles.filterTextActive]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.filterDropdown} activeOpacity={0.8}>
          <Text style={styles.filterDropdownText}>Filter</Text>
          <ChevronDown size={14} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.grid}>
          {PEOPLE.map((person) => (
            <TouchableOpacity
              key={person.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/connect-profile",
                  params: {
                    name: person.name,
                    points: String(person.points),
                    avatar: person.avatar,
                  },
                })
              }
            >
              <Image source={{ uri: person.avatar }} style={styles.cardAvatar} />
              <Text style={styles.cardName}>{person.name}</Text>
              <View style={styles.cardPoints}>
                <Flame size={13} color="#FF7A00" fill="#FF7A00" />
                <Text style={styles.cardPointsText}>{person.points}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingVertical: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F4F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  filterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#F4F4F6",
  },
  filterPillActive: {
    backgroundColor: "#FF3B30",
  },
  filterText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterDropdownText: {
    fontSize: 13,
    color: "#111",
    fontWeight: "500",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  cardAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F5F5F7",
  },
  cardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginTop: 12,
  },
  cardPoints: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  cardPointsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF7A00",
  },
});
