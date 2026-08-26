import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Search } from "lucide-react-native";
import { useSocialSearch } from "@/hooks/useSocial";
import { avatarUri } from "@/components/social/ReelItem";

export default function SocialSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { results, isLoading } = useSocialSearch(query);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#111" />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Search size={16} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Search members"
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCapitalize="none"
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 24 }} color="#111" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {query.trim() ? "No members match that search." : "Find members by name or branch."}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.8}
              onPress={() => {
                if (!item.id) return;
                router.push(`/social/profile/${item.id}`);
              }}
            >
              <Image source={{ uri: avatarUri(item) }} style={styles.avatar} />
              <View style={styles.meta}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.handle}>
                  @{item.handle}
                  {item.branch ? ` · ${item.branch}` : ""}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEE",
  },
  meta: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  handle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 14,
  },
});
