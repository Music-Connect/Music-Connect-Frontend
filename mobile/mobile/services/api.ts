/**
 * Mobile API Service
 * Communicates with BFF Mobile layer (localhost:3002 in development)
 * Handles authentication via token storage and headers
 */

import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Token storage key for AsyncStorage
const TOKEN_STORAGE_KEY = "@music-connect:auth-token";

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
  id_usuario?: string | number;
  email: string;
  usuario?: string; // Canonical name from backend
  tipo_usuario?: "artista" | "contratante"; // Canonical type from backend
  descricao?: string; // Canonical description from backend
  imagem_perfil_url?: string; // Canonical image URL from backend
  telefone?: string;
  // Aliases for mobile backwards compatibility (deprecated)
  nome?: string; // Alias for usuario
  tipo?: string; // Alias for tipo_usuario
  bio?: string; // Alias for descricao
  foto_perfil?: string; // Alias for imagem_perfil_url
}

interface Artista extends Usuario {
  generos?: string[];
  preco_minimo?: number;
  velocidade_entrega?: string;
  portfolio_links?: string[];
}

interface Proposta {
  id_proposta: string | number;
  id_contratante: string | number;
  id_artista: string | number;
  titulo?: string;
  descricao: string;
  local_evento?: string;
  data_evento?: string;
  hora_evento?: string;
  valor_oferecido: number;
  status: "pendente" | "aceita" | "recusada" | "cancelada";
  mensagem_resposta?: string;
  created_at?: string;
  updated_at?: string;
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
   * Store token persistently in AsyncStorage
   */
  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      console.log("[API] Token saved successfully");
    } catch (error) {
      console.error("[API] Error saving token:", error);
    }
  }

  /**
   * Retrieve token from AsyncStorage
   */
  private async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (process.env.EXPO_PUBLIC_DEBUG === "true" || true) {
        console.log("[API] getToken called:", {
          hasToken: !!token,
          tokenLength: token?.length || 0,
        });
      }
      return token;
    } catch (error) {
      console.error("[API] Error retrieving token:", error);
      return null;
    }
  }

  /**
   * Clear stored token from AsyncStorage
   */
  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      console.log("[API] Token cleared successfully");
    } catch (error) {
      console.error("[API] Error clearing token:", error);
    }
  }

  /**
   * Make authenticated API request
   * Automatically includes Authorization header with stored token
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Get token from storage and add to headers
    const token = await this.getToken();

    console.log("[API] Request details:", {
      endpoint,
      requireAuth,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "none",
    });

    // Check if authentication is required but token is missing
    if (requireAuth && !token) {
      console.error("[API] Authentication required but no token found!");
      console.error("[API] This should not happen after successful login!");
      throw new Error("Token não fornecido");
    }

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
      console.log("[API] Authorization header set:", {
        headerExists: !!headers.Authorization,
        preview: headers.Authorization.substring(0, 30) + "...",
      });
    }

    console.log("[API] Making fetch request to:", url);

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

      console.error("[API] Request failed:", {
        url,
        status: response.status,
        errorData,
        errorMessage,
      });

      throw new Error(errorMessage);
    }

    const data = (await response.json()) as T;
    return data;
  }

  // ========== AUTHENTICATION ============

  async login(
    payload: LoginPayload,
  ): Promise<ApiResponse<{ user: Usuario; token?: string }>> {
    console.log("[API] Attempting login...");
    const response = await this.request<
      ApiResponse<{ user: Usuario; token?: string }>
    >(
      "/api/mobile/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false,
    );

    console.log("[API] Login response received:", {
      success: response.success,
      hasToken: !!(response.data?.token || (response as any).token),
    });

    // Save token if login succeeds
    const token = response.data?.token || (response as any).token;
    if (response.success && token) {
      console.log("[API] Saving token to AsyncStorage...");
      await this.saveToken(token);

      // Verify token was saved
      const savedToken = await this.getToken();
      console.log("[API] Token saved and verified:", !!savedToken);
    } else {
      console.log("[API] No token to save - response:", response);
    }

    return response;
  }

  async registerArtista(
    payload: RegisterPayload,
  ): Promise<ApiResponse<{ user: Artista; token?: string }>> {
    const response = await this.request<
      ApiResponse<{ user: Artista; token?: string }>
    >(
      "/api/mobile/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          tipo: "artista",
        }),
      },
      false,
    );

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
    >(
      "/api/mobile/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          tipo: "contratante",
        }),
      },
      false,
    );

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

  async forgotPassword(
    email: string,
  ): Promise<ApiResponse<{ message: string; resetToken?: string }>> {
    return this.request<ApiResponse<{ message: string; resetToken?: string }>>(
      "/api/mobile/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
      false,
    );
  }

  async resetPassword(
    token: string,
    novaSenha: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(
      "/api/mobile/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({ token, novaSenha }),
      },
      false,
    );
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

  async getPropostasArtistaRecebidas(
    id_artista: number,
  ): Promise<ApiResponse<{ propostas: Proposta[] }>> {
    return this.request(
      `/api/mobile/propostas/recebidas?id_artista=${id_artista}`,
    );
  }

  // ============ PROPOSTAS ============

  async criarProposta(data: {
    id_artista: number;
    titulo: string;
    descricao: string;
    local: string;
    data: string;
    valor: string;
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

  async listarRecomendacoes(filtros?: {
    generos?: string;
    local?: string;
    tipo_evento?: string;
    limit?: number;
    offset?: number;
  }): Promise<
    ApiResponse<{
      propostas: Proposta[];
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    }>
  > {
    const query = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }

    return this.request(
      `/api/mobile/propostas/recomendacoes${query.toString() ? "?" + query.toString() : ""}`,
    );
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

  async responderProposta(
    id: string,
    status: "aceita" | "rejeitada",
  ): Promise<ApiResponse<{ proposta: Proposta }>> {
    return this.atualizarStatusProposta(id, status);
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
   * Check if there's a stored token
   */
  async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Check if user is authenticated by attempting to fetch current user
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) {
        return false;
      }
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
