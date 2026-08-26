import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { useAuthStore } from "@/stores/useAuthStore";
import { uploadSocialMedia } from "@/lib/api/social";
import { useCreatePost } from "@/hooks/useSocial";
import { OnboardingButton } from "@/components/OnboardingFormComponents";

export default function SocialComposeScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { submit, pending } = useCreatePost();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [kind, setKind] = useState("IMPACT");
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Allow photo access to share your impact.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]) {
      setImage(result.assets[0]);
    }
  };

  const handlePost = async () => {
    if (!image?.uri) {
      Alert.alert("Add a photo", "Choose a photo of your impact or story.");
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadSocialMedia(
        {
          uri: image.uri,
          name: image.fileName || "impact.jpg",
          type: image.mimeType || "image/jpeg",
        },
        token
      );
      await submit({
        caption: caption.trim(),
        media_url: uploaded.file_url,
        kind,
      });
      router.replace("/social");
    } catch (err) {
      Alert.alert("Could not post", err.message || "Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const busy = pending || uploading;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ChevronLeft size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New post</Text>
        <View style={styles.iconBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.85}>
          {image?.uri ? (
            <Image source={{ uri: image.uri }} style={styles.preview} />
          ) : (
            <Text style={styles.pickerHint}>Tap to add a photo</Text>
          )}
        </TouchableOpacity>

        <View style={styles.kindRow}>
          {["IMPACT", "STORY"].map((value) => (
            <TouchableOpacity
              key={value}
              style={[styles.kindPill, kind === value && styles.kindPillActive]}
              onPress={() => setKind(value)}
            >
              <Text style={[styles.kindText, kind === value && styles.kindTextActive]}>
                {value === "IMPACT" ? "Impact" : "Story"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.caption}
          placeholder="Write a caption..."
          placeholderTextColor="#999"
          multiline
          value={caption}
          onChangeText={setCaption}
        />
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <OnboardingButton
          label={busy ? "Posting…" : "Share"}
          onPress={handlePost}
          disabled={busy}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  imagePicker: {
    marginHorizontal: 16,
    height: 280,
    borderRadius: 16,
    backgroundColor: "#F4F4F6",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  pickerHint: {
    color: "#888",
    fontSize: 15,
  },
  kindRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  kindPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F4F4F6",
  },
  kindPillActive: {
    backgroundColor: "#111",
  },
  kindText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 13,
  },
  kindTextActive: {
    color: "#fff",
  },
  caption: {
    marginHorizontal: 16,
    marginTop: 16,
    minHeight: 90,
    fontSize: 15,
    color: "#111",
    textAlignVertical: "top",
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
