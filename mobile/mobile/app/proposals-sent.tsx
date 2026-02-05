import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import api from "@/services/api";

type ProposalStatus = "pendente" | "aceita" | "rejeitada" | "concluida";
type FilterStatus = "todos" | "pendente" | "aceita" | "rejeitada";

export default function ProposalsSentScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>("todos");
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadProposals();
    }, []),
  );

  const loadProposals = async () => {
    try {
      setLoading(true);
      const response = await api.listarMinhasPropostas();
      if (response.success && response.data?.propostas) {
        // Filter only sent proposals (id_contratante is current user)
        const sentProposals = response.data.propostas.filter(
          (p: any) => p.tipo_proposta === "enviada",
        );
        setProposals(sentProposals);
      }
    } catch (error) {
      console.error("Erro ao carregar propostas:", error);
      Alert.alert("Erro", "Falha ao carregar propostas");
    } finally {
      setLoading(false);
    }
  };

  const filteredProposals = proposals.filter((p) =>
    filter === "todos" ? true : p.status === filter,
  );

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case "aceita":
        return "#10B981";
      case "rejeitada":
        return "#EF4444";
      case "concluida":
        return "#8B5CF6";
      case "pendente":
      default:
        return "#F59E0B";
    }
  };

  const getStatusLabel = (status: ProposalStatus) => {
    switch (status) {
      case "aceita":
        return "Aceita";
      case "rejeitada":
        return "Rejeitada";
      case "concluida":
        return "Concluída";
      case "pendente":
      default:
        return "Pendente";
    }
  };

  const handleCancel = (id: string) => {
    Alert.alert(
      "Cancelar Proposta",
      "Tem certeza que deseja cancelar esta proposta?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              // Nota: método updatePropostaStatus não existe na API
              // setProposals(proposals.filter((p) => p.id_proposta !== id));
              Alert.alert(
                "Info",
                "Funcionalidade de cancelamento será implementada no backend",
              );
            } catch {
              Alert.alert("Erro", "Falha ao cancelar proposta");
            }
          },
        },
      ],
    );
  };

  const renderProposal = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.proposalCard}
      onPress={() => router.push(`/proposal-sent/${item.id_proposta}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleSection}>
          <Text style={styles.proposalTitle} numberOfLines={2}>
            {item.titulo}
          </Text>
          <Text style={styles.artistName}>👤 {item.artista}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusLabel, { color: getStatusColor(item.status) }]}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <View>
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>
                {new Date(item.data).toLocaleDateString("pt-BR")}
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⏰</Text>
            <View>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>{item.hora}</Text>
            </View>
          </View>
        </View>

        <View style={styles.valueSection}>
          <Text style={styles.valueLabel}>Valor</Text>
          <Text style={styles.valueAmount}>{item.valor}</Text>
        </View>

        <Text style={styles.descricao} numberOfLines={2}>
          {item.descricao}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.sentDate}>
            Enviado em {new Date(item.dataEnvio).toLocaleDateString("pt-BR")}
          </Text>
          {item.status === "pendente" && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item.id_proposta)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Propostas Enviadas</Text>
        <View style={styles.spacer} />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{proposals.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
            {proposals.filter((p) => p.status === "pendente").length}
          </Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#10B981" }]}>
            {proposals.filter((p) => p.status === "aceito").length}
          </Text>
          <Text style={styles.statLabel}>Aceitas</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {(["todos", "pendente", "aceita", "rejeitada"] as FilterStatus[]).map(
            (f) => {
              let filterColor = "#999";
              let filterBgColor = "#18181B";

              if (filter === f) {
                if (f === "pendente") {
                  filterColor = "#F59E0B";
                  filterBgColor = "#F59E0B20";
                } else if (f === "aceita") {
                  filterColor = "#10B981";
                  filterBgColor = "#10B98120";
                } else if (f === "rejeitada") {
                  filterColor = "#EF4444";
                  filterBgColor = "#EF444420";
                } else {
                  filterColor = "#EC4899";
                  filterBgColor = "#EC489920";
                }
              }

              return (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: filterBgColor,
                      borderColor: filterColor,
                    },
                  ]}
                  onPress={() => setFilter(f)}
                >
                  <Text style={[styles.filterText, { color: filterColor }]}>
                    {f === "todos"
                      ? "Todos"
                      : f === "pendente"
                        ? "⏳ Pendentes"
                        : f === "aceita"
                          ? "✅ Aceitas"
                          : "❌ Rejeitadas"}
                  </Text>
                </TouchableOpacity>
              );
            },
          )}
        </ScrollView>
      </View>

      {/* Proposals List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : filteredProposals.length > 0 ? (
        <FlatList
          data={filteredProposals}
          renderItem={renderProposal}
          keyExtractor={(item) => item.id_proposta.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>
            Nenhuma proposta nesta categoria
          </Text>
          <Text style={styles.emptyText}>
            {filter === "todos"
              ? "Envie uma proposta para um artista para começar!"
              : "Você não tem propostas com este status"}
          </Text>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
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
  spacer: {
    width: 40,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#18181B",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#EC4899",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContainer: {
    flexGrow: 0,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    marginVertical: 4,
  },
  filterButtonActive: {
    backgroundColor: "#EC4899",
    borderColor: "#EC4899",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  proposalCard: {
    backgroundColor: "#18181B",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3F3F46",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3F3F46",
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  proposalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 12,
    color: "#999",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  valueSection: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
  },
  valueLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
  },
  valueAmount: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FCD34D",
  },
  descricao: {
    fontSize: 12,
    color: "#999",
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#3F3F46",
  },
  sentDate: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EF444420",
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 11,
    color: "#EF4444",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
