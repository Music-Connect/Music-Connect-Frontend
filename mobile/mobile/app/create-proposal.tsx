import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import api from "@/services/api";
import Header from "@/components/shared/Header";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";

export default function CreateProposalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [artist, setArtist] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (id) {
        loadData();
      }
    }, [id]),
  );

  const loadData = async () => {
    try {
      setLoading(true);

      // ✅ Verificar tipo de usuário logado
      const userResponse = await api.getCurrentUser();
      const currentUser = userResponse.data?.user;

      if (!currentUser) {
        Alert.alert("Erro", "Usuário não autenticado");
        router.replace("/(auth)/login");
        return;
      }

      // ✅ Apenas contratantes podem criar propostas
      if (currentUser.tipo_usuario !== "contratante") {
        Alert.alert(
          "Acesso Negado",
          "Apenas contratantes podem criar propostas. Você é um artista.",
        );
        router.replace("/redirect");
        return;
      }

      setUser(currentUser);

      // Carregar artista
      const response = await api.getArtistaDetalhes(Number(id));
      if (response.success && response.data?.artista) {
        setArtist(response.data.artista);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Falha ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data: "",
    hora: "",
    valor: "",
    local: "",
    endereco_completo: "",
    tipo_evento: "",
    duracao_horas: "",
    publico_esperado: "",
    equipamento_incluso: false,
    nome_responsavel: "",
    telefone_contato: "",
    observacoes: "",
  });

  // Máscara para data (DD/MM/AAAA)
  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);

    let formatted = "";
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
      if (cleaned.length >= 3) {
        formatted += "/" + cleaned.substring(2, 4);
      }
      if (cleaned.length >= 5) {
        formatted += "/" + cleaned.substring(4, 8);
      }
    }
    setForm({ ...form, data: formatted });
  };

  // Máscara para hora (HH:MM)
  const handleTimeChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 4) cleaned = cleaned.substring(0, 4);

    let formatted = "";
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
      if (cleaned.length >= 3) {
        formatted += ":" + cleaned.substring(2, 4);
      }
    }
    setForm({ ...form, hora: formatted });
  };

  // Máscara para valor (moeda)
  const handleValueChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned === "") {
      setForm({ ...form, valor: "" });
      return;
    }
    const number = parseInt(cleaned, 10);
    const formatted = (number / 100).toFixed(2);
    setForm({ ...form, valor: formatted });
  };

  // Máscara para telefone (XX) XXXXX-XXXX
  const handlePhoneChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 11) cleaned = cleaned.substring(0, 11);

    let formatted = "";
    if (cleaned.length > 0) {
      formatted = "(" + cleaned.substring(0, 2);
      if (cleaned.length >= 3) {
        formatted += ") " + cleaned.substring(2, 7);
      }
      if (cleaned.length >= 8) {
        formatted += "-" + cleaned.substring(7, 11);
      }
    }
    setForm({ ...form, telefone_contato: formatted });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Criar Proposta" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Carregando...</Text>
        </View>
      </View>
    );
  }

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

  const handleSubmit = async () => {
    console.log("[CREATE-PROPOSAL] Form data:", form);

    if (!form.titulo || !form.data || !form.valor || !form.local) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const convertDate = (dateStr: string) => {
      const parts = dateStr.split("/");
      if (parts.length !== 3) {
        console.warn("[CREATE-PROPOSAL] Invalid date format:", dateStr);
        return dateStr;
      }
      const converted = `${parts[2]}-${parts[1]}-${parts[0]}`;
      console.log(
        "[CREATE-PROPOSAL] Date converted:",
        dateStr,
        "->",
        converted,
      );
      return converted;
    };

    try {
      console.log("[CREATE-PROPOSAL] Sending proposal to API...");
      const proposalData = {
        id_artista: Number(id),
        titulo: form.titulo,
        descricao: form.descricao,
        local: form.local,
        endereco_completo: form.endereco_completo || undefined,
        tipo_evento: form.tipo_evento || undefined,
        duracao_horas: form.duracao_horas
          ? Number(form.duracao_horas)
          : undefined,
        publico_esperado: form.publico_esperado
          ? Number(form.publico_esperado)
          : undefined,
        equipamento_incluso: form.equipamento_incluso,
        nome_responsavel: form.nome_responsavel || undefined,
        telefone_contato: form.telefone_contato || undefined,
        observacoes: form.observacoes || undefined,
        data: convertDate(form.data),
        hora: form.hora || undefined,
        valor: form.valor.replace(/[^0-9.]/g, ""), // Remove "R$ " e outros caracteres
      };
      console.log(
        "[CREATE-PROPOSAL] Proposal data:",
        JSON.stringify(proposalData, null, 2),
      );

      const response = await api.criarProposta(proposalData);

      console.log("[CREATE-PROPOSAL] Response:", response);

      if (response.success) {
        Alert.alert("Sucesso", "Proposta enviada com sucesso!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Erro", response.error || "Erro ao criar proposta");
      }
    } catch (error) {
      console.error("[CREATE-PROPOSAL] Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message.replace("[Error: ", "").replace("]", "")
          : "Não foi possível criar a proposta";
      Alert.alert("Erro ao criar proposta", errorMessage);
    }
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
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Hora</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                placeholderTextColor="#666"
                value={form.hora}
                onChangeText={handleTimeChange}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Local *</Text>
            <TextInput
              style={styles.input}
              placeholder="Onde será o evento?"
              placeholderTextColor="#666"
              value={form.local}
              onChangeText={(text) => setForm({ ...form, local: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua, número, bairro, cidade"
              placeholderTextColor="#666"
              value={form.endereco_completo}
              onChangeText={(text) =>
                setForm({ ...form, endereco_completo: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Evento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Casamento, Aniversário, Show..."
              placeholderTextColor="#666"
              value={form.tipo_evento}
              onChangeText={(text) => setForm({ ...form, tipo_evento: text })}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Duração (horas)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 3"
                placeholderTextColor="#666"
                value={form.duracao_horas}
                onChangeText={(text) =>
                  setForm({
                    ...form,
                    duracao_horas: text.replace(/[^0-9.]/g, ""),
                  })
                }
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Público Esperado</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 200"
                placeholderTextColor="#666"
                value={form.publico_esperado}
                onChangeText={(text) =>
                  setForm({
                    ...form,
                    publico_esperado: text.replace(/\D/g, ""),
                  })
                }
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.switchGroup}>
            <View style={styles.switchInfo}>
              <Text style={styles.label}>Equipamento incluso (som/luz)</Text>
              <Text style={styles.switchDescription}>
                O local fornece equipamento de som e iluminação
              </Text>
            </View>
            <Switch
              value={form.equipamento_incluso}
              onValueChange={(value) =>
                setForm({ ...form, equipamento_incluso: value })
              }
              trackColor={{ false: "#333", true: "#FF6B35" }}
              thumbColor={form.equipamento_incluso ? "#FFF" : "#666"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Responsável</Text>
            <TextInput
              style={styles.input}
              placeholder="Quem é o responsável pelo evento?"
              placeholderTextColor="#666"
              value={form.nome_responsavel}
              onChangeText={(text) =>
                setForm({ ...form, nome_responsavel: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone de Contato</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#666"
              value={form.telefone_contato}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações Adicionais</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Informações extras sobre o evento..."
              placeholderTextColor="#666"
              value={form.observacoes}
              onChangeText={(text) => setForm({ ...form, observacoes: text })}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor (R$) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2500,00"
              placeholderTextColor="#666"
              value={form.valor ? `R$ ${form.valor}` : ""}
              onChangeText={handleValueChange}
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
  switchGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#18181B",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
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
