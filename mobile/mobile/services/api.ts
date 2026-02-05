/**
 * Mobile API Service
 * Communicates with BFF Mobile layer (localhost:3002 in development)
 * Handles authentication via token storage and headers
 */

import Constants from "expo-constants";
import { Platform } from "react-native";

const getDefaultBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;
  const host = hostUri?.split(":")?.[0];

  if (host) {
    return `http://${host}:3002`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3002";
  }

  return "http://localhost:3002";
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getDefaultBaseUrl();

// In-memory token storage (will be lost on app refresh)
// For persistent storage, consider using AsyncStorage or SQLite
let storedToken: string | null = null;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface LoginPayload {
  email: string;
  senha: string;
}

interface RegisterPayload {
  email: string;
  senha: string;
  nome: string;
  tipo: "artista" | "contratante";
  telefone?: string;
}

interface Usuario {
  id_usuario?: string;
  email: string;
  nome: string;
  tipo: string;
  bio?: string;
  foto_perfil?: string;
  telefone?: string;
}

interface Artista extends Usuario {
  generos?: string[];
  preco_minimo?: number;
  velocidade_entrega?: string;
  portfolio_links?: string[];
}

interface Proposta {
  id_proposta: string;
  id_contratante: string;
  id_artista: string;
  descricao: string;
  valor_oferecido: number;
  status: "pendente" | "aceita" | "rejeitada" | "concluida";
  data_criacao: string;
  data_atualizacao: string;
}

interface Avaliacao {
  id_avaliacao: string;
  id_proposta: string;
  id_avaliador: string;
  id_avaliado: string;
  nota: number;
  comentario: string;
  data_criacao: string;
}

class MobileAPI {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Store token in memory
   */
  private async saveToken(token: string): Promise<void> {
    storedToken = token;
  }

  /**
   * Retrieve token from memory
   */
  private async getToken(): Promise<string | null> {
    return storedToken;
  }

  /**
   * Clear stored token
   */
  async clearToken(): Promise<void> {
    storedToken = null;
  }

  /**
   * Make authenticated API request
   * Automatically includes Authorization header with stored token
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Get token from storage and add to headers
    const token = await this.getToken();
    const headers: Record<string, string> = { ...this.headers };

    // Safely merge additional headers
    if (typeof options.headers === "object" && options.headers !== null) {
      Object.entries(options.headers as Record<string, string>).forEach(
        ([key, value]) => {
          headers[key] = value;
        },
      );
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (error) {
      if (process.env.EXPO_PUBLIC_DEBUG === "true") {
        console.error("[API] Network error:", url, error);
      }
      throw new Error(
        `Network request failed. Verifique se o BFF Mobile está rodando em ${this.baseURL}`,
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = (await response.json()) as T;
    return data;
  }

  // ========== AUTHENTICATION ============

  async login(
    payload: LoginPayload,
  ): Promise<ApiResponse<{ user: Usuario; token?: string }>> {
    const response = await this.request<
      ApiResponse<{ user: Usuario; token?: string }>
    >("/api/mobile/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Save token if login succeeds
    const token = response.data?.token || (response as any).token;
    if (response.success && token) {
      await this.saveToken(token);
    }

    return response;
  }

  async registerArtista(
    payload: RegisterPayload,
  ): Promise<ApiResponse<{ user: Artista; token?: string }>> {
    const response = await this.request<
      ApiResponse<{ user: Artista; token?: string }>
    >("/api/mobile/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        tipo: "artista",
      }),
    });

    // Save token if registration succeeds
    const token = response.data?.token || (response as any).token;
    if (response.success && token) {
      await this.saveToken(token);
    }

    return response;
  }

  async registerContratante(
    payload: RegisterPayload,
  ): Promise<ApiResponse<{ user: Usuario; token?: string }>> {
    const response = await this.request<
      ApiResponse<{ user: Usuario; token?: string }>
    >("/api/mobile/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        tipo: "contratante",
      }),
    });

    // Save token if registration succeeds
    const token = response.data?.token || (response as any).token;
    if (response.success && token) {
      await this.saveToken(token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await this.request<ApiResponse<null>>(
        "/api/mobile/auth/logout",
        {
          method: "POST",
        },
      );

      // Clear token on logout
      await this.clearToken();

      return response;
    } catch (error) {
      // Clear token even if logout fails
      await this.clearToken();
      throw error;
    }
  }

  // ============ USUARIOS ============

  async getCurrentUser(): Promise<ApiResponse<{ user: Usuario }>> {
    return this.request("/api/mobile/usuarios/me");
  }

  async updateProfile(
    data: Partial<Usuario>,
  ): Promise<ApiResponse<{ user: Usuario }>> {
    return this.request("/api/mobile/usuarios/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getUsuario(id: string): Promise<ApiResponse<{ user: Usuario }>> {
    return this.request(`/api/mobile/usuarios/${id}`);
  }

  // ============ ARTISTAS ============

  async listarArtistas(filtros?: {
    genero?: string;
    preco_min?: number;
    preco_max?: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ artistas: Artista[]; total: number }>> {
    const query = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }

    return this.request(
      `/api/mobile/artistas${query.toString() ? "?" + query.toString() : ""}`,
    );
  }

  async getArtistaDetalhes(
    id: string,
  ): Promise<ApiResponse<{ artista: Artista }>> {
    return this.request(`/api/mobile/artistas/${id}`);
  }

  async getPropostasArtistaRecebidas(): Promise<
    ApiResponse<{ propostas: Proposta[] }>
  > {
    return this.request("/api/mobile/artistas/me/propostas");
  }

  // ============ PROPOSTAS ============

  async criarProposta(data: {
    id_artista: string;
    descricao: string;
    valor_oferecido: number;
  }): Promise<ApiResponse<{ proposta: Proposta }>> {
    return this.request("/api/mobile/propostas", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async listarMinhasPropostas(): Promise<
    ApiResponse<{ propostas: Proposta[] }>
  > {
    return this.request("/api/mobile/propostas/me");
  }

  async getProposta(id: string): Promise<ApiResponse<{ proposta: Proposta }>> {
    return this.request(`/api/mobile/propostas/${id}`);
  }

  async atualizarStatusProposta(
    id: string,
    status: "aceita" | "rejeitada" | "concluida",
  ): Promise<ApiResponse<{ proposta: Proposta }>> {
    return this.request(`/api/mobile/propostas/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async deletarProposta(id: string): Promise<ApiResponse<null>> {
    return this.request(`/api/mobile/propostas/${id}`, {
      method: "DELETE",
    });
  }

  // ============ AVALIACOES ============

  async avaliarUsuario(data: {
    id_proposta: string;
    id_avaliado: string;
    nota: number;
    comentario: string;
  }): Promise<ApiResponse<{ avaliacao: Avaliacao }>> {
    return this.request("/api/mobile/avaliacoes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAvaliacoes(
    id_usuario: string,
  ): Promise<ApiResponse<{ avaliacoes: Avaliacao[]; media: number }>> {
    return this.request(`/api/mobile/avaliacoes/usuario/${id_usuario}`);
  }

  // ============ HELPER METHODS ============

  /**
   * Check if user is authenticated by attempting to fetch current user
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear local storage and cookies on logout
   */
  async clearSession(): Promise<void> {
    await this.logout();
    // Note: httpOnly cookies are cleared by the server
    // Local storage clearing would be done by the app
  }
}

// Create and export singleton instance as default
const mobileAPI = new MobileAPI();
export default mobileAPI;

// Export types
export type {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  Usuario,
  Artista,
  Proposta,
  Avaliacao,
};
