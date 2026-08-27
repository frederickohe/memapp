import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { profileInitials } from "@/lib/profileUtils";

const DARK = "#1D3108";

export default function ProfileAvatar({ name, photoUrl, size = 56, style }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(photoUrl) && !failed;
  const radius = size / 2;

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: radius },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: photoUrl }}
          style={{ width: size, height: size, borderRadius: radius }}
          onError={() => setFailed(true)}
        />
      ) : (
        <Text style={[styles.initials, { fontSize: Math.round(size * 0.32) }]}>
          {profileInitials(name)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: DARK,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  initials: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
