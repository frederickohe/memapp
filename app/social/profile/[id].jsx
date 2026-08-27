import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Flame, Grid3x3, X } from "lucide-react-native";
import { useSocialProfile } from "@/hooks/useSocial";
import { SocialAvatar } from "@/components/social/ReelItem";
import { SocialIcon } from "@/components/SocialIcons";
import { listedSocialChannels } from "@/lib/socialLinks";

const { width } = Dimensions.get("window");
const TILE = (width - 4) / 3;

export default function SocialProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const userId = rawId ? decodeURIComponent(String(rawId)) : null;
  const { profile, posts, isLoading, error } = useSocialProfile(userId);
  const [activePost, setActivePost] = useState(null);

  const channels = useMemo(() => listedSocialChannels(profile), [profile]);
  const primaryChannel = channels[0];

  const openChannel = async (channel) => {
    if (!channel?.url) return;
    try {
      const canOpen = await Linking.canOpenURL(channel.url);
      if (!canOpen) {
        Alert.alert("Cannot open", `Unable to open ${channel.label}.`);
        return;
      }
      await Linking.openURL(channel.url);
    } catch {
      Alert.alert("Cannot open", `Unable to open ${channel.label}.`);
    }
  };

  if (!userId || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#111" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 16 }}>
          <ChevronLeft size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.error}>{error || "Profile not found."}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>@{profile.handle}</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.identity}>
          <SocialAvatar person={profile} size={86} style={styles.avatar} />
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.post_count}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.branch || "—"}</Text>
              <Text style={styles.statLabel}>Branch</Text>
            </View>
          </View>
        </View>

        <View style={styles.bio}>
          <Text style={styles.name}>{profile.name}</Text>
          {profile.occupation ? (
            <Text style={styles.occupation}>{profile.occupation}</Text>
          ) : null}
          {profile.skills?.length ? (
            <Text style={styles.skills}>{profile.skills.slice(0, 6).join(" · ")}</Text>
          ) : null}
          <View style={styles.pointsRow}>
            <Flame size={14} color="#FF7A00" fill="#FF7A00" />
            <Text style={styles.pointsText}>{profile.points} volunteer points</Text>
          </View>
        </View>

        {profile.is_self ? (
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => router.push("/social/compose")}
          >
            <Text style={styles.postBtnText}>Post your impact</Text>
          </TouchableOpacity>
        ) : primaryChannel ? (
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => openChannel(primaryChannel)}
          >
            <Text style={styles.postBtnText}>
              Message on {primaryChannel.label}
            </Text>
          </TouchableOpacity>
        ) : null}

        {!profile.is_self ? (
          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Connect on Social</Text>
            {channels.length === 0 ? (
              <Text style={styles.emptyHandles}>
                {profile.id === "ymca"
                  ? "Official YMCA Ghana posts and programs appear here in the feed."
                  : "This member has not listed any social handles yet."}
              </Text>
            ) : (
              channels.map((item) => (
                <View key={item.id} style={styles.socialRow}>
                  <View style={styles.socialIcon}>
                    <SocialIcon name={item.id} size={22} />
                  </View>
                  <Text style={styles.socialHandle} numberOfLines={1}>
                    {item.handle}
                  </Text>
                  <TouchableOpacity
                    style={styles.messageBtn}
                    activeOpacity={0.85}
                    onPress={() => openChannel(item)}
                  >
                    <Text style={styles.messageBtnText}>Message</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        ) : channels.length > 0 ? (
          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Your social handles</Text>
            {channels.map((item) => (
              <View key={item.id} style={styles.socialRow}>
                <View style={styles.socialIcon}>
                  <SocialIcon name={item.id} size={22} />
                </View>
                <Text style={styles.socialHandle} numberOfLines={1}>
                  {item.handle}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.gridHeader}>
          <Grid3x3 size={18} color="#111" />
        </View>

        {posts.length === 0 ? (
          <Text style={styles.empty}>No posts yet.</Text>
        ) : (
          <View style={styles.grid}>
            {posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                activeOpacity={0.9}
                onPress={() => setActivePost(post)}
              >
                <Image source={{ uri: post.media_url }} style={styles.tile} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={Boolean(activePost)}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePost(null)}
      >
        <View style={styles.lightbox}>
          <TouchableOpacity
            style={styles.lightboxClose}
            onPress={() => setActivePost(null)}
          >
            <X size={22} color="#fff" />
          </TouchableOpacity>
          {activePost ? (
            <>
              <Image
                source={{ uri: activePost.media_url }}
                style={styles.lightboxImage}
                resizeMode="contain"
              />
              {activePost.caption ? (
                <Text style={styles.lightboxCaption}>{activePost.caption}</Text>
              ) : null}
            </>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    padding: 24,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#EEE",
  },
  stats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 12,
  },
  stat: {
    alignItems: "center",
    maxWidth: 80,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  bio: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  occupation: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
  },
  skills: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  pointsText: {
    fontSize: 13,
    color: "#FF7A00",
    fontWeight: "600",
  },
  postBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#111",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  postBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  socialSection: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  emptyHandles: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  socialIcon: {
    width: 36,
    alignItems: "center",
  },
  socialHandle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#111",
  },
  messageBtn: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  messageBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  gridHeader: {
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
    marginTop: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  tile: {
    width: TILE,
    height: TILE,
    backgroundColor: "#EEE",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    paddingVertical: 30,
  },
  lightbox: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  lightboxClose: {
    position: "absolute",
    top: 54,
    right: 16,
    zIndex: 2,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxImage: {
    width: "100%",
    height: "70%",
  },
  lightboxCaption: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    paddingHorizontal: 8,
  },
});
