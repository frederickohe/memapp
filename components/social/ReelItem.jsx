import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { pickDefaultAvatar } from "@/lib/defaultAvatars";
import { formatLikesLabel, formatViewsLabel } from "@/lib/socialStats";

const YMCA_LOGO = require("@/assets/images/auth/ymca-africa-alliance.png");
const { width: SCREEN_W } = Dimensions.get("window");
const MEDIA_H = Math.round(SCREEN_W * 1.05);

export function avatarUri(author) {
  const raw = typeof author?.avatar === "string" ? author.avatar.trim() : "";
  if (raw && /^(https?:|file:|data:)/i.test(raw)) return raw;
  return null;
}

export function SocialAvatar({ person = {}, size = 36, style }) {
  const isOrg = Boolean(person?.is_org || person?.id === "ymca");
  const [failed, setFailed] = useState(false);
  const uri = avatarUri(person);

  useEffect(() => {
    setFailed(false);
  }, [uri]);
  const dimension = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: "hidden",
    backgroundColor: "#EFEFEF",
  };

  if (isOrg) {
    return (
      <Image
        source={YMCA_LOGO}
        style={[dimension, style]}
        resizeMode="cover"
        pointerEvents="none"
      />
    );
  }

  if (uri && !failed) {
    return (
      <Image
        source={{ uri }}
        style={[dimension, style]}
        resizeMode="cover"
        pointerEvents="none"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      source={pickDefaultAvatar(person)}
      style={[dimension, style]}
      resizeMode="cover"
      pointerEvents="none"
    />
  );
}

export function socialProfileHref(userId) {
  if (!userId) return null;
  return {
    pathname: "/social/profile/[id]",
    params: { id: String(userId) },
  };
}

export default function ReelItem({ item, onLike, onOpenProfile, onOpenSource }) {
  const author = item.author || {};
  const profileHref = socialProfileHref(author.id);
  const tapTimer = useRef(null);
  const [heartBurst, setHeartBurst] = useState(false);

  useEffect(() => {
    return () => {
      if (tapTimer.current) clearTimeout(tapTimer.current);
    };
  }, []);

  const pulseHeart = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 700);
  };

  const handleLike = async ({ fromDoubleTap = false } = {}) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      /* native optional */
    }
    if (fromDoubleTap) pulseHeart();
    if (fromDoubleTap && item.liked) return;
    onLike?.(item.id);
  };

  const handleMediaPress = () => {
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      handleLike({ fromDoubleTap: true });
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapTimer.current = null;
      onOpenSource?.(item);
    }, 280);
  };

  const handleShare = async () => {
    const label = item.title || item.caption || "Y Social";
    try {
      await Share.share({
        title: label,
        message: `${label}\n\nShared from Y Social in the YMCA Member App.`,
      });
    } catch {
      /* ignore */
    }
  };

  const openAuthor = () => {
    if (profileHref) onOpenProfile?.(author.id);
  };

  const authorIdentity = (
    <>
      <SocialAvatar person={author} size={36} style={styles.avatar} />
      <View style={styles.authorMeta} pointerEvents="none">
        <Text style={styles.handle}>@{author.handle || "ymcaghana"}</Text>
        {item.category ? (
          <Text style={styles.location} numberOfLines={1}>
            {item.category}
            {author.branch ? ` · ${author.branch}` : ""}
          </Text>
        ) : author.branch ? (
          <Text style={styles.location} numberOfLines={1}>
            {author.branch}
          </Text>
        ) : null}
      </View>
    </>
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {profileHref ? (
          <Link href={profileHref} asChild>
            <TouchableOpacity
              style={styles.authorRow}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityLabel={`Open @${author.handle || "member"} profile`}
            >
              {authorIdentity}
            </TouchableOpacity>
          </Link>
        ) : (
          <View style={styles.authorRow}>{authorIdentity}</View>
        )}
        <TouchableOpacity onPress={() => onOpenSource?.(item)} hitSlop={10}>
          <MoreHorizontal size={22} color="#262626" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.98} onPress={handleMediaPress}>
        <View>
          <Image source={{ uri: item.media_url }} style={styles.media} resizeMode="cover" />
          {heartBurst ? (
            <View style={styles.heartBurst} pointerEvents="none">
              <Heart size={88} color="#fff" fill="#ED4956" />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity onPress={() => handleLike()} activeOpacity={0.8} hitSlop={8}>
            <Heart
              size={26}
              color={item.liked ? "#ED4956" : "#262626"}
              fill={item.liked ? "#ED4956" : "transparent"}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onOpenSource?.(item)} activeOpacity={0.8} hitSlop={8}>
            <MessageCircle size={26} color="#262626" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} activeOpacity={0.8} hitSlop={8}>
            <Send size={24} color="#262626" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        {item.item_type !== "POST" ? (
          <TouchableOpacity onPress={() => onOpenSource?.(item)} activeOpacity={0.8} hitSlop={8}>
            <Bookmark size={24} color="#262626" strokeWidth={2} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.statsRow}>
          <Text style={styles.likes}>{formatLikesLabel(item.likes)}</Text>
          <Text style={styles.statDot}>·</Text>
          <Text style={styles.views}>{formatViewsLabel(item.views)}</Text>
        </View>
        {item.title ? (
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        ) : null}
        {item.caption ? (
          <Text style={styles.caption} numberOfLines={3}>
            <Text style={styles.captionHandle} onPress={openAuthor}>
              @{author.handle || "ymcaghana"}{" "}
            </Text>
            {item.caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DBDBDB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFEFEF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#DBDBDB",
  },
  authorMeta: {
    marginLeft: 10,
    flex: 1,
  },
  handle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#262626",
  },
  location: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 1,
  },
  media: {
    width: SCREEN_W,
    height: MEDIA_H,
    backgroundColor: "#F2F2F2",
  },
  heartBurst: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  actionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  likes: {
    fontSize: 14,
    fontWeight: "700",
    color: "#262626",
  },
  views: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E8E",
  },
  statDot: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8E8E8E",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
    lineHeight: 20,
    marginBottom: 2,
  },
  caption: {
    fontSize: 14,
    color: "#262626",
    lineHeight: 20,
  },
  captionHandle: {
    fontWeight: "700",
  },
});
