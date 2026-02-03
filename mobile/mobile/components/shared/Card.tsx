import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "ghost";
}

export default function Card({
  children,
  style,
  variant = "default",
}: CardProps) {
  return (
    <View style={[styles.card, variant === "ghost" && styles.ghostCard, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#18181B",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3F3F46",
    padding: 16,
  },
  ghostCard: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
});
