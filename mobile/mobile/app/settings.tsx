import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { mockUser } from "@/constants/mockData";

type TabType = "account" | "security" | "notifications";

export default function SettingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [form, setForm] = useState({
    usuario: mockUser.usuario,
    email: mockUser.email,
    telefone: mockUser.telefone || "",
    local_atuacao: mockUser.local_atuacao || "",
  });

  const handleUpdate = () => {
    Alert.alert("Sucesso", "Configurações salvas com sucesso!");
  };

  const handleDeleteAccount = () => {
    Alert.alert("Deletar Conta", "Tem certeza? Esta ação é irreversível.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: () => {
          Alert.alert("Conta deletada", "Sua conta foi removida.");
        },
      },
    ]);
  };

  const renderAccount = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {mockUser.usuario.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Alterar foto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome de usuário</Text>
          <TextInput
            style={styles.input}
            value={form.usuario}
            onChangeText={(text) => setForm({ ...form, usuario: text })}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={form.telefone}
            onChangeText={(text) => setForm({ ...form, telefone: text })}
            keyboardType="phone-pad"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Localização</Text>
          <TextInput
            style={styles.input}
            value={form.local_atuacao}
            onChangeText={(text) => setForm({ ...form, local_atuacao: text })}
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerZoneTitle}>Zona de Perigo</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Deletar Conta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Atalhos Rápidos</Text>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push("/reviews")}
        >
          <Text style={styles.quickActionIcon}>⭐</Text>
          <Text style={styles.quickActionText}>Minhas Avaliações</Text>
          <Text style={styles.quickActionArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push("/history")}
        >
          <Text style={styles.quickActionIcon}>📋</Text>
          <Text style={styles.quickActionText}>Histórico</Text>
          <Text style={styles.quickActionArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push("/advanced-search")}
        >
          <Text style={styles.quickActionIcon}>🔍</Text>
          <Text style={styles.quickActionText}>Busca Avançada</Text>
          <Text style={styles.quickActionArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSecurity = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Segurança</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha Atual</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Digite sua senha atual"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Digite a nova senha"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Confirme a nova senha"
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Atualizar Senha</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoCardIcon}>🔒</Text>
        <Text style={styles.infoCardText}>
          Use uma senha forte com pelo menos 8 caracteres, incluindo letras,
          números e símbolos.
        </Text>
      </View>
    </View>
  );

  const renderNotifications = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Notificações</Text>
      </View>

      <View style={styles.notificationsList}>
        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Novas Propostas</Text>
            <Text style={styles.notificationDesc}>
              Receba notificações de novas propostas
            </Text>
          </View>
          <View style={styles.toggle}>
            <View style={styles.toggleActive} />
          </View>
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Mensagens</Text>
            <Text style={styles.notificationDesc}>
              Notificações de novas mensagens
            </Text>
          </View>
          <View style={styles.toggle}>
            <View style={styles.toggleActive} />
          </View>
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Atualizações</Text>
            <Text style={styles.notificationDesc}>
              Novidades e atualizações do app
            </Text>
          </View>
          <View style={styles.toggleInactive} />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Marketing</Text>
            <Text style={styles.notificationDesc}>
              Promoções e ofertas especiais
            </Text>
          </View>
          <View style={styles.toggleInactive} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Tabs - Horizontal para mobile */}
      {!isTablet && (
        <View style={styles.tabsHorizontal}>
          <TouchableOpacity
            style={[
              styles.tabButtonMobile,
              activeTab === "account" && styles.tabButtonMobileActive,
            ]}
            onPress={() => setActiveTab("account")}
          >
            <Text
              style={[
                styles.tabTextMobile,
                activeTab === "account" && styles.tabTextMobileActive,
              ]}
            >
              Conta
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButtonMobile,
              activeTab === "security" && styles.tabButtonMobileActive,
            ]}
            onPress={() => setActiveTab("security")}
          >
            <Text
              style={[
                styles.tabTextMobile,
                activeTab === "security" && styles.tabTextMobileActive,
              ]}
            >
              Segurança
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButtonMobile,
              activeTab === "notifications" && styles.tabButtonMobileActive,
            ]}
            onPress={() => setActiveTab("notifications")}
          >
            <Text
              style={[
                styles.tabTextMobile,
                activeTab === "notifications" && styles.tabTextMobileActive,
              ]}
            >
              Notif.
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.content, isTablet && styles.contentTablet]}>
        {/* Sidebar Tabs - Apenas em tablet */}
        {isTablet && (
          <View style={styles.sidebar}>
            <TouchableOpacity
              style={[
                styles.sidebarTab,
                activeTab === "account" && styles.sidebarTabActive,
              ]}
              onPress={() => setActiveTab("account")}
            >
              <Text
                style={[
                  styles.sidebarTabText,
                  activeTab === "account" && styles.sidebarTabTextActive,
                ]}
              >
                Conta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sidebarTab,
                activeTab === "security" && styles.sidebarTabActive,
              ]}
              onPress={() => setActiveTab("security")}
            >
              <Text
                style={[
                  styles.sidebarTabText,
                  activeTab === "security" && styles.sidebarTabTextActive,
                ]}
              >
                Segurança
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sidebarTab,
                activeTab === "notifications" && styles.sidebarTabActive,
              ]}
              onPress={() => setActiveTab("notifications")}
            >
              <Text
                style={[
                  styles.sidebarTabText,
                  activeTab === "notifications" && styles.sidebarTabTextActive,
                ]}
              >
                Notificações
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "account" && renderAccount()}
          {activeTab === "security" && renderSecurity()}
          {activeTab === "notifications" && renderNotifications()}
        </ScrollView>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "#18181B",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  contentTablet: {
    flexDirection: "row",
  },
  tabsHorizontal: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#18181B",
  },
  tabButtonMobile: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonMobileActive: {
    borderBottomColor: "#EC4899",
  },
  tabTextMobile: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  tabTextMobileActive: {
    color: "#EC4899",
    fontWeight: "700",
  },
  sidebar: {
    width: 120,
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: "#18181B",
  },
  sidebarTab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  sidebarTabActive: {
    backgroundColor: "#18181B",
    borderLeftWidth: 2,
    borderLeftColor: "#EC4899",
  },
  sidebarTabText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  sidebarTabTextActive: {
    color: "#fff",
  },
  mainContent: {
    flex: 1,
  },
  section: {
    padding: 20,
    maxWidth: "100%",
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#18181B",
    paddingBottom: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
    flexWrap: "wrap",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    color: "#EC4899",
    fontSize: 14,
    fontWeight: "600",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  dangerZone: {
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#18181B",
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: "#EF444420",
    borderWidth: 1,
    borderColor: "#EF4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: "#18181B",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3F3F46",
    marginTop: 24,
    flexDirection: "row",
    gap: 12,
  },
  infoCardIcon: {
    fontSize: 24,
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: "#999",
    lineHeight: 18,
  },
  notificationsList: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#18181B",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3F3F46",
    marginBottom: 8,
  },
  notificationInfo: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 3,
  },
  quickActionsSection: {
    marginTop: 24,
    paddingHorizontal: 0,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181B",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3F3F46",
    marginBottom: 8,
  },
  quickActionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  quickActionArrow: {
    fontSize: 16,
    color: "#EC4899",
  },
  notificationDesc: {
    fontSize: 12,
    color: "#666",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    padding: 2,
    justifyContent: "center",
    alignItems: "flex-end",
    flexShrink: 0,
  },
  toggleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  toggleInactive: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3F3F46",
  },
});
