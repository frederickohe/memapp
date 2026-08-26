import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TONES = {
  Projects: { bg: "#E5F6FF", text: "#007AFF" },
  Activities: { bg: "#EAFBF0", text: "#34C759" },
  Events: { bg: "#EAFBF0", text: "#34C759" },
  Programs: { bg: "#FFF1F0", text: "#FF3B30" },
  Education: { bg: "#F3E8FF", text: "#7C3AED" },
  Youth: { bg: "#FFF4E5", text: "#F59E0B" },
  Environment: { bg: "#EAFBF0", text: "#16A34A" },
  Justice: { bg: "#E5F6FF", text: "#007AFF" },
};

export function categoryTone(label) {
  return TONES[label] || { bg: "#F5F5F7", text: "#666" };
}

export default function FeedCard({
  image,
  category,
  timeLabel,
  title,
  summary,
  onPress,
  footer,
}) {
  const tone = categoryTone(category);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.95} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.metaRow}>
          {category ? (
            <View style={[styles.badge, { backgroundColor: tone.bg }]}>
              <Text style={[styles.badgeText, { color: tone.text }]}>
                {category}
              </Text>
            </View>
          ) : (
            <View />
          )}
          {timeLabel ? <Text style={styles.time}>{timeLabel}</Text> : null}
        </View>
        <Text style={styles.title}>{title}</Text>
        {summary ? (
          <Text style={styles.summary} numberOfLines={3}>
            {summary}
          </Text>
        ) : null}
      </View>

      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : null}

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </TouchableOpacity>
  );
}

export const feedCardStyles = StyleSheet.create({
  separator: {
    height: 8,
    backgroundColor: "#F0F2F5",
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
  actionIconButton: {
    padding: 6,
    marginLeft: 10,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  time: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    lineHeight: 22,
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#F0F0F0",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
