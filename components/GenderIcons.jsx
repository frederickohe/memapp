import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

/**
 * Simple man silhouette (head + broad shoulders + two legs).
 */
export function ManIcon({ size = 28, color = "#333" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="10" r="6.5" fill={color} />
      <Path
        d="M14 24c0-3.3 2.7-6 6-6h8c3.3 0 6 2.7 6 6v8.5c0 1-0.8 1.8-1.8 1.8h-0.2V42c0 1.1-0.9 2-2 2s-2-0.9-2-2v-8h-1.6v8c0 1.1-0.9 2-2 2s-2-0.9-2-2v-8H22v8c0 1.1-0.9 2-2 2s-2-0.9-2-2v-7.7h-0.2c-1 0-1.8-0.8-1.8-1.8V24z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * Simple woman silhouette (head + triangular dress + two legs).
 */
export function WomanIcon({ size = 28, color = "#333" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="10" r="6.5" fill={color} />
      <Path
        d="M24 18c-2.6 0-4.9 1.7-5.7 4.2l-4 12.3c-0.4 1.2 0.5 2.3 1.7 2.3h3.1l-0.6 5.4c-0.1 1 0.7 1.6 1.6 1.6h1.9v-7h0.9v7h2c0.9 0 1.7-0.7 1.6-1.6l-0.6-5.4h3.1c1.2 0 2.1-1.1 1.7-2.3l-4-12.3C28.9 19.7 26.6 18 24 18z"
        fill={color}
      />
    </Svg>
  );
}
