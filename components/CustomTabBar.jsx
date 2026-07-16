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
const SLIDE_SPRING = { damping: 14, stiffness: 170, mass: 0.8 };

const ICONS = {
  index: Home,
  achievements: Award,
  profile: User,
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  // Base icons live in fixed, equal-width cells so they never move.
  const cellLayouts = useRef({});
  const [indicatorW, setIndicatorW] = useState(0);
  const [ready, setReady] = useState(false);

  const indicatorX = useSharedValue(0);

  const positionIndicator = (animated) => {
    const cell = cellLayouts.current[state.index];
    if (!cell || !indicatorW) return false;
    const target = cell.x + cell.width / 2 - indicatorW / 2;
    if (animated) {
      indicatorX.value = withSpring(target, SLIDE_SPRING);
    } else {
      indicatorX.value = target;
    }
    return true;
  };

  const handleCellLayout = (index, e) => {
    const { x, width } = e.nativeEvent.layout;
    cellLayouts.current[index] = { x, width };
    if (index === state.index) {
      if (!ready) {
        if (positionIndicator(false)) setReady(true);
      } else {
        positionIndicator(true);
      }
    }
  };

  // Reposition when the active tab changes or the indicator is measured.
  useEffect(() => {
    if (!indicatorW) return;
    if (!ready) {
      if (positionIndicator(false)) setReady(true);
    } else {
      positionIndicator(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, indicatorW]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    opacity: ready ? 1 : 0,
  }));

  const activeRoute = state.routes[state.index];
  const activeLabel =
    descriptors[activeRoute.key].options.title ?? activeRoute.name;
  const ActiveIcon = ICONS[activeRoute.name] ?? Home;

  return (
    <View
      style={[
        styles.wrap,
        { paddingBottom: insets.bottom ? Math.max(insets.bottom - 12, 4) : 4 },
      ]}
    >
      <View style={styles.pill}>
        {/* Sliding highlight (only moving element) */}
        <Reanimated.View
          style={[styles.indicator, indicatorStyle]}
          onLayout={(e) => setIndicatorW(e.nativeEvent.layout.width)}
        >
          <ActiveIcon size={21} color={BRAND_RED} strokeWidth={2.4} />
          <Text style={styles.activeLabel} numberOfLines={1}>
            {activeLabel}
          </Text>
        </Reanimated.View>

        {/* Fixed base cells */}
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
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={label}
              onPress={onPress}
              onLayout={(e) => handleCellLayout(index, e)}
              activeOpacity={0.8}
              style={styles.item}
            >
              {/* Active base icon stays rendered but hidden behind the indicator. */}
              <Icon
                size={21}
                color={INACTIVE}
                strokeWidth={2}
                style={{ opacity: focused ? 0 : 1 }}
              />
            </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: PILL_HEIGHT,
  },
  activeLabel: {
    color: BRAND_RED,
    fontSize: 13,
    fontWeight: "700",
  },
});
