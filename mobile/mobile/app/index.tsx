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

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    {
      icon: "🎵",
      title: "Conexão direta",
      description:
        "Conecte-se facilmente com outros artistas, produtores e locais.",
    },
    {
      icon: "⭐",
      title: "Aumenta sua visibilidade",
      description:
        "Seja notado por profissionais da indústria musical e expanda sua carreira.",
    },
    {
      icon: "✨",
      title: "4.8+ Avaliações",
      description: "Avaliado positivamente por críticos.",
    },
    {
      icon: "🧩",
      title: "Funcional e Adaptável",
      description:
        "Uma plataforma criada para atender às suas necessidades únicas.",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Music</Text>
            <Text style={styles.logoAccent}>Connect</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.headerButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Conecte{"\n"}
              <Text style={styles.heroAccent}>talentos.</Text>
            </Text>
            <Text style={styles.heroDescription}>
              Uma plataforma para artistas, bandas, produtores, e fãs se
              encontrarem através da música.
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/profile-selector")}
              >
                <Text style={styles.primaryButtonText}>Começar Agora</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.heroImage}>
            <View style={styles.heroImagePlaceholder}>
              <Text style={styles.heroImageIcon}>🎸</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>
            Navegue pelo universo da música com o Music Connect: sua rede de
            oportunidades.
          </Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Pronto para começar?</Text>
          <Text style={styles.ctaDescription}>
            Junte-se a milhares de artistas e contratantes que já usam o Music
            Connect.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/profile-selector")}
          >
            <Text style={styles.ctaButtonText}>Criar Conta Grátis</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FCD34D",
  },
  logoAccent: {
    fontSize: 24,
    fontWeight: "900",
    color: "#EC4899",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  hero: {
    padding: 20,
    paddingTop: 40,
  },
  heroContent: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
    lineHeight: 56,
  },
  heroAccent: {
    color: "#EC4899",
  },
  heroDescription: {
    fontSize: 16,
    color: "#999",
    marginBottom: 32,
    lineHeight: 24,
  },
  heroButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#EC4899",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  heroImage: {
    alignItems: "center",
  },
  heroImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3F3F46",
  },
  heroImageIcon: {
    fontSize: 80,
  },
  features: {
    padding: 20,
    paddingTop: 60,
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 32,
    lineHeight: 36,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: "#18181B",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  cta: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  ctaDescription: {
    fontSize: 16,
    color: "#999",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: "#FCD34D",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});
