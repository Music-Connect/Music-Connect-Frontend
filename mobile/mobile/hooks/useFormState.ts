import { useCallback, useState } from "react";

export function useFormState<T>(initialState: T) {
  const [form, setForm] = useState(initialState);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setForm(initialState);
  }, [initialState]);

  return { form, setForm, handleChange, reset };
}
