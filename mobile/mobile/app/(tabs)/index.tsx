import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import api from "@/services/api";
import FeedProposalCard from "@/components/FeedProposalCard";
import AppHeader from "@/components/AppHeader";

interface FeedProposal {
  id_proposta: string;
  titulo: string;
  descricao: string;
  valor_oferecido: number;
  status: string;
  data: string;
  hora: string;
  local: string;
  tipo_evento: string;
  contratante_nome: string;
  contratante_id: string;
  duracao_horas?: number;
  publico_esperado?: number;
}

interface User {
  id_usuario?: string;
  usuario?: string;
  email?: string;
  tipo?: string;
}

export default function FeedScreen() {
  const router = useRouter();
  const [proposals, setProposals] = useState<FeedProposal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [searchLocal, setSearchLocal] = useState("");
  const [selectedTipoEvento, setSelectedTipoEvento] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const eventTypes = [
    "Casamento",
    "Aniversário",
    "Corporativo",
    "Festival",
    "Bar/Restaurante",
    "Formatura",
  ];

  const isArtist = user?.tipo === "artista";

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          // Check if user has token first (lightweight check)
          const hasToken = await api.hasToken();
          if (!hasToken) {
            console.log("No token found, redirecting to login");
            router.replace("/login");
            return;
          }

          setLoading(true);

          const [userRes, feedRes] = await Promise.all([
            api.getCurrentUser(),
            api.listarRecomendacoes({
              local: searchLocal || undefined,
              tipo_evento: selectedTipoEvento || undefined,
              limit: 20,
              offset: 0,
            }),
          ]);

          if (userRes.success && userRes.data?.user) {
            setUser(userRes.data.user as User);
          }

          if (feedRes.success && feedRes.data?.propostas) {
            setProposals(feedRes.data.propostas as unknown as FeedProposal[]);
            setHasMore(feedRes.data.hasMore || false);
          }
        } catch (error) {
          console.error("Erro ao carregar feed:", error);
          // If authentication error, redirect to login
          if (error instanceof Error && error.message.includes("Token")) {
            router.replace("/login");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [searchLocal, selectedTipoEvento, router]),
  );

  const loadData = async () => {
    try {
      // Check if user has token first
      const hasToken = await api.hasToken();
      if (!hasToken) {
        router.replace("/login");
        return;
      }

      setLoading(true);

      const [userRes, feedRes] = await Promise.all([
        api.getCurrentUser(),
        api.listarRecomendacoes({
          local: searchLocal || undefined,
          tipo_evento: selectedTipoEvento || undefined,
          limit: 20,
          offset: 0,
        }),
      ]);

      if (userRes.success && userRes.data?.user) {
        setUser(userRes.data.user as User);
      }

      if (feedRes.success && feedRes.data?.propostas) {
        setProposals(feedRes.data.propostas as unknown as FeedProposal[]);
        setHasMore(feedRes.data.hasMore || false);
      }
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
      if (error instanceof Error && error.message.includes("Token")) {
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;

    try {
      const feedRes = await api.listarRecomendacoes({
        local: searchLocal || undefined,
        tipo_evento: selectedTipoEvento || undefined,
        limit: 20,
        offset: proposals.length,
      });

      if (feedRes.success && feedRes.data?.propostas) {
        setProposals([
          ...proposals,
          ...(feedRes.data.propostas as unknown as FeedProposal[]),
        ]);
        setHasMore(feedRes.data.hasMore || false);
      }
    } catch (error) {
      console.error("Erro ao carregar mais propostas:", error);
    }
  };

  const clearFilters = () => {
    setSearchLocal("");
    setSelectedTipoEvento("");
  };

  const renderProposalCard = ({ item }: { item: FeedProposal }) => (
    <FeedProposalCard
      id={item.id_proposta}
      titulo={item.titulo}
      descricao={item.descricao}
      valor={item.valor_oferecido}
      data={item.data}
      hora={item.hora}
      local={item.local}
      tipoEvento={item.tipo_evento}
      contratanteNome={item.contratante_nome}
      duracao={item.duracao_horas}
      publicoEsperado={item.publico_esperado}
      onPress={() => router.push(`/proposal/${item.id_proposta}`)}
    />
  );

  const renderHeader = () => (
    <View>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greetingText}>
          👋 Olá, {user?.usuario || "Usuário"}!
        </Text>
        <Text style={styles.welcomeTitle}>
          {isArtist
            ? "Encontre suas próximas oportunidades"
            : "Descubra Novos Artistas"}
        </Text>
      </View>

      {/* Story-like Quick Actions - Diferentes para Artista vs Contratante */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesContainer}
        contentContainerStyle={styles.storiesContent}
      >
        {isArtist ? (
          // Stories para Artistas
          <>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => router.push("/(tabs)/minhas-propostas")}
            >
              <View style={styles.storyCircle}>
                <Text style={styles.storyIcon}>📋</Text>
              </View>
              <Text style={styles.storyLabel}>Propostas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => setShowFilters(!showFilters)}
            >
              <View style={[styles.storyCircle, styles.storyCircleSecondary]}>
                <Text style={styles.storyIcon}>🔍</Text>
              </View>
              <Text style={styles.storyLabel}>Filtrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => router.push("/(tabs)/portfolio")}
            >
              <View style={[styles.storyCircle, styles.storyCircleSecondary]}>
                <Text style={styles.storyIcon}>🎪</Text>
              </View>
              <Text style={styles.storyLabel}>Portfólio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => router.push("/reviews")}
            >
              <View style={[styles.storyCircle, styles.storyCircleSecondary]}>
                <Text style={styles.storyIcon}>⭐</Text>
              </View>
              <Text style={styles.storyLabel}>Avaliações</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => router.push("/history")}
            >
              <View style={[styles.storyCircle, styles.storyCircleSecondary]}>
                <Text style={styles.storyIcon}>📜</Text>
              </View>
              <Text style={styles.storyLabel}>Histórico</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Stories para Contratantes
          <>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => router.push("/create-proposal")}
            >
              <View style={styles.storyCircle}>
                <Text style={styles.storyIcon}>✨</Text>
              </View>
              <Text style={styles.storyLabel}>Criar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => setShowFilters(!showFilters)}
            >
              <View style={[styles.storyCircle, styles.storyCircleSecondary]}>
                <Text style={styles.storyIcon}>🔍</Text>
              </View>
              <Text style={styles.storyLabel}>Filtrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => router.push("/(tabs)/explore")}
            >
              <View style={[styles.storyCircle, styles.storyCircleSecondary]}>
                <Text style={styles.storyIcon}>🎵</Text>
              </View>
              <Text style={styles.storyLabel}>Artistas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => router.push("/(tabs)/minhas-propostas")}
            >
              <View style={[styles.storyCircle, styles.storyCircleSecondary]}>
                <Text style={styles.storyIcon}>📋</Text>
              </View>
              <Text style={styles.storyLabel}>Minhas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => router.push("/history")}
            >
              <View style={[styles.storyCircle, styles.storyCircleSecondary]}>
                <Text style={styles.storyIcon}>📜</Text>
              </View>
              <Text style={styles.storyLabel}>Histórico</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Filters Section */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>
            {isArtist ? "Filtrar Oportunidades" : "Filtrar Propostas"}
          </Text>

          {/* Location Search */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>📍 Local</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Digite a cidade ou região..."
              placeholderTextColor="#666"
              value={searchLocal}
              onChangeText={setSearchLocal}
            />
          </View>

          {/* Event Type Selection */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>🎉 Tipo de Evento</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.eventTypesContainer}>
                {eventTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.eventTypeChip,
                      selectedTipoEvento === type && styles.eventTypeChipActive,
                    ]}
                    onPress={() =>
                      setSelectedTipoEvento(
                        selectedTipoEvento === type ? "" : type,
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.eventTypeChipText,
                        selectedTipoEvento === type &&
                          styles.eventTypeChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Clear Filters Button */}
          {(searchLocal || selectedTipoEvento) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Propostas Recomendadas</Text>
        <Text style={styles.sectionSubtitle}>
          {proposals.length} {proposals.length === 1 ? "proposta" : "propostas"}
        </Text>
      </View>
    </View>
  );

  if (loading && proposals.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Carregando feed...</Text>
      </View>
    );
  }

  // If no user after loading, something went wrong with auth
  if (!loading && !user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Você não está autenticado</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.loginButtonText}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader user={user} showSearch showNotifications />
      <FlatList
        data={proposals}
        renderItem={renderProposalCard}
        keyExtractor={(item) => item.id_proposta.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎵</Text>
            <Text style={styles.emptyStateText}>
              Nenhuma proposta encontrada
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Tente ajustar os filtros ou volte mais tarde
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#EC4899"
            colors={["#EC4899"]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#EC4899",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Welcome Section
  welcomeSection: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  greetingText: {
    color: "#999",
    fontSize: 14,
    marginBottom: 4,
  },
  welcomeTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },

  // Stories (LinkedIn-style quick actions)
  storiesContainer: {
    marginBottom: 16,
    marginHorizontal: -16,
  },
  storiesContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  storyItem: {
    alignItems: "center",
    gap: 6,
  },
  storyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#EC4899",
  },
  storyCircleSecondary: {
    backgroundColor: "#1A1A1A",
    borderColor: "#333",
  },
  storyIcon: {
    fontSize: 24,
  },
  storyLabel: {
    color: "#AAA",
    fontSize: 11,
    fontWeight: "600",
  },

  // Filters
  filtersContainer: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  filtersTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    color: "#AAA",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#000",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  eventTypesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  eventTypeChip: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  eventTypeChipActive: {
    backgroundColor: "#EC4899",
    borderColor: "#EC4899",
  },
  eventTypeChipText: {
    color: "#AAA",
    fontSize: 13,
    fontWeight: "600",
  },
  eventTypeChipTextActive: {
    color: "#FFF",
  },
  clearFiltersButton: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearFiltersText: {
    color: "#EC4899",
    fontSize: 13,
    fontWeight: "bold",
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionSubtitle: {
    color: "#666",
    fontSize: 14,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginTop: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  emptyStateSubtext: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
});
