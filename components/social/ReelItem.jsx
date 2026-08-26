import { Dimensions, Image, Pressable, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react-native";
import * as Haptics from "expo-haptics";

const YMCA_LOGO = require("@/assets/images/auth/ymca-africa-alliance.png");
const { width: SCREEN_W } = Dimensions.get("window");
const MEDIA_H = Math.round(SCREEN_W * 1.05);

export function avatarUri(author) {
  if (author?.avatar) return author.avatar;
  const name = encodeURIComponent(author?.name || "Member");
  return `https://ui-avatars.com/api/?name=${name}&background=111111&color=ffffff&size=128`;
}

export default function ReelItem({ item, onLike, onOpenProfile, onOpenSource }) {
  const author = item.author || {};
  const isOrg = Boolean(author.is_org);

  const handleLike = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      /* native optional */
    }
    onLike?.(item.id);
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
    const userId = author?.id;
    if (!userId || userId === "ymca") return;
    onOpenProfile?.(userId);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable
          style={styles.authorRow}
          onPress={openAuthor}
          hitSlop={8}
        >
          {isOrg ? (
            <Image source={YMCA_LOGO} style={styles.avatar} pointerEvents="none" />
          ) : (
            <Image
              source={{ uri: avatarUri(author) }}
              style={styles.avatar}
              pointerEvents="none"
            />
          )}
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
        </Pressable>
        <TouchableOpacity onPress={() => onOpenSource?.(item)} hitSlop={10}>
          <MoreHorizontal size={22} color="#262626" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.98} onPress={() => onOpenSource?.(item)}>
        <Image source={{ uri: item.media_url }} style={styles.media} resizeMode="cover" />
      </TouchableOpacity>

      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity onPress={handleLike} activeOpacity={0.8} hitSlop={8}>
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
        <Text style={styles.likes}>
          {item.likes === 1 ? "1 like" : `${item.likes || 0} likes`}
        </Text>
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
    zIndex: 2,
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
  likes: {
    fontSize: 14,
    fontWeight: "700",
    color: "#262626",
    marginBottom: 4,
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
