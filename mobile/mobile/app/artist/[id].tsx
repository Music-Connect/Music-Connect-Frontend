import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { mockArtists, mockPosts } from "@/constants/mockData";

type TabType = "publicacoes" | "sobre" | "agenda";

export default function PublicProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("publicacoes");
  const [showModal, setShowModal] = useState(false);

  // Find artist by ID (usando o primeiro artista como exemplo)
  const artist = mockArtists[0];

  const handleSendProposal = () => {
    router.push(`/create-proposal?id=${artist.id_usuario}`);
  };

  const renderPublicacoes = () => (
    <View style={styles.postsGrid}>
      {mockPosts.slice(0, 4).map((post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={[styles.postImage, styles.postImagePlaceholder]}>
            <Text style={styles.postImageText}>📷</Text>
          </View>
          <View style={styles.postInfo}>
            <Text style={styles.postTitle} numberOfLines={2}>
              {post.title}
            </Text>
            <View style={styles.postStats}>
              <Text key="likes" style={styles.postStat}>
                ❤️ {post.likes}
              </Text>
              <Text key="comments" style={styles.postStat}>
                💬 {post.comments}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderSobre = () => (
    <View style={styles.aboutSection}>
      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>�</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>LOCALIZAÇÃO</Text>
            <Text style={styles.infoValue}>
              {artist.local_atuacao || "Não informado"}
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>💼</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>TIPO</Text>
            <Text style={styles.infoValue}>{artist.tipo_usuario}</Text>
          </View>
        </View>
      </View>

      {artist.descricao && (
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Sobre</Text>
          <Text style={styles.descriptionText}>{artist.descricao}</Text>
        </View>
      )}
    </View>
  );

  const renderAgenda = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📅</Text>
      <Text style={styles.emptyStateTitle}>Sem eventos públicos</Text>
      <Text style={styles.emptyStateDescription}>
        Este artista não possui eventos públicos no momento.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner} />

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {artist.usuario.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.artistName}>{artist.usuario}</Text>
          <Text style={styles.artistType}>{artist.tipo_usuario}</Text>
          {artist.local_atuacao && (
            <Text style={styles.artistLocation}>📍 {artist.local_atuacao}</Text>
          )}

          <View
            style={[
              styles.statusBadge,
              artist.disponivel
                ? styles.statusAvailable
                : styles.statusUnavailable,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                artist.disponivel
                  ? styles.statusDotAvailable
                  : styles.statusDotUnavailable,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                artist.disponivel
                  ? styles.statusTextAvailable
                  : styles.statusTextUnavailable,
              ]}
            >
              {artist.disponivel ? "Disponível" : "Indisponível"}
            </Text>
          </View>

          {artist.descricao && (
            <Text style={styles.artistBio}>{artist.descricao}</Text>
          )}

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Eventos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5.0</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.proposalButton}
            onPress={handleSendProposal}
          >
            <Text style={styles.proposalButtonText}>Enviar Proposta</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "publicacoes" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("publicacoes")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "publicacoes" && styles.tabTextActive,
              ]}
            >
              Publicações
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "sobre" && styles.tabActive]}
            onPress={() => setActiveTab("sobre")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "sobre" && styles.tabTextActive,
              ]}
            >
              Sobre
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "agenda" && styles.tabActive]}
            onPress={() => setActiveTab("agenda")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "agenda" && styles.tabTextActive,
              ]}
            >
              Agenda
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "publicacoes" && renderPublicacoes()}
          {activeTab === "sobre" && renderSobre()}
          {activeTab === "agenda" && renderAgenda()}
        </View>
      </ScrollView>

      {/* Proposal Modal (placeholder) */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Enviar Proposta</Text>
            <Text style={styles.modalDescription}>
              Em breve você poderá enviar propostas diretamente pelo app.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  banner: {
    height: 200,
    backgroundColor: "#18181B",
  },
  profileSection: {
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: -50,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#000",
  },
  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "700",
  },
  artistName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  artistType: {
    fontSize: 12,
    color: "#666",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  artistLocation: {
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusAvailable: {
    backgroundColor: "#10B98120",
  },
  statusUnavailable: {
    backgroundColor: "#EF444420",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotAvailable: {
    backgroundColor: "#10B981",
  },
  statusDotUnavailable: {
    backgroundColor: "#EF4444",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextAvailable: {
    color: "#10B981",
  },
  statusTextUnavailable: {
    color: "#EF4444",
  },
  artistBio: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  stats: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  proposalButton: {
    backgroundColor: "#EC4899",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  proposalButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#3F3F46",
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#EC4899",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#EC4899",
  },
  tabContent: {
    padding: 20,
  },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  postCard: {
    width: "48%",
    backgroundColor: "#18181B",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
  },
  postImagePlaceholder: {
    backgroundColor: "#3F3F46",
    justifyContent: "center",
    alignItems: "center",
  },
  postImageText: {
    fontSize: 40,
  },
  postInfo: {
    padding: 12,
  },
  postTitle: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  postStats: {
    flexDirection: "row",
    gap: 12,
  },
  postStat: {
    fontSize: 11,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#18181B20",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#3F3F46",
    borderStyle: "dashed",
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  aboutSection: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: "#18181B",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3F3F46",
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
    width: 40,
    textAlign: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "700",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#fff",
  },
  descriptionCard: {
    backgroundColor: "#18181B",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#18181B",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: "#999",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
});
