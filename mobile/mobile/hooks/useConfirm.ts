import { useCallback } from "react";
import { Alert, AlertButton } from "react-native";

interface ConfirmOptions {
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  isDangerous?: boolean;
}

export function useConfirm() {
  const confirm = useCallback(
    (options: ConfirmOptions, onConfirm: () => void, onCancel?: () => void) => {
      const buttons: AlertButton[] = [
        {
          text: options.cancelText || "Cancelar",
          style: "cancel",
          onPress: onCancel,
        },
        {
          text: options.confirmText || "Confirmar",
          style: options.isDangerous ? "destructive" : "default",
          onPress: onConfirm,
        },
      ];

      Alert.alert(options.title, options.message, buttons);
    },
    [],
  );

  return { confirm };
}
