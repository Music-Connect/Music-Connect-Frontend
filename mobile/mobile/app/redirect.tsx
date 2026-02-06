import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import api from "@/services/api";

export default function RedirectScreen() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Check if user has token
        const hasToken = await api.hasToken();

        if (!hasToken) {
          // No token, go to login
          router.replace("/login");
          return;
        }

        // Get current user to check type
        const userResponse = await api.getCurrentUser();

        if (userResponse.success && userResponse.data?.user) {
          const user = userResponse.data.user;
          const userType = user.tipo_usuario || user.tipo;

          // Redirect based on user type
          if (userType === "artista") {
            router.replace("/(artist-tabs)");
          } else {
            router.replace("/(contractor-tabs)");
          }
        } else {
          // Failed to get user, go to login
          router.replace("/login");
        }
      } catch (error) {
        console.error("Redirect error:", error);
        // On error, go to login
        router.replace("/login");
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#EC4899" />
      <Text style={styles.text}>Redirecionando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 16,
  },
});
