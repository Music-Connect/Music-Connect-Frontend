import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

interface AppHeaderProps {
  user?: {
    usuario?: string;
    imagem_perfil_url?: string;
    tipo_usuario?: string;
  } | null;
  showSearch?: boolean;
  showNotifications?: boolean;
  title?: string;
  onSearchPress?: () => void;
}

export default function AppHeader({
  user,
  showSearch = true,
  showNotifications = true,
  title,
  onSearchPress,
}: AppHeaderProps) {
  const router = useRouter();

  const getInitial = () => {
    if (user?.usuario) {
      return user.usuario.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Left: Profile Avatar */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() => router.push("/(tabs)/profile")}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial()}</Text>
        </View>
        {user?.tipo_usuario && (
          <View style={styles.userTypeBadge}>
            <Text style={styles.userTypeBadgeText}>
              {user.tipo_usuario === "artista" ? "🎵" : "🎯"}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Center: Title or Logo */}
      <View style={styles.centerContainer}>
        {title ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🎸</Text>
            <Text style={styles.logoText}>Music Connect</Text>
          </View>
        )}
      </View>

      {/* Right: Actions */}
      <View style={styles.actionsContainer}>
        {showSearch && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onSearchPress || (() => router.push("/(tabs)/explore"))}
          >
            <Text style={styles.actionIcon}>🔍</Text>
          </TouchableOpacity>
        )}
        {showNotifications && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // TODO: Navigate to notifications
            }}
          >
            <Text style={styles.actionIcon}>🔔</Text>
            {/* Notification badge */}
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },

  // Avatar
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#333",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  userTypeBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 2,
  },
  userTypeBadgeText: {
    fontSize: 10,
  },

  // Center
  centerContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoIcon: {
    fontSize: 20,
  },
  logoText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Actions
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  actionIcon: {
    fontSize: 18,
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#EC4899",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
