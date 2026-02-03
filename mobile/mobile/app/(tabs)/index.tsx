import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { mockProposals, mockUser } from "@/constants/mockData";

interface Proposal {
  id_contrato: number;
  titulo: string;
  data: string;
  hora: string;
  valor: string;
  status: string;
  contratante: string;
  descricao: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProposals(mockProposals);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aceito":
        return "#10B981";
      case "recusado":
        return "#EF4444";
      default:
        return "#F59E0B";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "aceito":
        return "Aceito";
      case "recusado":
        return "Recusado";
      default:
        return "Pendente";
    }
  };

  const handleAccept = (id: number) => {
    setProposals(
      proposals.map((p) =>
        p.id_contrato === id ? { ...p, status: "aceito" } : p,
      ),
    );
  };

  const handleDecline = (id: number) => {
    setProposals(
      proposals.map((p) =>
        p.id_contrato === id ? { ...p, status: "recusado" } : p,
      ),
    );
  };

  const renderProposal = ({ item }: { item: Proposal }) => (
    <TouchableOpacity
      style={styles.proposalCard}
      onPress={() => router.push(`/proposal/${item.id_contrato}`)}
    >
      <View style={styles.proposalHeader}>
        <Text style={styles.proposalTitle}>{item.titulo}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.contratante}>📍 {item.contratante}</Text>
      <Text style={styles.descricao}>{item.descricao}</Text>

      <View style={styles.proposalDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Data</Text>
          <Text style={styles.detailValue}>
            {new Date(item.data).toLocaleDateString("pt-BR")}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Horário</Text>
          <Text style={styles.detailValue}>{item.hora}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Valor</Text>
          <Text style={styles.detailValue}>{item.valor}</Text>
        </View>
      </View>

      {item.status === "pendente" && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleDecline(item.id_contrato)}
          >
            <Text style={styles.declineButtonText}>Recusar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAccept(item.id_contrato)}
          >
            <Text style={styles.acceptButtonText}>Aceitar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {mockUser.usuario}! 👋</Text>
          <Text style={styles.userType}>{mockUser.tipo_usuario}</Text>
        </View>
        <TouchableOpacity style={styles.avatar}>
          <Text style={styles.avatarText}>
            {mockUser.usuario.substring(0, 2).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <View style={styles.dot} />
          <Text style={styles.bannerBadgeText}>ATIVO</Text>
        </View>
        <Text style={styles.bannerTitle}>Você está recebendo propostas!</Text>
        <Text style={styles.bannerDescription}>
          Mantenha seu perfil atualizado para receber mais oportunidades
        </Text>
      </View>

      {/* Proposals Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Propostas Recebidas</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/proposals-sent")}
        >
          <Text style={styles.viewAllButtonText}>Enviadas →</Text>
        </TouchableOpacity>
      </View>

      {proposals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>😕</Text>
          <Text style={styles.emptyStateTitle}>Nenhuma proposta</Text>
          <Text style={styles.emptyStateDescription}>
            Mantenha seu perfil atualizado para receber ofertas.
          </Text>
        </View>
      ) : (
        <FlatList
          data={proposals}
          renderItem={renderProposal}
          keyExtractor={(item) => item.id_contrato.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userType: {
    fontSize: 12,
    color: "#666",
    textTransform: "capitalize",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  banner: {
    backgroundColor: "#18181B",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3F3F46",
    marginBottom: 24,
  },
  bannerBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FCD34D20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FCD34D",
    marginRight: 6,
  },
  bannerBadgeText: {
    color: "#FCD34D",
    fontSize: 10,
    fontWeight: "700",
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: "#999",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EC489920",
    borderRadius: 8,
  },
  viewAllButtonText: {
    color: "#EC4899",
    fontSize: 12,
    fontWeight: "700",
  },
  badge: {
    backgroundColor: "#EC489920",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EC489940",
  },
  badgeText: {
    color: "#EC4899",
    fontSize: 11,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  proposalCard: {
    backgroundColor: "#18181B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  proposalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  contratante: {
    fontSize: 14,
    color: "#EC4899",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
    lineHeight: 20,
  },
  proposalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#3F3F46",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  declineButton: {
    backgroundColor: "#3F3F46",
  },
  acceptButton: {
    backgroundColor: "#fff",
  },
  declineButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  acceptButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginHorizontal: 20,
    backgroundColor: "#18181B20",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#3F3F46",
    borderStyle: "dashed",
  },
  emptyStateText: {
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
});
