import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mockProposals } from "@/constants/mockData";

type ProposalStatus = "pendente" | "aceito" | "recusado";

export default function ProposalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Encontrar a proposta pelo ID
  const proposal = mockProposals.find(
    (p) => p.id_contrato === parseInt(id as string),
  );
  const [status, setStatus] = useState<ProposalStatus>(
    (proposal?.status as ProposalStatus) || "pendente",
  );

  if (!proposal) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Proposta não encontrada</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleAccept = () => {
    Alert.alert(
      "Sucesso",
      "Proposta aceita! Verifique seus dados de contato.",
      [
        {
          text: "OK",
          onPress: () => {
            setStatus("aceito");
          },
        },
      ],
    );
  };

  const handleReject = () => {
    Alert.alert(
      "Recusar Proposta",
      "Tem certeza que deseja recusar esta proposta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Recusar",
          style: "destructive",
          onPress: () => {
            setStatus("recusado");
            Alert.alert("Proposta recusada");
          },
        },
      ],
    );
  };

  const handleContact = () => {
    Alert.alert("Contato", `Enviar mensagem para ${proposal.contratante}`);
  };

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case "aceito":
        return "#10B981";
      case "recusado":
        return "#EF4444";
      case "pendente":
      default:
        return "#F59E0B";
    }
  };

  const getStatusLabel = (status: ProposalStatus) => {
    switch (status) {
      case "aceito":
        return "Aceito";
      case "recusado":
        return "Recusado";
      case "pendente":
      default:
        return "Pendente";
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          <Text style={styles.headerTitle}>Detalhes da Proposta</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Status Banner */}
        <View
          style={[
            styles.statusBanner,
            { backgroundColor: getStatusColor(status) + "20" },
          ]}
        >
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel(status)}</Text>
          </View>
        </View>

        {/* Proposal Info Card */}
        <View style={styles.card}>
          <Text style={styles.proposalTitle}>{proposal.titulo}</Text>

          {/* Date and Time */}
          <View style={styles.infoGroup}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📅</Text>
              <View>
                <Text style={styles.infoLabel}>Data</Text>
                <Text style={styles.infoValue}>
                  {formatDate(proposal.data)}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⏰</Text>
              <View>
                <Text style={styles.infoLabel}>Horário</Text>
                <Text style={styles.infoValue}>{proposal.hora}</Text>
              </View>
            </View>
          </View>

          {/* Value */}
          <View style={styles.valueCard}>
            <Text style={styles.valueLabel}>Valor da Proposta</Text>
            <Text style={styles.valueAmount}>{proposal.valor}</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descriptionText}>{proposal.descricao}</Text>
          </View>
        </View>

        {/* Contractor Info Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações do Contratante</Text>

          <View style={styles.contractorInfo}>
            <View style={styles.contractorAvatar}>
              <Text style={styles.contractorIcon}>👤</Text>
            </View>
            <View style={styles.contractorDetails}>
              <Text style={styles.contractorName}>{proposal.contratante}</Text>
              <Text style={styles.contractorType}>Cliente</Text>
            </View>
          </View>
        </View>

        {/* Additional Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalhes Adicionais</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🎯</Text>
              <Text style={styles.detailLabel}>Tipo de Evento</Text>
              <Text style={styles.detailValue}>Show/Apresentação</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>👥</Text>
              <Text style={styles.detailLabel}>Público</Text>
              <Text style={styles.detailValue}>Variado</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🎵</Text>
              <Text style={styles.detailLabel}>Duração</Text>
              <Text style={styles.detailValue}>2 horas</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailLabel}>Local</Text>
              <Text style={styles.detailValue}>A confirmar</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        {status === "pendente" && (
          <View style={styles.actionsCard}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>✓ Aceitar Proposta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleReject}
            >
              <Text style={styles.rejectButtonText}>✕ Recusar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContact}
            >
              <Text style={styles.contactButtonText}>💬 Entrar em Contato</Text>
            </TouchableOpacity>
          </View>
        )}

        {status !== "pendente" && (
          <View style={styles.actionsCard}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContact}
            >
              <Text style={styles.contactButtonText}>💬 Entrar em Contato</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backToListButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backToListText}>Voltar para Propostas</Text>
            </TouchableOpacity>
          </View>
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
  headerSpacer: {
    width: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#999",
    marginBottom: 20,
  },
  statusBanner: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#18181B",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  proposalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
  },
  infoGroup: {
    gap: 16,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  valueCard: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3F3F46",
    marginBottom: 20,
  },
  valueLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 8,
  },
  valueAmount: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FCD34D",
  },
  descriptionSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  contractorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  contractorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3F3F46",
  },
  contractorIcon: {
    fontSize: 30,
  },
  contractorDetails: {
    flex: 1,
  },
  contractorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  contractorType: {
    fontSize: 12,
    color: "#999",
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailIcon: {
    fontSize: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    gap: 12,
  },
  acceptButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  rejectButton: {
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  contactButton: {
    backgroundColor: "#EC4899",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  backToListButton: {
    backgroundColor: "#3F3F46",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  backToListText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
