import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Home, Award, User } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const INACTIVE = "#A3A3A3";

const PILL_HEIGHT = 64;
const INDICATOR_HEIGHT = 44;
const INDICATOR_TOP = (PILL_HEIGHT - INDICATOR_HEIGHT) / 2;

const SLIDE_SPRING = { damping: 16, stiffness: 190, mass: 0.7 };

const ICONS = {
  index: Home,
  achievements: Award,
  profile: User,
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

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
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      <View style={styles.pill}>
        <Reanimated.View
          style={[styles.indicator, indicatorStyle]}
          onLayout={(e) => setIndicatorW(e.nativeEvent.layout.width)}
        >
          <LinearGradient
            colors={["#FF2A2A", "#C40018"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <ActiveIcon size={20} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.activeLabel} numberOfLines={1}>
            {activeLabel}
          </Text>
        </Reanimated.View>

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
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
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
              <Icon
                size={22}
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
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 18, 18, 0.72)",
    borderRadius: 32,
    height: PILL_HEIGHT,
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: INDICATOR_TOP,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 8,
    overflow: "hidden",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: PILL_HEIGHT,
  },
  activeLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
