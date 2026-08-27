import React, { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Plus, Search } from "lucide-react-native";
import { useSocialFeed } from "@/hooks/useSocial";
import ReelItem, { socialProfileHref } from "@/components/social/ReelItem";

export default function YSocialFeedScreen() {
  const router = useRouter();
  const { items, isLoading, isRefreshing, error, refresh, toggleLike, recordView } =
    useSocialFeed();
  const recordViewRef = useRef(recordView);
  recordViewRef.current = recordView;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    viewableItems.forEach(({ item }) => {
      if (item?.id) recordViewRef.current?.(item.id);
    });
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 55,
    minimumViewTime: 450,
  }).current;

  const openSource = useCallback((item) => {
    if (item.item_type === "NEWS") {
      router.push(`/news/${item.source_id}`);
      return;
    }
    if (item.item_type === "PROGRAM") {
      router.push(`/programs/${item.source_id}`);
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace("/(tabs)");
          }}
        >
          <ChevronLeft size={24} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.brand}>Y Social</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push("/social/search")}
          >
            <Search size={22} color="#262626" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push("/social/compose")}
          >
            <Plus size={24} color="#262626" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#262626" size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh} style={styles.retry}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReelItem
              item={item}
              onLike={toggleLike}
              onOpenProfile={(id) => {
                const href = socialProfileHref(id);
                if (href) router.push(href);
              }}
              onOpenSource={openSource}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={refresh}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.errorText}>No posts yet. Be the first to share.</Text>
            </View>
          }
          contentContainerStyle={items.length === 0 ? styles.emptyList : undefined}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DBDBDB",
  },
  brand: {
    color: "#262626",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
  empty: {
    paddingTop: 80,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  errorText: {
    color: "#262626",
    textAlign: "center",
    fontSize: 15,
  },
  retry: {
    marginTop: 16,
    backgroundColor: "#262626",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
