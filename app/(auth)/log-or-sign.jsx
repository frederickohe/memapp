import { useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LogOrSignScreen() {
  const router = useRouter();
  const setAuthIntent = useAuthStore((state) => state.setAuthIntent);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          </View>
    <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to the</Text>
        <Text style={styles.welcomeSubtext}>Ymca Member App</Text>
    </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.signUpButton]}
            onPress={() => {
              setAuthIntent("signup");
              router.push("/(auth)/phone-number?intent=signup");
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => {
              setAuthIntent("login");
              router.push("/(auth)/login?intent=login");
            }}
          >
            <Text style={styles.loginButton_text}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.donateButton]}
            onPress={() => {}}
          >
            <Text style={styles.buttonText}>Donate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: "400",
    color: "#000",
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  signUpButton: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: "#000",
  },
  donateButton: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  loginButton_text: {
    color: "#fff",
  },
  textContainer:{
    alignItems:"center"
  }
});
