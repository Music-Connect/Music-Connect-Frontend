import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import api from "@/services/api";
import AppHeader from "@/components/AppHeader";

interface Work {
  id_proposta: string;
  titulo: string;
  descricao: string;
  data_conclusao: string;
  local: string;
  valor_recebido?: number;
  contratante: string;
  imagem_url?: string;
  avaliacoes_count?: number;
  media_avaliacoes?: number;
}

interface User {
  id_usuario?: string;
  usuario?: string;
  email?: string;
  tipo_usuario?: string;
}

export default function PortfolioScreen() {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const hasToken = await api.hasToken();
          if (!hasToken) {
            router.replace("/login");
            return;
          }

          setLoading(true);

          const [userRes, worksRes] = await Promise.all([
            api.getCurrentUser(),
            api.listarMinhasPropostas(),
          ]);

          if (userRes.success && userRes.data?.user) {
            setUser(userRes.data.user as User);
          }

          if (worksRes.success && worksRes.data?.propostas) {
            // Filter only completed proposals
            const completedWorks = (worksRes.data.propostas as any[])
              .filter((p) => p.status === "concluida")
              .map((p) => ({
                id_proposta: p.id_proposta,
                titulo: p.titulo || "Sem título",
                descricao: p.descricao || "",
                data_conclusao: p.data || new Date().toISOString(),
                local: p.local || "Local não informado",
                valor_recebido: p.valor || parseFloat(p.valor_oferecido || "0"),
                contratante: p.contratante || "Desconhecido",
              }));

            setWorks(completedWorks);
          }
        } catch (error) {
          console.error("Erro ao carregar portfólio:", error);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const worksRes = await api.listarMinhasPropostas();
      if (worksRes.success && worksRes.data?.propostas) {
        const completedWorks = (worksRes.data.propostas as any[])
          .filter((p) => p.status === "concluida")
          .map((p) => ({
            id_proposta: p.id_proposta,
            titulo: p.titulo || "Sem título",
            descricao: p.descricao || "",
            data_conclusao: p.data || new Date().toISOString(),
            local: p.local || "Local não informado",
            valor_recebido: p.valor || parseFloat(p.valor_oferecido || "0"),
            contratante: p.contratante || "Desconhecido",
          }));
        setWorks(completedWorks);
      }
    } catch (error) {
      console.error("Erro ao atualizar portfólio:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderWorkCard = ({ item }: { item: Work }) => (
    <TouchableOpacity
      style={styles.workCard}
      activeOpacity={0.8}
      onPress={() => router.push(`/proposal/${item.id_proposta}`)}
    >
      {/* Work Image Placeholder */}
      <View style={styles.workImagePlaceholder}>
        <Text style={styles.workImageIcon}>🎵</Text>
      </View>

      {/* Work Info */}
      <View style={styles.workInfo}>
        <Text style={styles.workTitle} numberOfLines={2}>
          {item.titulo}
        </Text>

        <View style={styles.workMetadata}>
          <Text style={styles.metadataIcon}>🎤</Text>
          <Text style={styles.metadataText} numberOfLines={1}>
            {item.contratante}
          </Text>
        </View>

        {item.media_avaliacoes && item.media_avaliacoes > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              ⭐ {item.media_avaliacoes.toFixed(1)}
            </Text>
            <Text style={styles.ratingCount}>
              ({item.avaliacoes_count || 0} avaliações)
            </Text>
          </View>
        )}

        <View style={styles.workFooter}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerIcon}>📍</Text>
            <Text style={styles.footerText} numberOfLines={1}>
              {item.local}
            </Text>
          </View>
          {item.valor_recebido && (
            <Text style={styles.valor}>
              R$ {item.valor_recebido.toFixed(0)}
            </Text>
          )}
        </View>

        <Text style={styles.workDate}>
          {new Date(item.data_conclusao).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Carregando portfólio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader user={user} title="Portfólio" showNotifications />

      {works.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🎵</Text>
          <Text style={styles.emptyStateTitle}>Seu portfólio está vazio</Text>
          <Text style={styles.emptyStateText}>
            Trabalhos concluídos aparecerão aqui para showcasar seu trabalho
          </Text>
        </View>
      ) : (
        <FlatList
          data={works}
          renderItem={renderWorkCard}
          keyExtractor={(item) => item.id_proposta}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#EC4899"
              colors={["#EC4899"]}
            />
          }
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 100,
  },

  // Work Card
  workCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  workImagePlaceholder: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
  },
  workImageIcon: {
    fontSize: 60,
  },
  workInfo: {
    padding: 16,
  },
  workTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  workMetadata: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  metadataIcon: {
    fontSize: 14,
  },
  metadataText: {
    color: "#AAA",
    fontSize: 13,
  },

  // Rating
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  rating: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
  },
  ratingCount: {
    color: "#666",
    fontSize: 12,
  },

  // Footer
  workFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  footerIcon: {
    fontSize: 14,
  },
  footerText: {
    color: "#666",
    fontSize: 12,
    flex: 1,
  },
  valor: {
    color: "#EC4899",
    fontSize: 14,
    fontWeight: "bold",
  },
  workDate: {
    color: "#555",
    fontSize: 11,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
