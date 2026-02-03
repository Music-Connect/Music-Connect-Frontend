import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: string;
}

export default function Button({
  label,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
  icon,
}: ButtonProps) {
  const variantStyles = getVariantStyles(variant);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles.container,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, variantStyles.text, textStyle]}>
        {icon ? `${icon} ` : ""}
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function getVariantStyles(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return {
        container: styles.primary,
        text: styles.primaryText,
      };
    case "secondary":
      return {
        container: styles.secondary,
        text: styles.secondaryText,
      };
    case "danger":
      return {
        container: styles.danger,
        text: styles.dangerText,
      };
    case "outline":
      return {
        container: styles.outline,
        text: styles.outlineText,
      };
    default:
      return {
        container: styles.primary,
        text: styles.primaryText,
      };
  }
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
  },
  primary: {
    backgroundColor: "#EC4899",
  },
  primaryText: {
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  secondaryText: {
    color: "#fff",
  },
  danger: {
    backgroundColor: "#EF444420",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  dangerText: {
    color: "#EF4444",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  outlineText: {
    color: "#fff",
  },
});
