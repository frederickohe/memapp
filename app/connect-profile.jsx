import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Flame } from "lucide-react-native";
import { SocialIcon, SOCIAL_HANDLES } from "@/components/SocialIcons";

export default function ConnectProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const name = params.name || "Big Jay";
  const points = params.points || "200";
  const avatar =
    params.avatar || "https://randomuser.me/api/portraits/men/85.jpg";

  const [successVisible, setSuccessVisible] = useState(false);

  const about = [
    { label: "Branch", value: "Tesano" },
    { label: "Age", value: "18" },
    { label: "Gender", value: "Male" },
    { label: "Interests", value: "Football\nTech\nPolitics" },
    { label: "Date Joined", value: "10/00/2010" },
  ];

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
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Avatar + identity */}
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.handle}>@annb</Text>

        <View style={styles.pointsRow}>
          <Flame size={16} color="#FF7A00" fill="#FF7A00" />
          <Text style={styles.pointsText}>{points}</Text>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          {about.map((row, i) => (
            <View
              key={row.label}
              style={[styles.aboutRow, i === about.length - 1 && { marginBottom: 0 }]}
            >
              <Text style={styles.aboutLabel}>{row.label}:</Text>
              <Text style={styles.aboutValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Connect on Social */}
        <Text style={styles.sectionTitle}>Connect on Social</Text>
        <View style={styles.socialList}>
          {SOCIAL_HANDLES.map((item) => (
            <View key={item.id} style={styles.socialRow}>
              <View style={styles.socialIcon}>
                <SocialIcon name={item.id} size={24} />
              </View>
              <Text style={styles.socialHandle}>{item.handle}</Text>
              <TouchableOpacity
                style={styles.connectBtn}
                activeOpacity={0.85}
                onPress={() => setSuccessVisible(true)}
              >
                <Text style={styles.connectBtnText}>Connect</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Connection Success Modal */}
      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalText}>Connected With</Text>
            <Text style={styles.modalName}>{name}!</Text>
            <TouchableOpacity
              style={styles.returnBtn}
              activeOpacity={0.9}
              onPress={() => setSuccessVisible(false)}
            >
              <Text style={styles.returnBtnText}>Return</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerSpacer: {
    width: 36,
    height: 36,
  },
  scroll: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 30,
    paddingHorizontal: 24,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 26,
    marginBottom: 14,
    alignSelf: "center",
  },
  aboutCard: {
    width: "100%",
    paddingHorizontal: 24,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  aboutLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  aboutValue: {
    fontSize: 13,
    color: "#111",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  socialList: {
    width: "100%",
    gap: 14,
    paddingHorizontal: 8,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialIcon: {
    width: 34,
    alignItems: "center",
  },
  socialHandle: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    marginLeft: 14,
  },
  connectBtn: {
    backgroundColor: "#111",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  connectBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  modalText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "400",
  },
  modalName: {
    fontSize: 22,
    color: "#111",
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 22,
    textAlign: "center",
  },
  returnBtn: {
    backgroundColor: "#111",
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 50,
    alignItems: "center",
  },
  returnBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
