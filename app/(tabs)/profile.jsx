import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import {
  User,
  MapPin,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Mail,
  Smartphone,
  ChevronRight,
  ShieldAlert,
} from "lucide-react-native";
import { scaleFont } from "@/components/scale";
import { useAuthStore } from "@/stores/useAuthStore";
import { navigateToSignedOutApp } from "@/lib/authNavigation";
import { useUserProfile } from "@/hooks/useUserProfile";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80";

export default function ProfileScreen() {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const member = useUserProfile();

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing is not available in demo mode.");
  };

  const handleLogOut = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          navigateToSignedOutApp(router);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
          <Settings size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Section */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: member.avatar || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{member.name}</Text>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>MEMBER ID: {member.memberId}</Text>
          </View>
        </View>

        {/* Affiliation Banner */}
        <View style={[styles.banner, styles.bannerRed]}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Affiliation</Text>
            <Text style={styles.bannerYear}>{member.currentYear}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{member.affiliationStatus}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            activeOpacity={0.85}
            onPress={() => router.push("/affiliation")}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>

        {/* Dues Banner */}
        <View style={[styles.banner, styles.bannerGreen]}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Dues</Text>
            <Text style={styles.bannerYear}>{member.currentYear}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{member.duesStatus}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            activeOpacity={0.85}
            onPress={() => router.push("/affiliation")}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>

        {/* Member Details Grid */}
        <Text style={styles.sectionTitle}>Membership Details</Text>
        <View style={styles.infoCard}>
          {/* Branch */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#E5F6FF" }]}>
                <MapPin size={18} color="#007AFF" />
              </View>
              <Text style={styles.infoLabel}>Branch</Text>
            </View>
            <Text style={styles.infoValue}>{member.branch}</Text>
          </View>
          <View style={styles.divider} />

          {/* Date Joined */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#EAFBF0" }]}>
                <Calendar size={18} color="#34C759" />
              </View>
              <Text style={styles.infoLabel}>Date Joined</Text>
            </View>
            <Text style={styles.infoValue}>{member.dateJoined}</Text>
          </View>
          <View style={styles.divider} />

          {/* Age */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#F5F5F7" }]}>
                <User size={18} color="#666" />
              </View>
              <Text style={styles.infoLabel}>Age</Text>
            </View>
            <Text style={styles.infoValue}>
              {member.age === "—" ? member.age : `${member.age} Years`}
            </Text>
          </View>
          <View style={styles.divider} />

          {/* Gender */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#FFF2F2" }]}>
                <User size={18} color="#FF3B30" />
              </View>
              <Text style={styles.infoLabel}>Gender</Text>
            </View>
            <Text style={styles.infoValue}>{member.gender}</Text>
          </View>
        </View>

        {/* Contact Info Card */}
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoCard}>
          {/* Email */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#F5F5F7" }]}>
                <Mail size={16} color="#666" />
              </View>
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{member.email}</Text>
          </View>
          <View style={styles.divider} />

          {/* Phone */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#F5F5F7" }]}>
                <Smartphone size={16} color="#666" />
              </View>
              <Text style={styles.infoLabel}>Phone</Text>
            </View>
            <Text style={styles.infoValue}>{member.phone}</Text>
          </View>
        </View>

        {/* Interests Section */}
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {member.interests.length > 0 ? (
            member.interests.map((interest, idx) => (
              <View key={idx} style={styles.interestPill}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyInterests}>No skills added yet</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile} activeOpacity={0.8}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut} activeOpacity={0.8}>
            <LogOut size={16} color="#FF3B30" style={{ marginRight: 8 }} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
  },
  settingsButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 26,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F5F5F7",
    marginBottom: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: "400",
    color: "#111",
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: "#F5F5F7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  idBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#666",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#111",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  bannerRed: {
    backgroundColor: "#FF0000",
  },
  bannerGreen: {
    backgroundColor: "#1D3108",
  },
  bannerLeft: {
    flex: 1,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  bannerYear: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 2,
    opacity: 0.9,
  },
  statusPill: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  viewButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    color: "#111",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F5F5F7",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
  },
  interestPill: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EEF0F2",
  },
  interestText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#444",
  },
  emptyInterests: {
    fontSize: 13,
    color: "#999",
  },
  actionsContainer: {
    width: "100%",
  },
  editButton: {
    backgroundColor: "#000000",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "400",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#FFE2E2",
    backgroundColor: "#FFF5F5",
  },
  logoutButtonText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "400",
  },
});
