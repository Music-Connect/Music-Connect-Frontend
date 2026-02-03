import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Header from "@/components/shared/Header";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import { getStatusLabel, formatDateShort } from "@/utils/proposalHelpers";

interface HistoryItem {
  id: number;
  titulo: string;
  artista?: string;
  contratante?: string;
  data: string;
  valor: string;
  status: "pendente" | "aceito" | "recusado";
  type: "enviada" | "recebida";
}

const mockHistory: HistoryItem[] = [
  {
    id: 1,
    titulo: "Show para Casamento",
    artista: "Maria Santos",
    data: "2026-02-01",
    valor: "R$ 3.000,00",
    status: "aceito",
    type: "enviada",
  },
  {
    id: 2,
    titulo: "Festival de Música",
    contratante: "Prefeitura Municipal",
    data: "2026-01-28",
    valor: "R$ 5.000,00",
    status: "aceito",
    type: "recebida",
  },
  {
    id: 3,
    titulo: "DJ para Festa de Formatura",
    artista: "Pedro Lima",
    data: "2026-01-15",
    valor: "R$ 2.200,00",
    status: "recusado",
    type: "enviada",
  },
  {
    id: 4,
    titulo: "Show em Casa de Eventos",
    contratante: "Espaço Cultural XYZ",
    data: "2026-01-10",
    valor: "R$ 2.500,00",
    status: "pendente",
    type: "recebida",
  },
];

type FilterType = "todos" | "aceito" | "recusado" | "pendente";

export default function HistoryScreen() {
  const [filter, setFilter] = useState<FilterType>("todos");

  const filteredHistory = mockHistory.filter((h) =>
    filter === "todos" ? true : h.status === filter,
  );

  const stats = {
    total: mockHistory.length,
    aceito: mockHistory.filter((h) => h.status === "aceito").length,
    recusado: mockHistory.filter((h) => h.status === "recusado").length,
    pendente: mockHistory.filter((h) => h.status === "pendente").length,
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
          label={getStatusLabel(item.status)}
          variant={
            item.status === "aceito"
              ? "success"
              : item.status === "recusado"
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
              {stats.aceito}
            </Text>
            <Text style={styles.statLabel}>Aceitas</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#EF4444" }]}>
              {stats.recusado}
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
          {(["todos", "aceito", "recusado", "pendente"] as FilterType[]).map(
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
                    : f === "aceito"
                      ? "✅ Aceitos"
                      : f === "recusado"
                        ? "❌ Recusados"
                        : "⏳ Pendentes"}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        {/* History List */}
        {filteredHistory.length > 0 ? (
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
});
