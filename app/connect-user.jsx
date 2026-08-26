import React from "react";
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
import { ChevronLeft, SquarePen, Flame } from "lucide-react-native";
import { SocialIcon, SOCIAL_HANDLES } from "@/components/SocialIcons";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ConnectUserScreen() {
  const router = useRouter();
  const profile = useUserProfile();
  const qrValue =
    profile.memberId && profile.memberId !== "—"
      ? String(profile.memberId)
      : profile.id;
  const qrUri = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    qrValue
  )}`;

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
          <SquarePen size={18} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Avatar + identity */}
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Anna Boakye</Text>
        <Text style={styles.handle}>@annb</Text>

        <View style={styles.pointsRow}>
          <Flame size={16} color="#FF7A00" fill="#FF7A00" />
          <Text style={styles.pointsText}>1200</Text>
        </View>

        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>Your QR</Text>
          <Image source={{ uri: qrUri }} style={styles.qrImage} />
          <Text style={styles.qrMemberId}>{qrValue}</Text>
        </View>

        {/* Social handles */}
        <Text style={styles.sectionTitle}>Your Social Handles</Text>

        <View style={styles.socialList}>
          {SOCIAL_HANDLES.map((item) => (
            <View key={item.id} style={styles.socialRow}>
              <View style={styles.socialIcon}>
                <SocialIcon name={item.id} size={24} />
              </View>
              <Text style={styles.socialHandle}>{item.handle}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Connect Others Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.9}
          onPress={() => router.push("/connect-list")}
        >
          <Text style={styles.primaryButtonText}>Connect Others</Text>
        </TouchableOpacity>
      </View>
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
  scroll: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 24,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#F5F5F7",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginTop: 14,
  },
  handle: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  pointsText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF7A00",
  },
  qrCard: {
    marginTop: 22,
    alignItems: "center",
    backgroundColor: "#F7F8FC",
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 18,
  },
  qrLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  qrImage: {
    width: 168,
    height: 168,
  },
  qrMemberId: {
    marginTop: 10,
    fontSize: 13,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 28,
    marginBottom: 18,
  },
  socialList: {
    width: "100%",
    alignItems: "center",
    gap: 18,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 200,
  },
  socialIcon: {
    width: 34,
    alignItems: "center",
  },
  socialHandle: {
    fontSize: 14,
    color: "#333",
    marginLeft: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  primaryButton: {
    backgroundColor: "#111",
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});
