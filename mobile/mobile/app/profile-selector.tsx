import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function ProfileSelectorScreen() {
  const router = useRouter();

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

        {/* Title */}
        <Text style={styles.title}>Escolha seu perfil</Text>
        <Text style={styles.subtitle}>
          Você quer se cadastrar como artista ou como contratante?
        </Text>

        {/* Cards */}
        <View style={styles.cards}>
          <TouchableOpacity
            style={[styles.card, styles.cardArtist]}
            activeOpacity={0.8}
            onPress={() => router.push("/register-artist")}
          >
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>🎤</Text>
            </View>
            <Text style={styles.cardTitle}>Sou Artista</Text>
            <Text style={styles.cardDescription}>
              Divulgue seu talento e receba convites para eventos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardContractor]}
            activeOpacity={0.8}
            onPress={() => router.push("/register-contractor")}
          >
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>🎧</Text>
            </View>
            <Text style={styles.cardTitle}>Sou Contratante</Text>
            <Text style={styles.cardDescription}>
              Encontre artistas e bandas para seus eventos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.footerLink}>Entrar</Text>
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
    marginBottom: 24,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 48,
    textAlign: "center",
    lineHeight: 24,
  },
  cards: {
    gap: 20,
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#18181B",
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
  },
  cardArtist: {
    borderColor: "#EC4899",
  },
  cardContractor: {
    borderColor: "#FCD34D",
  },
  cardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardEmoji: {
    fontSize: 40,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
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
