import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ArtistTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#EC4899",
        tabBarInactiveTintColor: "#9A9A9A",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#0B0B0B",
          borderTopColor: "#1F1F1F",
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.6,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 6,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      {/* Tab 1: Feed - Oportunidades */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          href: "/(artist-tabs)",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* Tab 2: Propostas Recebidas */}
      <Tabs.Screen
        name="minhas-propostas"
        options={{
          title: "Propostas",
          href: "/(artist-tabs)/minhas-propostas",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="envelope.open.fill" color={color} />
          ),
        }}
      />

      {/* Tab 3: Portfólio */}
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "Portfólio",
          href: "/(artist-tabs)/portfolio",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="film.fill" color={color} />
          ),
        }}
      />

      {/* Tab 4: Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          href: "/(artist-tabs)/profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
