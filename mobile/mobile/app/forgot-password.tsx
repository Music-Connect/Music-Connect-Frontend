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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira seu e-mail");
      return;
    }

    // Mock - em produção enviar email de recuperação
    Alert.alert(
      "E-mail enviado!",
      "Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ],
    );
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

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔑</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Esqueceu sua senha?</Text>
        <Text style={styles.subtitle}>
          Sem problemas! Digite seu e-mail e enviaremos um link para redefinir
          sua senha.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>
              Enviar Link de Recuperação
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => router.back()}
          >
            <Text style={styles.backToLoginText}>← Voltar para o login</Text>
          </TouchableOpacity>
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
    marginBottom: 32,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 32,
    borderWidth: 2,
    borderColor: "#3F3F46",
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
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
  input: {
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#EC4899",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  backToLogin: {
    padding: 12,
    alignItems: "center",
  },
  backToLoginText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
});
