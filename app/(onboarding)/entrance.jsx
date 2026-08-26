import { useRouter } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignupButton } from "@/components/SignupButton";
import { SignupVideoCard } from "@/components/SignupVideoCard";
import { navigateToAuthenticatedApp } from "@/lib/authNavigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSignupStore } from "@/stores/useSignupStore";

export default function EntranceScreen() {
  const router = useRouter();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const user = useAuthStore((state) => state.user);
  const currentBranch = useSignupStore((state) => state.currentBranch);
  const membershipId = useSignupStore((state) => state.membershipId);

  const branch =
    user?.current_branch || currentBranch || "Madina";
  const memberId =
    user?.member_id || membershipId || "YID2834938489";

  const handleDashboard = () => {
    completeOnboarding();
    navigateToAuthenticatedApp(router);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Welcome on Board!</Text>
      <View style={styles.body}>
        <SignupVideoCard />
        <View style={styles.copy}>
          <Text style={styles.line}>
            {`You are Part of\nYmca ${branch} Branch`}
          </Text>
          <Text style={styles.line}>{`Your Member ID is ${memberId}`}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <SignupButton label="Dashboard" onPress={handleDashboard} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 104,
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
  },
  body: {
    marginTop: 42,
    gap: 59,
  },
  copy: {
    gap: 40,
  },
  line: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
    lineHeight: 30,
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 16,
  },
});
