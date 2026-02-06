// API Configuration and Service Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper to get common headers
function getHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

export interface User {
  id_usuario: number;
  usuario: string;
  email: string;
  tipo_usuario: "artista" | "contratante";
  descricao?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  cor_tema?: string;
  cor_banner?: string;
  imagem_perfil_url?: string;
  genero_musical?: string;
  preco_minimo?: number;
  preco_maximo?: number;
  portfolio?: string[];
  spotify_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Proposta {
  id_proposta: number;
  id_contratante: number;
  id_artista: number;
  titulo: string;
  descricao: string;
  local_evento: string;
  endereco_completo?: string;
  tipo_evento?: string;
  duracao_horas?: number;
  publico_esperado?: number;
  equipamento_incluso?: boolean;
  nome_responsavel?: string;
  telefone_contato?: string;
  observacoes?: string;
  data_evento: string;
  hora_evento?: string;
  valor_oferecido: number;
  status: "pendente" | "aceita" | "recusada" | "cancelada";
  mensagem_resposta?: string;
  created_at: string;
  updated_at?: string;
  nome_outro?: string;
  imagem_perfil_url?: string;
  nome_artista?: string;
  nome_contratante?: string;
}

export interface Avaliacao {
  id_avaliacao: number;
  id_avaliador: number;
  id_avaliado: number;
  nota: number;
  comentario: string;
  created_at: string;
}

// API Functions
export const api = {
  // Auth
  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, senha: password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao fazer login");
    }

    return response.json();
  },

  async register(data: Partial<User> & { senha: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao registrar");
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer logout");
    }
  },

  async forgotPassword(
    email: string,
  ): Promise<{ message: string; resetToken?: string }> {
    const response = await fetch(
      `${API_BASE_URL}/api/usuarios/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao solicitar recuperação de senha");
    }

    return response.json();
  },

  async resetPassword(
    token: string,
    novaSenha: string,
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/api/usuarios/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao redefinir senha");
    }

    return response.json();
  },

  // Users
  async getUsers(search?: string): Promise<User[]> {
    const url = search
      ? `${API_BASE_URL}/api/usuarios?search=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/api/usuarios`;

    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar usuários");
    }

    const data = await response.json();
    return data.data || [];
  },

  async getUserById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar usuário");
    }

    const data = await response.json();
    return data.data;
  },

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar usuário");
    }

    const result = await response.json();
    return result.data;
  },

  // Artistas
  async getArtistas(filters?: {
    genero?: string;
    local?: string;
  }): Promise<User[]> {
    let url = `${API_BASE_URL}/api/artistas`;
    const params = new URLSearchParams();

    if (filters?.genero) params.append("genero", filters.genero);
    if (filters?.local) params.append("local", filters.local);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar artistas");
    }

    const data = await response.json();
    return data.data || [];
  },

  async getArtistaById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/artistas/${id}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar artista");
    }

    const data = await response.json();
    return data.data;
  },

  // Propostas
  async getPropostasRecebidas(id_artista: number): Promise<Proposta[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/propostas/recebidas?id_artista=${id_artista}`,
      { credentials: "include" },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar propostas recebidas");
    }

    const data = await response.json();
    return data.data || [];
  },

  async getPropostasEnviadas(id_contratante: number): Promise<Proposta[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/propostas/enviadas?id_contratante=${id_contratante}`,
      { credentials: "include" },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar propostas enviadas");
    }

    const data = await response.json();
    return data.data || [];
  },

  async getPropostaById(id: number): Promise<Proposta> {
    const response = await fetch(`${API_BASE_URL}/api/propostas/${id}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar proposta");
    }

    const data = await response.json();
    return data.data;
  },

  async createProposta(data: Partial<Proposta>): Promise<Proposta> {
    const response = await fetch(`${API_BASE_URL}/api/propostas`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao criar proposta");
    }

    const result = await response.json();
    return result.data;
  },

  async updatePropostaStatus(id: number, status: string): Promise<Proposta> {
    const response = await fetch(`${API_BASE_URL}/api/propostas/${id}/status`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar status da proposta");
    }

    const data = await response.json();
    return data.data;
  },

  // Avaliações
  async getAvaliacoesByUserId(id: number): Promise<Avaliacao[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/avaliacoes/usuario/${id}`,
      { credentials: "include" },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar avaliações");
    }

    const data = await response.json();
    return data.data || [];
  },

  async getMediaAvaliacoes(
    id: number,
  ): Promise<{ total_avaliacoes: number; media_nota: number }> {
    const response = await fetch(
      `${API_BASE_URL}/api/avaliacoes/usuario/${id}/media`,
      { credentials: "include" },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar média de avaliações");
    }

    const data = await response.json();
    return data.data || { total_avaliacoes: 0, media_nota: 0 };
  },

  async createAvaliacao(data: Partial<Avaliacao>): Promise<Avaliacao> {
    const response = await fetch(`${API_BASE_URL}/api/avaliacoes`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar avaliação");
    }

    const result = await response.json();
    return result.data;
  },
};
