import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
}

export default function Header({
  title,
  showBack = true,
  rightComponent,
  style,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.header, style]}>
      {showBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      <Text style={styles.title}>{title}</Text>

      {rightComponent ? rightComponent : <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#18181B",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  spacer: {
    width: 40,
  },
});
