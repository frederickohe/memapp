import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, MessageSquare, Users, Calendar, Plus } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

export default function ConnectScreen() {
  const router = useRouter();
  const [joinedGroups, setJoinedGroups] = useState({});
  const [connectedUsers, setConnectedUsers] = useState({});

  const groups = [
    { id: "g1", name: "Fitness Enthusiasts", members: 42, image: "https://picsum.photos/seed/grp1/150/150" },
    { id: "g2", name: "Volunteer Network", members: 18, image: "https://picsum.photos/seed/grp2/150/150" },
    { id: "g3", name: "Youth Sports Parents", members: 31, image: "https://picsum.photos/seed/grp3/150/150" },
    { id: "g4", name: "Senior Wellness Circle", members: 25, image: "https://picsum.photos/seed/grp4/150/150" },
  ];

  const meetups = [
    {
      id: "m1",
      title: "Community Saturday Breakfast",
      date: "Saturday, June 27",
      time: "8:00 AM - 10:00 AM",
      location: "Main Dining Hall",
    },
    {
      id: "m2",
      title: "Member Networking Night",
      date: "Friday, July 03",
      time: "6:00 PM - 8:00 PM",
      location: "YMCA Lounge",
    },
  ];

  const users = [
    { id: "u1", name: "Kofi Mensah", avatar: "https://randomuser.me/api/portraits/men/32.jpg", role: "Fitness Member" },
    { id: "u2", name: "Akua Osei", avatar: "https://randomuser.me/api/portraits/women/12.jpg", role: "Volunteer Lead" },
    { id: "u3", name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/85.jpg", role: "Youth Coach" },
    { id: "u4", name: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/45.jpg", role: "Yoga Instructor" },
  ];

  const toggleJoinGroup = (id, name) => {
    setJoinedGroups(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      const isJoining = updated[id];
      Alert.alert("Group Update", isJoining ? `You successfully joined "${name}"!` : `You left "${name}".`);
      return updated;
    });
  };

  const toggleConnectUser = (id, name) => {
    setConnectedUsers(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      const isConnecting = updated[id];
      Alert.alert("Connection Update", isConnecting ? `Connection request sent to ${name}!` : `Cancelled request to ${name}.`);
      return updated;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Discussion Groups Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Discussion Groups</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.groupsScroll}
        >
          {groups.map((group) => (
            <View key={group.id} style={styles.groupCard}>
              <Image source={{ uri: group.image }} style={styles.groupImage} />
              <Text style={styles.groupName} numberOfLines={1}>
                {group.name}
              </Text>
              <Text style={styles.groupMembers}>{group.members} Members</Text>
              <TouchableOpacity
                style={[
                  styles.groupButton,
                  joinedGroups[group.id] && styles.groupButtonActive,
                ]}
                onPress={() => toggleJoinGroup(group.id, group.name)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.groupButtonText,
                    joinedGroups[group.id] && styles.groupButtonTextActive,
                  ]}
                >
                  {joinedGroups[group.id] ? "Joined" : "Join"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Upcoming Meetups Section */}
        <Text style={styles.sectionTitle}>Upcoming Meetups</Text>
        {meetups.map((meetup) => (
          <View key={meetup.id} style={styles.meetupCard}>
            <View style={styles.meetupHeader}>
              <Calendar size={18} color="#FF3B30" style={{ marginRight: 8 }} />
              <Text style={styles.meetupDate}>{meetup.date}</Text>
            </View>
            <Text style={styles.meetupTitle}>{meetup.title}</Text>
            <Text style={styles.meetupDetail}>⏰ {meetup.time}</Text>
            <Text style={styles.meetupDetail}>📍 {meetup.location}</Text>
            
            <TouchableOpacity
              style={styles.rsvpButton}
              onPress={() => Alert.alert("RSVP Confirmed", `Thank you for RSVPing for the "${meetup.title}"!`)}
              activeOpacity={0.8}
            >
              <Text style={styles.rsvpButtonText}>RSVP Now</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Active Members Section */}
        <Text style={styles.sectionTitle}>Featured Members</Text>
        <View style={styles.membersContainer}>
          {users.map((item) => (
            <View key={item.id} style={styles.memberCard}>
              <View style={styles.memberLeft}>
                <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Text style={styles.memberRole}>{item.role}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.connectButton,
                  connectedUsers[item.id] && styles.connectButtonActive,
                ]}
                onPress={() => toggleConnectUser(item.id, item.name)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.connectButtonText,
                    connectedUsers[item.id] && styles.connectButtonTextActive,
                  ]}
                >
                  {connectedUsers[item.id] ? "Pending" : "Connect"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#111",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  seeAllText: {
    fontSize: 13,
    color: "#FF3B30",
    fontWeight: "400",
  },
  groupsScroll: {
    paddingBottom: 20,
  },
  groupCard: {
    width: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 12,
    alignItems: "center",
    marginRight: 14,
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F5F7",
    marginBottom: 10,
  },
  groupName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111",
    textAlign: "center",
    marginBottom: 4,
    width: "100%",
  },
  groupMembers: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
    marginBottom: 12,
  },
  groupButton: {
    backgroundColor: "#000000",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    width: "100%",
    alignItems: "center",
  },
  groupButtonActive: {
    backgroundColor: "#F5F5F7",
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  groupButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "400",
  },
  groupButtonTextActive: {
    color: "#666",
  },
  meetupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
    marginBottom: 20,
  },
  meetupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  meetupDate: {
    fontSize: 11,
    fontWeight: "500",
    color: "#FF3B30",
  },
  meetupTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
    marginBottom: 8,
  },
  meetupDetail: {
    fontSize: 12,
    color: "#555",
    fontWeight: "400",
    marginBottom: 4,
  },
  rsvpButton: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 12,
  },
  rsvpButtonText: {
    color: "#111",
    fontSize: 12,
    fontWeight: "400",
  },
  membersContainer: {
    width: "100%",
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 12,
    marginBottom: 12,
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
  },
  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111",
  },
  memberRole: {
    fontSize: 11,
    color: "#666",
    fontWeight: "400",
    marginTop: 1,
  },
  connectButton: {
    backgroundColor: "#000000",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  connectButtonActive: {
    backgroundColor: "#F5F5F7",
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  connectButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "400",
  },
  connectButtonTextActive: {
    color: "#666",
  },
});
