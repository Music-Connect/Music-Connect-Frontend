import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import api from "@/services/api";

type ProposalStatus = "pendente" | "aceita" | "rejeitada";

export default function ProposalSentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (id) {
        loadProposal();
      }
    }, [id]),
  );

  const loadProposal = async () => {
    try {
      setLoading(true);
      const response = await api.listarMinhasPropostas();
      if (response.success && response.data?.propostas) {
        const found = response.data.propostas.find(
          (p: any) => p.id_proposta === id,
        );
        if (found) {
          setProposal(found);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar proposta:", error);
      Alert.alert("Erro", "Falha ao carregar proposta");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </View>
    );
  }

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
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const [status] = useState<ProposalStatus>(
    (proposal?.status as ProposalStatus) || "pendente",
  );

  if (!proposal || !artist) {
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

  const handleCancel = () => {
    Alert.alert(
      "Cancelar Proposta",
      "Tem certeza que deseja cancelar esta proposta enviada?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Proposta cancelada",
              "Proposta cancelada com sucesso",
              [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ],
            );
          },
        },
      ],
    );
  };

  const handleContact = () => {
    Alert.alert("Enviar Mensagem", `Enviar mensagem para ${artist.usuario}`);
  };

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

        {/* Proposal Info */}
        <View style={styles.card}>
          <Text style={styles.proposalTitle}>{proposal.titulo}</Text>

          <View style={styles.infoGroup}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📅</Text>
              <View>
                <Text style={styles.infoLabel}>Data da Apresentação</Text>
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

          <View style={styles.valueCard}>
            <Text style={styles.valueLabel}>Valor da Proposta</Text>
            <Text style={styles.valueAmount}>{proposal.valor}</Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descriptionText}>{proposal.descricao}</Text>
          </View>

          <View style={styles.sentInfoSection}>
            <Text style={styles.sectionTitle}>Informações de Envio</Text>
            <Text style={styles.sentDate}>
              📤 Enviado em{" "}
              {new Date(proposal.dataEnvio).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Artist Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações do Artista</Text>

          <View style={styles.artistInfo}>
            <View style={styles.artistAvatar}>
              <Text style={styles.artistIcon}>🎤</Text>
            </View>
            <View style={styles.artistDetails}>
              <Text style={styles.artistName}>{artist.usuario}</Text>
              <Text style={styles.artistType}>
                {artist.tipo_usuario === "banda" ? "🎸 Banda" : "🎵 Artista"}
              </Text>
              <Text style={styles.artistLocation}>
                📍 {artist.local_atuacao}
              </Text>
              {artist.disponivel && (
                <View style={styles.disponibilidadeBadge}>
                  <Text style={styles.disponibilidadeText}>Disponível</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.artistDescription}>{artist.descricao}</Text>
        </View>

        {/* Additional Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Status da Proposta</Text>

          {status === "pendente" && (
            <View style={styles.statusInfo}>
              <Text style={styles.statusInfoIcon}>⏳</Text>
              <View style={styles.statusInfoContent}>
                <Text style={styles.statusInfoTitle}>Aguardando Resposta</Text>
                <Text style={styles.statusInfoText}>
                  O artista ainda não respondeu sua proposta
                </Text>
              </View>
            </View>
          )}

          {status === "aceito" && (
            <View style={styles.statusInfo}>
              <Text style={styles.statusInfoIcon}>✅</Text>
              <View style={styles.statusInfoContent}>
                <Text style={styles.statusInfoTitle}>Proposta Aceita!</Text>
                <Text style={styles.statusInfoText}>
                  Parabéns! O artista aceitou sua proposta
                </Text>
              </View>
            </View>
          )}

          {status === "recusado" && (
            <View style={styles.statusInfo}>
              <Text style={styles.statusInfoIcon}>❌</Text>
              <View style={styles.statusInfoContent}>
                <Text style={styles.statusInfoTitle}>Proposta Recusada</Text>
                <Text style={styles.statusInfoText}>
                  O artista recusou sua proposta
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContact}
          >
            <Text style={styles.contactButtonText}>💬 Entrar em Contato</Text>
          </TouchableOpacity>

          {status === "pendente" && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar Proposta</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.backToListButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToListText}>Voltar para Propostas</Text>
          </TouchableOpacity>
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
  descriptionText: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  sentInfoSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#3F3F46",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  sentDate: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  artistInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  artistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3F3F46",
  },
  artistIcon: {
    fontSize: 30,
  },
  artistDetails: {
    flex: 1,
    gap: 4,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  artistType: {
    fontSize: 12,
    color: "#999",
  },
  artistLocation: {
    fontSize: 12,
    color: "#999",
  },
  disponibilidadeBadge: {
    backgroundColor: "#10B98120",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  disponibilidadeText: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "600",
  },
  artistDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  statusInfo: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: "flex-start",
  },
  statusInfoIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  statusInfoContent: {
    flex: 1,
    gap: 4,
  },
  statusInfoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  statusInfoText: {
    fontSize: 12,
    color: "#999",
    lineHeight: 16,
  },
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    gap: 12,
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
  cancelButton: {
    backgroundColor: "#EF444420",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  cancelButtonText: {
    color: "#EF4444",
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
