import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft } from "lucide-react-native";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/stores/useAuthStore";
import { uploadSocialMedia } from "@/lib/api/social";
import { SocialAvatar } from "@/components/social/ReelItem";

function listToText(value) {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function textToList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function EditProfileScreen() {
  const router = useRouter();
  const member = useUserProfile();
  const token = useAuthStore((state) => state.token);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [fullname, setFullname] = useState(member.name === "Member" ? "" : member.name);
  const [phone, setPhone] = useState(member.phone === "—" ? "" : member.phone);
  const [occupation, setOccupation] = useState(
    member.occupation === "—" ? "" : member.occupation
  );
  const [address, setAddress] = useState(member.address === "—" ? "" : member.address);
  const [skills, setSkills] = useState(listToText(member.skills));
  const [whatsapp, setWhatsapp] = useState(member.whatsapp === "—" ? "" : member.whatsapp);
  const [instagram, setInstagram] = useState(member.instagramUrl || "");
  const [facebook, setFacebook] = useState(member.facebookUrl || "");
  const [twitter, setTwitter] = useState(member.twitterUrl || "");
  const [linkedin, setLinkedin] = useState(member.linkedinUrl || "");
  const [avatarUri, setAvatarUri] = useState(member.avatar || null);
  const [localPhoto, setLocalPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Allow photo access to update your profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]) {
      setLocalPhoto(result.assets[0]);
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!fullname.trim()) {
      Alert.alert("Name required", "Please enter your full name.");
      return;
    }

    setUploading(true);
    try {
      let profilePictureUrl = member.avatar || undefined;
      if (localPhoto?.uri) {
        const uploaded = await uploadSocialMedia(
          {
            uri: localPhoto.uri,
            name: localPhoto.fileName || "avatar.jpg",
            type: localPhoto.mimeType || "image/jpeg",
          },
          token
        );
        profilePictureUrl = uploaded.file_url;
      }

      const result = await updateProfile({
        fullname: fullname.trim(),
        phone_number: phone.trim() || null,
        occupation: occupation.trim() || null,
        address: address.trim() || null,
        skills: textToList(skills),
        whatsapp_number: whatsapp.trim() ? whatsapp.trim().slice(0, 20) : null,
        instagram_url: instagram.trim() || null,
        facebook_url: facebook.trim() || null,
        twitter_url: twitter.trim() || null,
        linkedin_url: linkedin.trim() || null,
        profile_picture_url: profilePictureUrl || null,
      });

      if (!result.success) {
        Alert.alert("Could not save", result.error?.message || "Please try again.");
        return;
      }
      router.back();
    } catch (err) {
      Alert.alert("Could not save", err.message || "Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const busy = isLoading || uploading;
  const previewPerson = {
    id: member.id,
    name: fullname || member.name,
    avatar: avatarUri,
    gender: member.gender,
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.iconBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.photoWrap} onPress={pickPhoto} activeOpacity={0.85}>
            <SocialAvatar person={previewPerson} size={96} style={styles.avatar} />
            <Text style={styles.changePhoto}>Change photo</Text>
          </TouchableOpacity>

          <Field label="Full name" value={fullname} onChangeText={setFullname} />
          <Field
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Field label="Occupation" value={occupation} onChangeText={setOccupation} />
          <Field label="Address" value={address} onChangeText={setAddress} />
          <Field
            label="Skills"
            value={skills}
            onChangeText={setSkills}
            placeholder="Football, Tech, Mentoring"
          />
          <Field
            label="WhatsApp"
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
          />
          <Field label="Instagram" value={instagram} onChangeText={setInstagram} autoCapitalize="none" />
          <Field label="Facebook" value={facebook} onChangeText={setFacebook} autoCapitalize="none" />
          <Field label="Twitter / X" value={twitter} onChangeText={setTwitter} autoCapitalize="none" />
          <Field label="LinkedIn" value={linkedin} onChangeText={setLinkedin} autoCapitalize="none" />

          <TouchableOpacity
            style={[styles.saveBtn, busy && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={busy}
            activeOpacity={0.85}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInputRow}>
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || label}
          placeholderTextColor="#B1B2B4"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          includeFontPadding={false}
          textAlignVertical="center"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  photoWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: "#F5F5F7",
  },
  changePhoto: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginBottom: 6,
  },
  fieldInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 52,
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    paddingVertical: 2,
    paddingHorizontal: 0,
    margin: 0,
    minHeight: 22,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  saveBtn: {
    marginTop: 12,
    backgroundColor: "#111",
    borderRadius: 24,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
