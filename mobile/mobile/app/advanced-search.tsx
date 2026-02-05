import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import api from "@/services/api";
import Header from "@/components/shared/Header";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

interface SearchFilters {
  search: string;
  tipo: "todos" | "artista" | "banda";
  local: string;
}

const GENRES = [
  "🎵 Todos",
  "🎸 Rock",
  "🎹 Pop",
  "🎺 Jazz",
  "🎤 Samba",
  "🥁 Eletrônico",
  "🎻 Clássico",
  "🎼 MPB",
];

export default function AdvancedSearchScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    tipo: "todos",
    local: "",
  });

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const applyFilters = async () => {
    setLoading(true);
    try {
      const response = await api.listarArtistas();
      if (response.success && response.data?.artistas) {
        let filtered = response.data.artistas;

        // Filter by search
        if (filters.search) {
          filtered = filtered.filter((a: any) =>
            a.usuario?.toLowerCase().includes(filters.search.toLowerCase()),
          );
        }

        // Filter by type
        if (filters.tipo !== "todos") {
          filtered = filtered.filter(
            (a: any) => a.tipo_usuario === filters.tipo,
          );
        }

        // Filter by location
        if (filters.local) {
          filtered = filtered.filter((a: any) =>
            a.local_atuacao
              ?.toLowerCase()
              .includes(filters.local.toLowerCase()),
          );
        }

        setResults(filtered);
      }
    } catch (error) {
      console.error("Erro ao buscar artistas:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      tipo: "todos",
      local: "",
    });
    setResults([]);
  };

  const renderArtist = ({ item }: { item: (typeof mockArtists)[0] }) => (
    <TouchableOpacity
      onPress={() => router.push(`/artist/${item.id_usuario}`)}
      style={styles.artistCard}
    >
      <View style={styles.artistHeader}>
        <View style={styles.artistAvatar}>
          <Text style={styles.avatarIcon}>🎤</Text>
        </View>
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{item.usuario}</Text>
          <Text style={styles.artistType}>{item.tipo_usuario}</Text>
        </View>
        <Badge label="Contratar" variant="info" />
      </View>
      <Text style={styles.artistDesc} numberOfLines={2}>
        {item.descricao}
      </Text>
      <View style={styles.artistFooter}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{item.local_atuacao}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingIcon}>⭐</Text>
          <Text style={styles.ratingText}>4.8</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Header title="Busca Avançada" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Search Input */}
        <Card style={styles.searchCard}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar artistas..."
              placeholderTextColor="#666"
              value={filters.search}
              onChangeText={(text) =>
                setFilters((prev) => ({ ...prev, search: text }))
              }
            />
          </View>
        </Card>

        {/* Type Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Tipo de Artista</Text>
          <View style={styles.filterOptions}>
            {(["todos", "Artista", "Banda"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  filters.tipo === type && styles.typeButtonActive,
                ]}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    tipo: (type === "todos" ? "todos" : type) as any,
                  }))
                }
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    filters.tipo === type && styles.typeButtonTextActive,
                  ]}
                >
                  {type === "todos" ? "Todos" : type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Localização</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: São Paulo, SP"
            placeholderTextColor="#666"
            value={filters.local}
            onChangeText={(text) =>
              setFilters((prev) => ({ ...prev, local: text }))
            }
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            label="Limpar Filtros"
            variant="secondary"
            onPress={clearFilters}
          />
          <Button
            label="Buscar"
            variant="primary"
            onPress={applyFilters}
            icon="🔍"
          />
        </View>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            {results.length} resultado{results.length !== 1 ? "s" : ""}{" "}
            encontrado
            {results.length !== 1 ? "s" : ""}
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderArtist}
              keyExtractor={(item) => item.id_usuario.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>Nenhum artista encontrado</Text>
              <Text style={styles.emptySubtext}>
                Tente ajustar seus filtros
              </Text>
            </View>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  searchCard: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  filterSection: {
    marginBottom: 20,
    gap: 10,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  typeButtonActive: {
    backgroundColor: "#EC489920",
    borderColor: "#EC4899",
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  typeButtonTextActive: {
    color: "#EC4899",
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreTag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  genreTagActive: {
    backgroundColor: "#EC489920",
    borderColor: "#EC4899",
  },
  genreText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  genreTextActive: {
    color: "#EC4899",
  },
  input: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  resultsSection: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  artistCard: {
    backgroundColor: "#18181B",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  artistHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  artistAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EC489920",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EC4899",
    marginRight: 10,
  },
  avatarIcon: {
    fontSize: 22,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  artistType: {
    fontSize: 11,
    color: "#999",
  },
  artistDesc: {
    fontSize: 12,
    color: "#999",
    lineHeight: 16,
    marginBottom: 10,
  },
  artistFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#3F3F46",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationIcon: {
    fontSize: 12,
  },
  locationText: {
    fontSize: 11,
    color: "#999",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingIcon: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 11,
    color: "#FCD34D",
    fontWeight: "600",
  },
  separator: {
    height: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#999",
  },
});
