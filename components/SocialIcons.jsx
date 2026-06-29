import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const SOCIAL_MAP = {
  whatsapp: { glyph: "whatsapp", color: "#25D366" },
  instagram: { glyph: "instagram", color: "#E4405F" },
  twitter: { glyph: "twitter", color: "#1DA1F2" },
  facebook: { glyph: "facebook-square", color: "#1877F2" },
};

export function SocialIcon({ name, size = 22 }) {
  const item = SOCIAL_MAP[name] || SOCIAL_MAP.whatsapp;
  return <FontAwesome name={item.glyph} size={size} color={item.color} />;
}

export const SOCIAL_HANDLES = [
  { id: "whatsapp", handle: "@annb" },
  { id: "instagram", handle: "@annbboakye" },
  { id: "twitter", handle: "theannb" },
  { id: "facebook", handle: "realanna" },
];
