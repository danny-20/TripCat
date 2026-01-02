import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";

import Colors from "@/constants/Colors";
import { useColorScheme } from "../../components/useColorScheme";
import { useAuth } from "../providers/AuthProvider";

export default function AdminTabLayout() {
  const colorScheme = useColorScheme();
  const { session, loading, isAdmin } = useAuth();

  // Wait until session is loaded
  if (loading) return null;

  // Not logged in → send to login
  if (!session) return <Redirect href="/(auth)/sign-in" />;

  // Logged-in but NOT admin → block access
  if (!isAdmin) return <Redirect href="/(user)" />;

  const activeColor = Colors.trip.secondary;
  const inactiveColor = Colors.trip.muted;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: Colors.trip.background,
          borderTopColor: Colors.trip.border,
          height: 60,
          paddingBottom: 6,
        },
      }}
    >
      {/* Hidden route (required by Expo Router) */}
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
