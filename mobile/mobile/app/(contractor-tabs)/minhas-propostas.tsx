import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import api from "@/services/api";

interface Proposal {
  id_proposta: string;
  titulo?: string;
  descricao?: string;
  valor_oferecido?: number;
  valor?: string;
  status: "pendente" | "aceita" | "rejeitada" | "concluida";
  data_criacao?: string;
  data?: string;
  hora?: string;
  contratante?: string;
  id_contratante?: string;
  id_artista?: string;
  tipo_proposta?: "recebida" | "enviada";
}

interface User {
  id_usuario?: string;
  usuario?: string;
  email?: string;
  tipo_usuario?: string;
}

export default function ContractorMinhasPropostasScreen() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Check if user has token first
      const hasToken = await api.hasToken();
      if (!hasToken) {
        router.replace("/login");
        return;
      }

      setLoading(true);

      const [userRes, proposalsRes] = await Promise.all([
        api.getCurrentUser(),
        api.listarMinhasPropostas(),
      ]);

      if (userRes.success && userRes.data?.user) {
        setUser(userRes.data.user as User);
      }

      if (proposalsRes.success && proposalsRes.data?.propostas) {
        setProposals(proposalsRes.data.propostas);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if (error instanceof Error && error.message.includes("Token")) {
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          // Check if user has token first
          const hasToken = await api.hasToken();
          if (!hasToken) {
            router.replace("/login");
            return;
          }

          setLoading(true);

          const [userRes, proposalsRes] = await Promise.all([
            api.getCurrentUser(),
            api.listarMinhasPropostas(),
          ]);

          if (userRes.success && userRes.data?.user) {
            setUser(userRes.data.user as User);
          }

          if (proposalsRes.success && proposalsRes.data?.propostas) {
            setProposals(proposalsRes.data.propostas);
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          if (error instanceof Error && error.message.includes("Token")) {
            router.replace("/login");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [router]),
  );

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "aceita":
        return styles.statusBadgeAccepted;
      case "rejeitada":
        return styles.statusBadgeRejected;
      case "concluida":
        return styles.statusBadgeCompleted;
      default:
        return styles.statusBadgePending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "aceita":
        return "Aceita";
      case "rejeitada":
        return "Rejeitada";
      case "concluida":
        return "Concluída";
      default:
        return "Pendente";
    }
  };

  const renderProposalCard = ({ item }: { item: Proposal }) => {
    return (
      <TouchableOpacity
        style={styles.proposalCard}
        onPress={() => router.push(`/proposal/${item.id_proposta}`)}
      >
        <View style={styles.proposalHeader}>
          <View style={styles.proposalTitleContainer}>
            <Text style={styles.proposalTitle}>
              {item.titulo || "Sem título"}
            </Text>
            <View
              style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}
            >
              <Text style={styles.statusBadgeText}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
          {item.valor_oferecido != null && (
            <Text style={styles.proposalValue}>
              R$ {Number(item.valor_oferecido).toFixed(2)}
            </Text>
          )}
        </View>

        {item.descricao && (
          <Text style={styles.proposalDescription} numberOfLines={2}>
            {item.descricao}
          </Text>
        )}

        <View style={styles.proposalFooter}>
          <View style={styles.proposalInfo}>
            {item.data && (
              <Text style={styles.proposalInfoText}>📅 {item.data}</Text>
            )}
            {item.hora && (
              <Text style={styles.proposalInfoText}>🕐 {item.hora}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const countByStatus = (status: string) => {
    return proposals.filter((p) => p.status === status).length;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerHeader}>
            <View>
              <Text style={styles.welcomeText}>Minhas Propostas</Text>
              <Text style={styles.userName}>
                {user?.usuario || "Contratante"}
              </Text>
            </View>
            <View style={styles.statusBadgeActive}>
              <Text style={styles.statusBadgeActiveText}>ATIVO</Text>
            </View>
          </View>
          <Text style={styles.userType}>Contratante</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{proposals.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {countByStatus("pendente")}
            </Text>
            <Text style={styles.summaryLabel}>Pendentes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{countByStatus("aceita")}</Text>
            <Text style={styles.summaryLabel}>Aceitas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {countByStatus("concluida")}
            </Text>
            <Text style={styles.summaryLabel}>Concluídas</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/create-proposal")}
          >
            <Text style={styles.quickActionButtonText}>+ Nova Proposta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickActionButton,
              styles.quickActionButtonSecondary,
            ]}
            onPress={() => router.push("/proposals-sent")}
          >
            <Text style={styles.quickActionButtonTextSecondary}>Ver Todas</Text>
          </TouchableOpacity>
        </View>

        {/* Proposals List */}
        <View style={styles.proposalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Propostas Enviadas</Text>
          </View>

          {proposals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nenhuma proposta encontrada
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Comece criando uma nova proposta para artistas
              </Text>
            </View>
          ) : (
            <FlatList
              data={proposals}
              renderItem={renderProposalCard}
              keyExtractor={(item) => item.id_proposta.toString()}
              scrollEnabled={false}
            />
          )}
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
  scrollContent: {
    paddingBottom: 100,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
  },

  // Banner
  banner: {
    backgroundColor: "#1A1A1A",
    padding: 24,
    margin: 16,
    borderRadius: 12,
    marginTop: 60,
  },
  bannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  welcomeText: {
    color: "#999",
    fontSize: 14,
  },
  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  statusBadgeActive: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActiveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  userType: {
    color: "#666",
    fontSize: 14,
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  summaryNumber: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  summaryLabel: {
    color: "#666",
    fontSize: 11,
    marginTop: 4,
  },

  // Quick Actions
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: "#EC4899",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  quickActionButtonSecondary: {
    backgroundColor: "#1A1A1A",
  },
  quickActionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  quickActionButtonTextSecondary: {
    color: "#EC4899",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Proposals Section
  proposalsSection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllButton: {
    color: "#EC4899",
    fontSize: 14,
  },

  // Proposal Card
  proposalCard: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  proposalHeader: {
    marginBottom: 8,
  },
  proposalTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  proposalTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusBadgePending: {
    backgroundColor: "#FCD34D",
  },
  statusBadgeAccepted: {
    backgroundColor: "#22C55E",
  },
  statusBadgeRejected: {
    backgroundColor: "#EF4444",
  },
  statusBadgeCompleted: {
    backgroundColor: "#3B82F6",
  },
  statusBadgeText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "bold",
  },
  proposalValue: {
    color: "#EC4899",
    fontSize: 20,
    fontWeight: "bold",
  },
  proposalDescription: {
    color: "#999",
    fontSize: 14,
    marginBottom: 12,
  },
  proposalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  proposalInfo: {
    flexDirection: "row",
    gap: 12,
  },
  proposalInfoText: {
    color: "#666",
    fontSize: 12,
  },
  proposalActions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  rejectButton: {
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
  },
  emptyStateText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
});
