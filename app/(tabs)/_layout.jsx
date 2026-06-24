import { Tabs } from "expo-router";
import React from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Home, Gift, User, Bike, Award } from 'lucide-react-native';
import { scaleFont } from "@/components/scale"

function TabIcon({ focused, IconComponent, size = Math.round(scaleFont(20)) }) {
  const scale = useSharedValue(1);  
  const animatedStyle = useAnimatedStyle(() => ({ 
    transform: [{ scale: scale.value }] 
  }));
  
  React.useEffect(() => { 
    scale.value = withSpring(focused ? 1.2 : 1); 
  }, [focused]);
  
  return (
    <Animated.View style={animatedStyle}>
      <IconComponent 
        size={size} 
        color={focused ? '#FF0000' : 'gray'} 
        strokeWidth={focused ? 2.5 : 2}
      />
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} IconComponent={Home} /> 
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: "Achievements",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} IconComponent={Award} /> 
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} IconComponent={User} /> 
        }}
      />
    </Tabs>
  );
}
