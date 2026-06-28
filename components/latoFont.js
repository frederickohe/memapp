import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";

import { Lato_100Thin } from "@expo-google-fonts/lato/100Thin";
import { Lato_100Thin_Italic } from "@expo-google-fonts/lato/100Thin_Italic";
import { Lato_300Light } from "@expo-google-fonts/lato/300Light";
import { Lato_300Light_Italic } from "@expo-google-fonts/lato/300Light_Italic";
import { Lato_400Regular } from "@expo-google-fonts/lato/400Regular";
import { Lato_400Regular_Italic } from "@expo-google-fonts/lato/400Regular_Italic";
import { Lato_700Bold } from "@expo-google-fonts/lato/700Bold";
import { Lato_700Bold_Italic } from "@expo-google-fonts/lato/700Bold_Italic";
import { Lato_900Black } from "@expo-google-fonts/lato/900Black";
import { Lato_900Black_Italic } from "@expo-google-fonts/lato/900Black_Italic";

// Font map passed to `useFonts`.
export const LATO_FONTS = {
  Lato_100Thin,
  Lato_100Thin_Italic,
  Lato_300Light,
  Lato_300Light_Italic,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  Lato_900Black_Italic,
};

// Lato ships discrete weight files, so we pick the closest variant for any
// fontWeight value used in the app.
function familyForWeight(fontWeight, italic) {
  const weight = String(fontWeight ?? "400");
  let base;
  switch (weight) {
    case "100":
      base = "Lato_100Thin";
      break;
    case "200":
    case "300":
      base = "Lato_300Light";
      break;
    case "400":
    case "normal":
    case "500":
      base = "Lato_400Regular";
      break;
    case "600":
    case "700":
    case "bold":
      base = "Lato_700Bold";
      break;
    case "800":
    case "900":
      base = "Lato_900Black";
      break;
    default:
      base = "Lato_400Regular";
  }
  return italic ? `${base}_Italic` : base;
}

function patchComponent(Component) {
  const original = Component.render;
  if (typeof original !== "function" || original.__latoPatched) return;

  const patched = function render(...args) {
    const element = original.apply(this, args);
    if (!element || !React.isValidElement(element)) return element;

    const flat = StyleSheet.flatten(element.props.style) || {};
    // Respect any explicitly set non-Lato font family.
    if (flat.fontFamily && !String(flat.fontFamily).startsWith("Lato")) {
      return element;
    }

    const { fontWeight, ...rest } = flat;
    const family = familyForWeight(fontWeight, flat.fontStyle === "italic");

    return React.cloneElement(element, {
      style: { ...rest, fontFamily: family },
    });
  };

  patched.__latoPatched = true;
  Component.render = patched;
}

let applied = false;

// Makes Lato the default font for every <Text> and <TextInput> in the app,
// mapping each fontWeight to its matching Lato variant.
export function applyGlobalLatoFont() {
  if (applied) return;
  applied = true;
  patchComponent(Text);
  patchComponent(TextInput);
}
