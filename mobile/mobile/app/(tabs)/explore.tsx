import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { mockArtists } from "@/constants/mockData";

interface Artist {
  id_usuario: number;
  usuario: string;
  tipo_usuario: string;
  local_atuacao: string;
  descricao: string;
  disponivel: boolean;
}

type FilterType = "todos" | "artista" | "banda";

export default function ExploreScreen() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setArtists(mockArtists);
      setFilteredArtists(mockArtists);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedFilter, artists]);

  const filterArtists = () => {
    let filtered = [...artists];

    // Filter by type
    if (selectedFilter !== "todos") {
      filtered = filtered.filter(
        (artist) => artist.tipo_usuario === selectedFilter,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (artist) =>
          artist.usuario.toLowerCase().includes(query) ||
          artist.local_atuacao.toLowerCase().includes(query),
      );
    }

    setFilteredArtists(filtered);
  };

  const renderArtist = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.artistCard}
      activeOpacity={0.8}
      onPress={() => router.push(`/artist/${item.id_usuario}`)}
    >
      <View style={styles.artistAvatar}>
        <Text style={styles.artistAvatarText}>
          {item.usuario.substring(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={styles.artistInfo}>
        <Text style={styles.artistName} numberOfLines={1}>
          {item.usuario}
        </Text>
        <Text style={styles.artistType}>{item.tipo_usuario}</Text>
        <Text style={styles.artistLocation} numberOfLines={1}>
          📍 {item.local_atuacao}
        </Text>
        <View
          style={[
            styles.statusIndicator,
            item.disponivel ? styles.availableStatus : styles.unavailableStatus,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              item.disponivel ? styles.availableDot : styles.unavailableDot,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              item.disponivel ? styles.availableText : styles.unavailableText,
            ]}
          >
            {item.disponivel ? "Disponível" : "Indisponível"}
          </Text>
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Explorar</Text>
        <Text style={styles.headerSubtitle}>Encontre artistas e bandas</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou localização..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "todos" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter("todos")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "todos" && styles.filterTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "artista" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter("artista")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "artista" && styles.filterTextActive,
            ]}
          >
            Artistas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "banda" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter("banda")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "banda" && styles.filterTextActive,
            ]}
          >
            Bandas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.advancedSearchButton}
          onPress={() => router.push("/advanced-search")}
        >
          <Text style={styles.advancedSearchIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredArtists.length} resultado
          {filteredArtists.length !== 1 && "s"}
        </Text>
      </View>

      {/* Artists Grid */}
      {filteredArtists.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>🎵</Text>
          <Text style={styles.emptyStateTitle}>Nenhum resultado</Text>
          <Text style={styles.emptyStateDescription}>
            Tente ajustar os filtros ou buscar por outro termo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredArtists}
          renderItem={renderArtist}
          keyExtractor={(item) => item.id_usuario.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181B",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: "#fff",
    fontSize: 15,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: "#666",
    fontSize: 18,
  },
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  filterButtonActive: {
    backgroundColor: "#EC4899",
    borderColor: "#EC4899",
  },
  filterText: {
    color: "#999",
    fontSize: 13,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  columnWrapper: {
    gap: 12,
  },
  artistCard: {
    flex: 1,
    backgroundColor: "#18181B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3F3F46",
    alignItems: "center",
  },
  artistAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  artistAvatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  artistInfo: {
    width: "100%",
    alignItems: "center",
  },
  artistName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  artistType: {
    fontSize: 11,
    color: "#666",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  artistLocation: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  artistPrice: {
    fontSize: 13,
    color: "#FCD34D",
    fontWeight: "600",
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableStatus: {
    backgroundColor: "#10B98120",
  },
  unavailableStatus: {
    backgroundColor: "#EF444420",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  availableDot: {
    backgroundColor: "#10B981",
  },
  unavailableDot: {
    backgroundColor: "#EF4444",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  availableText: {
    color: "#10B981",
  },
  unavailableText: {
    color: "#EF4444",
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
  advancedSearchButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    justifyContent: "center",
    alignItems: "center",
  },
  advancedSearchIcon: {
    fontSize: 20,
  },
});
