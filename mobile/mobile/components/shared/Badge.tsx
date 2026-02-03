import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

export type BadgeVariant = "info" | "success" | "warning" | "error";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  icon?: string;
}

export default function Badge({
  label,
  variant = "info",
  style,
  icon,
}: BadgeProps) {
  const variantStyles = getVariantStyles(variant);

  return (
    <View style={[styles.badge, variantStyles.container, style]}>
      <Text style={[styles.text, variantStyles.text]}>
        {icon ? `${icon} ` : ""}
        {label}
      </Text>
    </View>
  );
}

function getVariantStyles(variant: BadgeVariant) {
  switch (variant) {
    case "success":
      return {
        container: styles.success,
        text: styles.successText,
      };
    case "warning":
      return {
        container: styles.warning,
        text: styles.warningText,
      };
    case "error":
      return {
        container: styles.error,
        text: styles.errorText,
      };
    case "info":
    default:
      return {
        container: styles.info,
        text: styles.infoText,
      };
  }
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
  info: {
    backgroundColor: "#EC489920",
  },
  infoText: {
    color: "#EC4899",
  },
  success: {
    backgroundColor: "#10B98120",
  },
  successText: {
    color: "#10B981",
  },
  warning: {
    backgroundColor: "#F59E0B20",
  },
  warningText: {
    color: "#F59E0B",
  },
  error: {
    backgroundColor: "#EF444420",
  },
  errorText: {
    color: "#EF4444",
  },
});
