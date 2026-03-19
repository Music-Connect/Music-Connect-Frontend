import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  tipo_usuario: string;
  telefone?: string | null;
  cidade?: string | null;
  estado?: string | null;
  genero_musical?: string | null;
  descricao?: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  sessionLoaded: boolean;
  setUser: (user: AuthUser | null) => void;
  setSessionLoaded: (loaded: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  sessionLoaded: false,
  setUser: (user) => set({ user }),
  setSessionLoaded: (sessionLoaded) => set({ sessionLoaded }),
}));
