import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mockArtists } from "@/constants/mockData";
import Header from "@/components/shared/Header";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";

export default function CreateProposalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const artist = mockArtists.find(
    (a) => a.id_usuario === parseInt(id as string),
  );

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data: "",
    hora: "",
    valor: "",
    local: "",
  });

  if (!artist) {
    return (
      <View style={styles.container}>
        <Header title="Criar Proposta" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Artista não encontrado</Text>
        </View>
      </View>
    );
  }

  const handleSubmit = () => {
    if (!form.titulo || !form.data || !form.valor) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    Alert.alert("Sucesso", "Proposta enviada com sucesso!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Header title="Criar Proposta" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Artist Info */}
        <Card style={styles.artistCard}>
          <View style={styles.artistHeader}>
            <View style={styles.artistAvatar}>
              <Text style={styles.avatarIcon}>🎤</Text>
            </View>
            <View style={styles.artistInfo}>
              <Text style={styles.artistName}>{artist.usuario}</Text>
              <Text style={styles.artistType}>{artist.tipo_usuario}</Text>
            </View>
          </View>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Detalhes da Proposta</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Show para Casamento"
              placeholderTextColor="#666"
              value={form.titulo}
              onChangeText={(text) => setForm({ ...form, titulo: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o evento..."
              placeholderTextColor="#666"
              value={form.descricao}
              onChangeText={(text) => setForm({ ...form, descricao: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Data *</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#666"
                value={form.data}
                onChangeText={(text) => setForm({ ...form, data: text })}
              />
            </View>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Hora</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                placeholderTextColor="#666"
                value={form.hora}
                onChangeText={(text) => setForm({ ...form, hora: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Local</Text>
            <TextInput
              style={styles.input}
              placeholder="Onde será o evento?"
              placeholderTextColor="#666"
              value={form.local}
              onChangeText={(text) => setForm({ ...form, local: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor (R$) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2500"
              placeholderTextColor="#666"
              value={form.valor}
              onChangeText={(text) => setForm({ ...form, valor: text })}
              keyboardType="numeric"
            />
          </View>
        </Card>

        {/* Info Card */}
        <Card variant="ghost">
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Preencha os detalhes da sua proposta e o artista será notificado
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          label="Cancelar"
          variant="secondary"
          onPress={() => router.back()}
        />
        <Button
          label="Enviar Proposta"
          variant="primary"
          onPress={handleSubmit}
          icon="📤"
        />
      </View>
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
    paddingBottom: 120,
  },
  artistCard: {
    marginBottom: 20,
  },
  artistHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  artistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EC489920",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EC4899",
  },
  avatarIcon: {
    fontSize: 28,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  artistType: {
    fontSize: 12,
    color: "#999",
  },
  formCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
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
  textArea: {
    textAlignVertical: "top",
    height: 100,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#999",
    lineHeight: 16,
  },
  actions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    gap: 12,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#18181B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#999",
    fontSize: 16,
  },
});
