import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import Header from "@/components/shared/Header";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  type: "enviado" | "recebido";
}

export default function ReviewsScreen() {
  const [filter, setFilter] = useState<"todos" | "recebido" | "enviado">(
    "todos",
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadReviews();
    }, []),
  );

  const loadReviews = async () => {
    try {
      setLoading(true);
      // Placeholder - backend endpoint for reviews not yet implemented
      setReviews([]);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((r) =>
    filter === "todos" ? true : r.type === filter,
  );

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const handleSubmitReview = () => {
    if (!newReview || rating === 0) {
      Alert.alert("Erro", "Preencha a avaliação e a mensagem");
      return;
    }

    Alert.alert("Sucesso", "Avaliação enviada com sucesso!", [
      {
        text: "OK",
        onPress: () => {
          setNewReview("");
          setRating(0);
          setShowForm(false);
        },
      },
    ]);
  };

  const renderStars = (stars: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Text key={i} style={[styles.star, i <= stars && styles.starFilled]}>
            ★
          </Text>
        ))}
      </View>
    );
  };

  const renderReview = ({ item }: { item: Review }) => (
    <Card style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.reviewAuthor}>{item.author}</Text>
          <Text style={styles.reviewDate}>
            {new Date(item.date).toLocaleDateString("pt-BR")}
          </Text>
        </View>
        <View>{renderStars(item.rating)}</View>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Header title="Avaliações" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Rating Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.ratingContainer}>
            <Text style={styles.averageRating}>{averageRating}</Text>
            <View style={styles.ratingDetails}>
              {renderStars(Math.round(parseFloat(averageRating as string)))}
              <Text style={styles.reviewCount}>
                ({reviews.length} avaliações)
              </Text>
            </View>
          </View>
        </Card>

        {/* Filters */}
        <View style={styles.filterContainer}>
          {(["todos", "recebido", "enviado"] as const).map((f) => (
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
                  : f === "recebido"
                    ? "Recebidas"
                    : "Enviadas"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Write Review Button */}
        {!showForm && (
          <Button
            label="Escrever Avaliação"
            variant="primary"
            onPress={() => setShowForm(true)}
            icon="✍️"
          />
        )}

        {/* Write Review Form */}
        {showForm && (
          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>Sua Avaliação</Text>

            <View style={styles.ratingSelector}>
              <Text style={styles.ratingLabel}>Nota:</Text>
              <View style={styles.starsSelector}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Text
                      style={[
                        styles.starSelector,
                        i <= rating && styles.starSelectorFilled,
                      ]}
                    >
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Escreva sua avaliação..."
              placeholderTextColor="#666"
              value={newReview}
              onChangeText={setNewReview}
              multiline
              numberOfLines={4}
            />

            <View style={styles.formActions}>
              <Button
                label="Cancelar"
                variant="secondary"
                onPress={() => setShowForm(false)}
              />
              <Button
                label="Enviar"
                variant="primary"
                onPress={handleSubmitReview}
              />
            </View>
          </Card>
        )}

        {/* Reviews List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
          </View>
        ) : filteredReviews.length > 0 ? (
          <View style={styles.reviewsList}>
            <Text style={styles.listTitle}>
              {filter === "todos"
                ? "Todas as Avaliações"
                : filter === "recebido"
                  ? "Avaliações Recebidas"
                  : "Avaliações Enviadas"}
            </Text>
            <FlatList
              data={filteredReviews}
              renderItem={renderReview}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyText}>
              Nenhuma avaliação nesta categoria
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
  summaryCard: {
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FCD34D",
  },
  ratingDetails: {
    flex: 1,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 4,
  },
  star: {
    fontSize: 16,
    color: "#3F3F46",
  },
  starFilled: {
    color: "#FCD34D",
  },
  reviewCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
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
    textAlign: "center",
  },
  filterTextActive: {
    color: "#EC4899",
  },
  formCard: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  ratingSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  starsSelector: {
    flexDirection: "row",
    gap: 4,
  },
  starSelector: {
    fontSize: 20,
    color: "#3F3F46",
    paddingHorizontal: 4,
  },
  starSelectorFilled: {
    color: "#FCD34D",
  },
  reviewInput: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 13,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  formActions: {
    flexDirection: "row",
    gap: 8,
  },
  reviewsList: {
    marginTop: 20,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  reviewCard: {
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 11,
    color: "#666",
  },
  reviewText: {
    fontSize: 13,
    color: "#999",
    lineHeight: 18,
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
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
