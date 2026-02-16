import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import api from "@/services/api";
import Header from "@/components/shared/Header";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import { getStatusLabel, formatDateShort } from "@/utils/proposalHelpers";

interface HistoryItem {
  id: string;
  titulo: string;
  artista?: string;
  contratante?: string;
  data: string;
  valor: string;
  status: "pendente" | "aceita" | "recusada";
  type: "enviada" | "recebida";
}

type FilterType = "todos" | "aceita" | "recusada" | "pendente";

export default function HistoryScreen() {
  const [filter, setFilter] = useState<FilterType>("todos");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, []),
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await api.listarMinhasPropostas();
      if (response.success && response.data?.propostas) {
        const items = response.data.propostas.map((p: any) => ({
          id: p.id_proposta,
          titulo: p.descricao || "Proposta",
          artista: p.tipo_proposta === "enviada" ? p.nome_outro : undefined,
          contratante:
            p.tipo_proposta === "recebida" ? p.nome_outro : undefined,
          data: p.created_at,
          valor: p.valor_oferecido ? `R$ ${p.valor_oferecido}` : "A combinar",
          status: p.status,
          type: p.tipo_proposta,
        }));
        setHistory(items);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((h) =>
    filter === "todos" ? true : h.status === filter,
  );

  const stats = {
    total: history.length,
    aceita: history.filter((h) => h.status === "aceita").length,
    recusada: history.filter((h) => h.status === "recusada").length,
    pendente: history.filter((h) => h.status === "pendente").length,
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.historyCard}>
      <View style={styles.cardTop}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          <Text style={styles.cardSubtitle}>
            {item.type === "enviada"
              ? `Para: ${item.artista}`
              : `De: ${item.contratante}`}
          </Text>
        </View>
        <Badge
          label={getStatusLabel(item.status as any)}
          variant={
            item.status === "aceita"
              ? "success"
              : item.status === "recusada"
                ? "error"
                : "warning"
          }
        />
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.dateValue}>
          <Text style={styles.dateLabel}>📅</Text>
          <Text style={styles.dateText}>{formatDateShort(item.data)}</Text>
        </View>
        <View style={styles.dateValue}>
          <Text style={styles.dateLabel}>💰</Text>
          <Text style={styles.valueText}>{item.valor}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Header title="Histórico de Propostas" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#10B981" }]}>
              {stats.aceita}
            </Text>
            <Text style={styles.statLabel}>Aceitas</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#EF4444" }]}>
              {stats.recusada}
            </Text>
            <Text style={styles.statLabel}>Recusadas</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
              {stats.pendente}
            </Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </Card>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          {(["todos", "aceita", "recusada", "pendente"] as FilterType[]).map(
            (f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  filter === f && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(f)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === f && styles.filterTextActive,
                  ]}
                >
                  {f === "todos"
                    ? "Todos"
                    : f === "aceita"
                      ? "✅ Aceitas"
                      : f === "recusada"
                        ? "❌ Recusadas"
                        : "⏳ Pendentes"}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        {/* History List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
          </View>
        ) : filteredHistory.length > 0 ? (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              {filteredHistory.length} proposta
              {filteredHistory.length !== 1 ? "s" : ""}
            </Text>
            <FlatList
              data={filteredHistory}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>Nenhuma proposta</Text>
            <Text style={styles.emptyText}>
              Você não tem propostas com este status
            </Text>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "48%",
    alignItems: "center",
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: "#EC4899",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  filterButtonActive: {
    backgroundColor: "#EC489920",
    borderColor: "#EC4899",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#EC4899",
  },
  listContainer: {
    gap: 12,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  historyCard: {
    backgroundColor: "#18181B",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#3F3F46",
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#999",
  },
  cardBottom: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#3F3F46",
  },
  dateValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateLabel: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 11,
    color: "#999",
  },
  valueText: {
    fontSize: 11,
    color: "#FCD34D",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
