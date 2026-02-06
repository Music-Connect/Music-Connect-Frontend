import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import api from "@/services/api";

export default function ArtistProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    propostas: 0,
    avaliacoes: 0,
    mediaAvaliacoes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, []),
  );

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await api.getCurrentUser();
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setUser(userData);

        // Load stats for artist
        const [propostasRes, avaliacoesRes] = await Promise.all([
          api.getPropostasArtistaRecebidas(userData.id_usuario),
          api.getAvaliacoes(userData.id_usuario),
        ]);

        setStats({
          propostas: propostasRes.data?.propostas?.length || 0,
          avaliacoes: avaliacoesRes.data?.avaliacoes?.length || 0,
          mediaAvaliacoes: userData.media_avaliacoes || 0,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      router.replace("/login");
    } catch (error) {
      router.replace("/login");
    }
  };

  if (loading && !user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Erro ao carregar perfil</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserData}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#EC4899"
            colors={["#EC4899"]}
          />
        }
      >
        {/* Cover Photo / Gradient Header */}
        <View style={styles.coverGradient} />

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.usuario.substring(0, 1).toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={() => router.push("/edit-profile")}
              >
                <Text style={styles.editAvatarIcon}>✏️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.userName}>{user.usuario}</Text>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🎵 Artista</Text>
            </View>
          </View>

          {user.local_atuacao && (
            <Text style={styles.userLocation}>📍 {user.local_atuacao}</Text>
          )}

          {user.genero_musical && (
            <Text style={styles.userGenre}>🎸 {user.genero_musical}</Text>
          )}

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.propostas}</Text>
              <Text style={styles.statLabel}>Propostas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.avaliacoes}</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {stats.mediaAvaliacoes > 0
                  ? `⭐ ${Number(stats.mediaAvaliacoes).toFixed(1)}`
                  : "-"}
              </Text>
              <Text style={styles.statLabel}>Nota</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push("/edit-profile")}
            >
              <Text style={styles.quickActionIcon}>✏️</Text>
              <Text style={styles.quickActionText}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push("/(artist-tabs)/minhas-propostas")}
            >
              <Text style={styles.quickActionIcon}>📋</Text>
              <Text style={styles.quickActionText}>Minhas Propostas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <TouchableOpacity onPress={() => router.push("/edit-profile")}>
              <Text style={styles.sectionAction}>Editar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionCard}>
            {user.descricao ? (
              <Text style={styles.descriptionText}>{user.descricao}</Text>
            ) : (
              <Text style={styles.emptyText}>
                Adicione uma descrição para que os contratantes possam conhecer
                você melhor.
              </Text>
            )}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contato</Text>
          </View>
          <View style={styles.sectionCard}>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📧</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{user.email}</Text>
              </View>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📱</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Telefone</Text>
                <Text style={styles.contactValue}>
                  {user.telefone || "Não informado"}
                </Text>
              </View>
            </View>
            {user.cidade && (
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>🏙️</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Cidade</Text>
                  <Text style={styles.contactValue}>
                    {[user.cidade, user.estado].filter(Boolean).join(", ")}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/history")}
            >
              <Text style={styles.menuIcon}>📜</Text>
              <Text style={styles.menuText}>Histórico</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/(artist-tabs)/portfolio")}
            >
              <Text style={styles.menuIcon}>🎪</Text>
              <Text style={styles.menuText}>Portfólio</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/settings")}
            >
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuText}>Configurações</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                /* Help */
              }}
            >
              <Text style={styles.menuIcon}>❓</Text>
              <Text style={styles.menuText}>Ajuda</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Music Connect v1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#EC4899",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  // Cover
  coverGradient: {
    height: 120,
    backgroundColor: "#EC4899",
  },

  // Profile Card
  profileCard: {
    backgroundColor: "#1A1A1A",
    marginTop: -40,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  avatarSection: {
    marginTop: -60,
    marginBottom: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#1A1A1A",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2A2A2A",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  editAvatarIcon: {
    fontSize: 14,
  },
  userName: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  badgeContainer: {
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(236, 72, 153, 0.2)",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },
  userLocation: {
    color: "#888",
    fontSize: 14,
    marginBottom: 4,
  },
  userGenre: {
    color: "#AAA",
    fontSize: 14,
    marginBottom: 16,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#2A2A2A",
    width: "100%",
    justifyContent: "center",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statNumber: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "#666",
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#2A2A2A",
  },

  // Quick Actions
  quickActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2A2A",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  quickActionIcon: {
    fontSize: 16,
  },
  quickActionText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionAction: {
    color: "#EC4899",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  descriptionText: {
    color: "#CCC",
    fontSize: 14,
    lineHeight: 22,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },

  // Contact
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    color: "#666",
    fontSize: 12,
    marginBottom: 2,
  },
  contactValue: {
    color: "#FFF",
    fontSize: 14,
  },

  // Menu
  menuCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  menuText: {
    color: "#FFF",
    fontSize: 15,
    flex: 1,
  },
  menuArrow: {
    color: "#666",
    fontSize: 20,
  },

  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EF4444",
    gap: 10,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "600",
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingBottom: 100,
  },
  footerText: {
    color: "#444",
    fontSize: 12,
  },
});
