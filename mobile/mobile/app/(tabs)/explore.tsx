import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import api from "@/services/api";
import AppHeader from "@/components/AppHeader";

// Type matching backend Usuario for artistas
interface Artist {
  id_usuario: number;
  usuario: string;
  tipo_usuario: string;
  cidade?: string;
  estado?: string;
  descricao?: string;
  genero_musical?: string;
  imagem_perfil_url?: string;
  media_avaliacoes?: number;
  total_avaliacoes?: number;
}

const GENRES = [
  { id: "all", label: "Todos", icon: "🎵" },
  { id: "rock", label: "Rock", icon: "🎸" },
  { id: "sertanejo", label: "Sertanejo", icon: "🤠" },
  { id: "mpb", label: "MPB", icon: "🎶" },
  { id: "jazz", label: "Jazz", icon: "🎷" },
  { id: "pop", label: "Pop", icon: "🎤" },
  { id: "eletronica", label: "Eletrônica", icon: "🎧" },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [artistsRes, userRes] = await Promise.all([
        api.listarArtistas(),
        api.getCurrentUser(),
      ]);

      if (artistsRes.success && artistsRes.data?.artistas) {
        // Cast to Artist[] since backend returns compatible shape
        const artistsList = artistsRes.data.artistas as unknown as Artist[];
        setArtists(artistsList);
        setFilteredArtists(artistsList);
      }

      if (userRes.success && userRes.data?.user) {
        setUser(userRes.data.user);
      }
    } catch (error) {
      console.error("[EXPLORE] Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterArtists = (query: string, genre: string) => {
    let filtered = artists;

    if (genre !== "all") {
      filtered = filtered.filter((artist) =>
        artist.genero_musical?.toLowerCase().includes(genre.toLowerCase()),
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter((artist) => {
        const matchesName = artist.usuario.toLowerCase().includes(q);
        const matchesCidade = artist.cidade?.toLowerCase().includes(q);
        const matchesEstado = artist.estado?.toLowerCase().includes(q);
        const matchesGenero = artist.genero_musical?.toLowerCase().includes(q);
        return matchesName || matchesCidade || matchesEstado || matchesGenero;
      });
    }

    setFilteredArtists(filtered);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    filterArtists(text, selectedGenre);
  };

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId);
    filterArtists(searchQuery, genreId);
  };

  const renderArtistCard = ({ item }: { item: Artist }) => {
    const location = [item.cidade, item.estado].filter(Boolean).join(", ");

    return (
      <TouchableOpacity
        style={styles.artistCard}
        onPress={() => router.push(`/artist/${item.id_usuario}`)}
        activeOpacity={0.8}
      >
        <View style={styles.artistAvatar}>
          <Text style={styles.artistAvatarText}>
            {item.usuario.substring(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={styles.artistInfo}>
          <View style={styles.artistHeader}>
            <Text style={styles.artistName}>{item.usuario}</Text>
            {item.media_avaliacoes && Number(item.media_avaliacoes) > 0 && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  ⭐ {Number(item.media_avaliacoes).toFixed(1)}
                </Text>
              </View>
            )}
          </View>
          {item.genero_musical && (
            <Text style={styles.artistGenre}>🎵 {item.genero_musical}</Text>
          )}
          {location && <Text style={styles.artistLocation}>📍 {location}</Text>}
          {item.descricao && (
            <Text style={styles.artistDescription} numberOfLines={2}>
              {item.descricao}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={() =>
            router.push(`/create-proposal?artistId=${item.id_usuario}`)
          }
        >
          <Text style={styles.connectButtonText}>Contratar</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar artistas, gêneros, cidades..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearchChange("")}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genresContainer}
        contentContainerStyle={styles.genresContent}
      >
        {GENRES.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.genreChip,
              selectedGenre === genre.id && styles.genreChipActive,
            ]}
            onPress={() => handleGenreSelect(genre.id)}
          >
            <Text style={styles.genreIcon}>{genre.icon}</Text>
            <Text
              style={[
                styles.genreLabel,
                selectedGenre === genre.id && styles.genreLabelActive,
              ]}
            >
              {genre.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {filteredArtists.length}{" "}
          {filteredArtists.length === 1 ? "artista" : "artistas"}
        </Text>
        {(searchQuery || selectedGenre !== "all") && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setSelectedGenre("all");
              setFilteredArtists(artists);
            }}
          >
            <Text style={styles.clearFilters}>Limpar filtros</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading && artists.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Carregando artistas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader user={user} title="Explorar" showNotifications />

      <FlatList
        data={filteredArtists}
        renderItem={renderArtistCard}
        keyExtractor={(item) => item.id_usuario.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#EC4899"
            colors={["#EC4899"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateText}>Nenhum artista encontrado</Text>
            <Text style={styles.emptyStateSubtext}>
              Tente ajustar sua busca ou filtros
            </Text>
          </View>
        }
      />
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
    paddingBottom: 100,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFF",
    paddingVertical: 14,
    fontSize: 15,
  },
  clearSearch: {
    color: "#666",
    fontSize: 16,
    padding: 8,
  },

  // Genre Chips
  genresContainer: {
    marginBottom: 20,
    marginHorizontal: -16,
  },
  genresContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  genreChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  genreChipActive: {
    backgroundColor: "#EC4899",
    borderColor: "#EC4899",
  },
  genreIcon: {
    fontSize: 14,
  },
  genreLabel: {
    color: "#AAA",
    fontSize: 13,
    fontWeight: "600",
  },
  genreLabelActive: {
    color: "#FFF",
  },

  // Results Header
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  resultsTitle: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
  },
  clearFilters: {
    color: "#EC4899",
    fontSize: 13,
    fontWeight: "600",
  },

  // Artist Card
  artistCard: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  artistAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  artistAvatarText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  artistInfo: {
    flex: 1,
  },
  artistHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  artistName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  artistGenre: {
    color: "#AAA",
    fontSize: 13,
    marginBottom: 2,
  },
  artistLocation: {
    color: "#666",
    fontSize: 12,
    marginBottom: 4,
  },
  artistDescription: {
    color: "#888",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  connectButton: {
    backgroundColor: "#EC4899",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  connectButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
});
