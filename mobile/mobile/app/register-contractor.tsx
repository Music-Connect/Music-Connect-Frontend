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
} from "react-native";
import { useRouter } from "expo-router";

export default function RegisterContractorScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    usuario: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    organizacao: "",
    localAtuacao: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = () => {
    if (!form.usuario || !form.email || !form.senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    // Mock register - em produção conectar com a API
    Alert.alert("Sucesso", "Conta criada com sucesso!", [
      {
        text: "OK",
        onPress: () => router.replace("/(tabs)"),
      },
    ]);
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
            <Text style={styles.icon}>🎧</Text>
          </View>
          <Text style={styles.title}>Cadastro de Contratante</Text>
          <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#666"
              value={form.usuario}
              onChangeText={(text) => handleChange("usuario", text)}
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
              placeholder="Mínimo 8 caracteres"
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Organização/Empresa</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da sua empresa"
              placeholderTextColor="#666"
              value={form.organizacao}
              onChangeText={(text) => handleChange("organizacao", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localização</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: São Paulo, SP"
              placeholderTextColor="#666"
              value={form.localAtuacao}
              onChangeText={(text) => handleChange("localAtuacao", text)}
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Criar Conta</Text>
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
    backgroundColor: "#FCD34D20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#FCD34D",
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
  registerButton: {
    backgroundColor: "#FCD34D",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonText: {
    color: "#000",
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
