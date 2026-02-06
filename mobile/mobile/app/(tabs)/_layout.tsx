import { Tabs, useFocusEffect } from "expo-router";
import React, { useState } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import api from "@/services/api";

export default function TabLayout() {
  const [userType, setUserType] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadUserType = async () => {
        try {
          const response = await api.getCurrentUser();
          if (response.success && response.data?.user?.tipo) {
            setUserType(response.data.user.tipo);
          }
        } catch (error) {
          console.error("Erro ao carregar tipo de usuário:", error);
        }
      };
      loadUserType();
    }, []),
  );

  const isArtist = userType === "artista";

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
      {/* Tab 1: Feed */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          href: "/(tabs)",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* Tab 2: Propostas (Artistas) | Artistas (Contratantes) */}
      {isArtist ? (
        <Tabs.Screen
          name="minhas-propostas"
          options={{
            title: "Propostas",
            href: "/(tabs)/minhas-propostas",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="envelope.open.fill" color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="explore"
          options={{
            title: "Artistas",
            href: "/(tabs)/explore",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="magnifyingglass" color={color} />
            ),
          }}
        />
      )}

      {/* Tab 3: Portfólio (Artistas) | Minhas Propostas (Contratantes) */}
      {isArtist ? (
        <Tabs.Screen
          name="portfolio"
          options={{
            title: "Portfólio",
            href: "/(tabs)/portfolio",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="film.fill" color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="minhas-propostas"
          options={{
            title: "Propostas",
            href: "/(tabs)/minhas-propostas",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="doc.text.fill" color={color} />
            ),
          }}
        />
      )}

      {/* Tab 4: Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          href: "/(tabs)/profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
