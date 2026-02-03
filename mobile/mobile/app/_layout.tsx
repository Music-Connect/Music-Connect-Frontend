import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile-selector"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="register-artist" options={{ headerShown: false }} />
        <Stack.Screen
          name="register-contractor"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="artist/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="proposal/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="proposals-sent" options={{ headerShown: false }} />
        <Stack.Screen
          name="proposal-sent/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="create-proposal" options={{ headerShown: false }} />
        <Stack.Screen name="reviews" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="advanced-search" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
