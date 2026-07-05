import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Award, User } from "lucide-react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const BRAND_RED = "#FF0000";
const PILL_BG = "#0A0A0A";
const INACTIVE = "#9CA3AF";

const PILL_HEIGHT = 58;
const INDICATOR_HEIGHT = 42;
const INDICATOR_TOP = (PILL_HEIGHT - INDICATOR_HEIGHT) / 2;

// Slight overshoot when the indicator lands on the active tab → bounce back.
const SLIDE_SPRING = { damping: 12, stiffness: 160, mass: 0.8 };

const ICONS = {
  index: Home,
  achievements: Award,
  profile: User,
};

function TabItem({ Icon, label, focused, onPress, onLayout }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={onPress}
      onLayout={onLayout}
      activeOpacity={0.8}
      style={styles.item}
    >
      <Icon
        size={21}
        color={focused ? BRAND_RED : INACTIVE}
        strokeWidth={focused ? 2.4 : 2}
      />
      {focused && (
        <Text style={styles.activeLabel} numberOfLines={1}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  const layoutsRef = useRef({});
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);

  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const moveIndicator = (rect, animated) => {
    if (animated) {
      indicatorX.value = withSpring(rect.x, SLIDE_SPRING);
      indicatorW.value = withSpring(rect.width, SLIDE_SPRING);
    } else {
      indicatorX.value = rect.x;
      indicatorW.value = rect.width;
    }
  };

  const handleItemLayout = (index, e) => {
    const { x, width } = e.nativeEvent.layout;
    const prev = layoutsRef.current[index];
    layoutsRef.current[index] = { x, width };

    if (index !== state.index) return;

    if (!initialized.current) {
      moveIndicator({ x, width }, false);
      initialized.current = true;
      setReady(true);
    } else if (!prev || prev.x !== x || prev.width !== width) {
      // Active tab's size/position settled (e.g. label appeared) → slide + bounce.
      moveIndicator({ x, width }, true);
    }
  };

  useEffect(() => {
    const rect = layoutsRef.current[state.index];
    if (rect && initialized.current) {
      moveIndicator(rect, true);
    }
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorW.value,
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      style={[
        styles.wrap,
        { paddingBottom: insets.bottom ? Math.max(insets.bottom - 12, 4) : 4 },
      ]}
    >
      <View style={styles.pill}>
        {ready && (
          <Reanimated.View style={[styles.indicator, indicatorStyle]} />
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const Icon = ICONS[route.name] ?? Home;
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              Icon={Icon}
              label={label}
              focused={focused}
              onPress={onPress}
              onLayout={(e) => handleItemLayout(index, e)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: PILL_BG,
    borderRadius: 30,
    height: PILL_HEIGHT,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: INDICATOR_TOP,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    backgroundColor: "#FFFFFF",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
  },
  activeLabel: {
    color: BRAND_RED,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },
});
