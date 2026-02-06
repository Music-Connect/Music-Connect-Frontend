import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../services/api";

export default function RegisterArtistScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    tipo: "artista" as const,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = async () => {
    if (!form.nome || !form.email || !form.senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    if (form.senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.registerArtista({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        tipo: "artista",
        telefone: form.telefone,
      });

      if (response.success && response.data?.user) {
        Alert.alert("Sucesso", "Conta criada com sucesso!", [
          {
            text: "OK",
            onPress: () => router.replace("/redirect"),
          },
        ]);
      } else {
        Alert.alert("Erro", response.error || "Erro ao registrar");
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Erro ao conectar com o servidor",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎤</Text>
          </View>
          <Text style={styles.title}>Cadastro de Artista</Text>
          <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome Artístico <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome artístico"
              placeholderTextColor="#666"
              value={form.nome}
              onChangeText={(text) => handleChange("nome", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              E-mail <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#666"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Senha <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#666"
              value={form.senha}
              onChangeText={(text) => handleChange("senha", text)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Confirmar Senha <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a senha novamente"
              placeholderTextColor="#666"
              value={form.confirmarSenha}
              onChangeText={(text) => handleChange("confirmarSenha", text)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#666"
              value={form.telefone}
              onChangeText={(text) => handleChange("telefone", text)}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              isLoading && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EC489920",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#EC4899",
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  registerButton: {
    backgroundColor: "#EC4899",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  footerText: {
    color: "#999",
    fontSize: 14,
  },
  footerLink: {
    color: "#EC4899",
    fontSize: 14,
    fontWeight: "700",
  },
});
