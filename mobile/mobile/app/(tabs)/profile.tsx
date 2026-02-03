import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { mockUser, mockPosts } from "@/constants/mockData";
import { useRouter } from "expo-router";

type TabType = "publicacoes" | "agenda" | "sobre";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(mockUser);
  const [activeTab, setActiveTab] = useState<TabType>("publicacoes");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    usuario: user.usuario,
    telefone: user.telefone || "",
    local_atuacao: user.local_atuacao || "",
    descricao: user.descricao || "",
  });

  const handleSave = () => {
    setUser({ ...user, ...editForm });
    setIsEditing(false);
  };

  const renderPublicacoes = () => (
    <View>
      {/* Create Post Card */}
      <TouchableOpacity style={styles.createPostCard}>
        <View style={styles.createPostIcon}>
          <Text style={styles.createPostIconText}>+</Text>
        </View>
        <Text style={styles.createPostText}>Criar nova publicação</Text>
      </TouchableOpacity>

      {/* Posts Grid */}
      <View style={styles.postsGrid}>
        {mockPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={[styles.postImage, styles.postImagePlaceholder]}>
              <Text style={styles.postImageText}>📷</Text>
            </View>
            <View style={styles.postInfo}>
              <Text style={styles.postTitle} numberOfLines={2}>
                {post.title}
              </Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>❤️ {post.likes}</Text>
                <Text style={styles.postStat}>💬 {post.comments}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAgenda = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📅</Text>
      <Text style={styles.emptyStateTitle}>Agenda vazia</Text>
      <Text style={styles.emptyStateDescription}>
        Você ainda não tem eventos agendados.
      </Text>
    </View>
  );

  const renderSobre = () => (
    <View style={styles.aboutSection}>
      <View style={styles.infoCard}>
        <View key="email" style={styles.infoItem}>
          <Text style={styles.infoIcon}>📧</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>E-MAIL</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </View>
        <View key="telefone" style={styles.infoItem}>
          <Text style={styles.infoIcon}>📱</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>TELEFONE</Text>
            <Text style={styles.infoValue}>
              {user.telefone || "Não informado"}
            </Text>
          </View>
        </View>
        <View key="localizacao" style={styles.infoItem}>
          <Text style={styles.infoIcon}>📍</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>LOCALIZAÇÃO</Text>
            <Text style={styles.infoValue}>
              {user.local_atuacao || "Não informado"}
            </Text>
          </View>
        </View>
        <View key="tipo" style={styles.infoItem}>
          <Text style={styles.infoIcon}>💼</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>TIPO</Text>
            <Text style={styles.infoValue}>{user.tipo_usuario}</Text>
          </View>
        </View>
      </View>

      {user.descricao && (
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Sobre</Text>
          <Text style={styles.descriptionText}>{user.descricao}</Text>
        </View>
      )}
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
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner} />

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.usuario.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.input}
                value={editForm.usuario}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, usuario: text })
                }
                placeholder="Nome de usuário"
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.input}
                value={editForm.telefone}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, telefone: text })
                }
                placeholder="Telefone"
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.input}
                value={editForm.local_atuacao}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, local_atuacao: text })
                }
                placeholder="Localização"
                placeholderTextColor="#666"
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.descricao}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, descricao: text })
                }
                placeholder="Descrição"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.userName}>{user.usuario}</Text>
              <Text style={styles.userType}>{user.tipo_usuario}</Text>
              {user.local_atuacao && (
                <Text style={styles.userLocation}>📍 {user.local_atuacao}</Text>
              )}
              {user.descricao && (
                <Text style={styles.userBio}>{user.descricao}</Text>
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
                style={styles.editProfileButton}
                onPress={() => router.push("/edit-profile")}
              >
                <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Tabs */}
        {!isEditing && (
          <>
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
            </View>

            {/* Tab Content */}
            <View style={styles.tabContent}>
              {activeTab === "publicacoes" && renderPublicacoes()}
              {activeTab === "agenda" && renderAgenda()}
              {activeTab === "sobre" && renderSobre()}
            </View>
          </>
        )}
      </ScrollView>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  settingsIcon: {
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
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userType: {
    fontSize: 12,
    color: "#666",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  userLocation: {
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
  },
  userBio: {
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
  editProfileButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  editForm: {
    width: "100%",
    gap: 12,
  },
  input: {
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#3F3F46",
  },
  saveButton: {
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#000",
    fontSize: 14,
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
  createPostCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#3F3F46",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#18181B20",
  },
  createPostIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  createPostIconText: {
    fontSize: 24,
    color: "#fff",
  },
  createPostText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
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
});
