import { Image, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { ICON_PLAY } from "@/components/signupIcons";

const POSTER = require("@/assets/images/signup/video-poster.png");

export function SignupVideoCard() {
  return (
    <View style={styles.card}>
      <Image source={POSTER} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={["rgba(0,0,0,0.51)", "rgba(0,0,0,0)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.play}>
        <SvgXml xml={ICON_PLAY} width={38} height={38} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 218,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  play: {
    width: 38,
    height: 38,
  },
});
