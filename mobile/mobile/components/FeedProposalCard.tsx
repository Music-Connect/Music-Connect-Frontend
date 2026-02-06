import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share } from "react-native";

interface FeedProposalCardProps {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  data?: string;
  hora?: string;
  local?: string;
  tipoEvento?: string;
  contratanteNome?: string;
  duracao?: number;
  publicoEsperado?: number;
  onPress: () => void;
}

export default function FeedProposalCard({
  id,
  titulo,
  descricao,
  valor,
  data,
  hora,
  local,
  tipoEvento,
  contratanteNome,
  duracao,
  publicoEsperado,
  onPress,
}: FeedProposalCardProps) {
  const [isInterested, setIsInterested] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleInterested = () => {
    setIsInterested(!isInterested);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎵 Oportunidade no Music Connect!\n\n${titulo}\n💰 R$ ${Number(valor || 0).toFixed(0)}\n📍 ${local || "Local a definir"}\n\nBaixe o app e candidate-se!`,
        title: titulo,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return "";
    // Simple time ago format
    return "há 2h";
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Header with contractor info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(contratanteNome || "C")[0].toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.contratanteName}>
            {contratanteNome || "Contratante"}
          </Text>
          {tipoEvento && (
            <View style={styles.eventTypeContainer}>
              <Text style={styles.eventTypeIcon}>🎉</Text>
              <Text style={styles.eventType}>{tipoEvento}</Text>
            </View>
          )}
        </View>
        <View style={styles.valueBadge}>
          <Text style={styles.valueText}>
            R$ {Number(valor || 0).toFixed(0)}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {titulo}
      </Text>

      {/* Description */}
      {descricao && (
        <Text style={styles.description} numberOfLines={3}>
          {descricao}
        </Text>
      )}

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        {local && (
          <View style={styles.tag}>
            <Text style={styles.tagIcon}>📍</Text>
            <Text style={styles.tagText} numberOfLines={1}>
              {local}
            </Text>
          </View>
        )}
        {data && (
          <View style={styles.tag}>
            <Text style={styles.tagIcon}>📅</Text>
            <Text style={styles.tagText}>{data}</Text>
          </View>
        )}
        {hora && (
          <View style={styles.tag}>
            <Text style={styles.tagIcon}>🕐</Text>
            <Text style={styles.tagText}>{hora}</Text>
          </View>
        )}
      </View>

      {/* Footer with additional info */}
      {(duracao || publicoEsperado) && (
        <View style={styles.footer}>
          {duracao && (
            <View style={styles.footerItem}>
              <Text style={styles.footerIcon}>⏱️</Text>
              <Text style={styles.footerText}>{duracao}h</Text>
            </View>
          )}
          {publicoEsperado && (
            <View style={styles.footerItem}>
              <Text style={styles.footerIcon}>👥</Text>
              <Text style={styles.footerText}>~{publicoEsperado} pessoas</Text>
            </View>
          )}
        </View>
      )}

      {/* LinkedIn-style Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isInterested && styles.actionButtonActive,
          ]}
          onPress={handleInterested}
        >
          <Text style={styles.actionIcon}>{isInterested ? "✅" : "🙋"}</Text>
          <Text
            style={[styles.actionText, isInterested && styles.actionTextActive]}
          >
            {isInterested ? "Interessado" : "Interesse"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isSaved && styles.actionButtonActive]}
          onPress={handleSave}
        >
          <Text style={styles.actionIcon}>{isSaved ? "💾" : "🔖"}</Text>
          <Text style={[styles.actionText, isSaved && styles.actionTextActive]}>
            {isSaved ? "Salvo" : "Salvar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Enviar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <Text style={styles.actionIcon}>👁️</Text>
          <Text style={styles.actionText}>Ver mais</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerInfo: {
    flex: 1,
  },
  contratanteName: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  eventTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventTypeIcon: {
    fontSize: 12,
  },
  eventType: {
    color: "#999",
    fontSize: 13,
    fontWeight: "500",
  },
  valueBadge: {
    backgroundColor: "#EC4899",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  valueText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Title & Description
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    lineHeight: 24,
  },
  description: {
    color: "#AAA",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },

  // Tags
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    maxWidth: "48%",
  },
  tagIcon: {
    fontSize: 12,
  },
  tagText: {
    color: "#CCC",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },

  // Footer
  footer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerIcon: {
    fontSize: 14,
  },
  footerText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "500",
  },

  // Action Buttons (LinkedIn-style)
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  actionButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
  },
  actionButtonActive: {
    // Active state styling
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
  },
  actionTextActive: {
    color: "#EC4899",
  },
});
