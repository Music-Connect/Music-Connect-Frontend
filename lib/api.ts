const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  tipo_usuario: "artista" | "contratante";
  descricao?: string | null;
  telefone?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cor_tema?: string | null;
  cor_banner?: string | null;
  genero_musical?: string | null;
  preco_minimo?: number | null;
  preco_maximo?: number | null;
  portfolio?: string[] | null;
  spotify_url?: string | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Proposta {
  id_proposta: number;
  id_contratante: string;
  id_artista: string;
  titulo: string;
  descricao: string;
  local_evento: string;
  endereco_completo?: string | null;
  tipo_evento?: string | null;
  duracao_horas?: number | null;
  publico_esperado?: number | null;
  equipamento_incluso?: boolean | null;
  nome_responsavel?: string | null;
  telefone_contato?: string | null;
  observacoes?: string | null;
  data_evento: string;
  hora_evento?: string | null;
  valor_oferecido: number;
  status: "pendente" | "aceita" | "recusada" | "cancelada";
  mensagem_resposta?: string | null;
  created_at: string;
  updated_at?: string | null;
  contratante?: { id: string; name: string; image: string | null };
  artista?: { id: string; name: string; image: string | null; genero_musical?: string | null };
}

export interface Avaliacao {
  id_avaliacao: number;
  id_avaliador: string;
  id_avaliado: string;
  nota: number;
  comentario: string;
  created_at: string;
  avaliador?: { name: string; image: string | null };
}

export const api = {
  // Users
  async getUsers(search?: string): Promise<User[]> {
    const params = new URLSearchParams({ limit: "50" });
    if (search) params.append("local", search);

    const response = await fetch(`${API_BASE_URL}/api/artistas?${params}`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar usuários");

    const data = await response.json();
    return data.data || [];
  },

  async getUserById(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar usuário");

    const data = await response.json();
    return data.data;
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao atualizar usuário");

    const result = await response.json();
    return result.data;
  },

  // Artistas
  async getArtistas(filters?: { genero?: string; local?: string }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.genero) params.append("genero", filters.genero);
    if (filters?.local) params.append("local", filters.local);

    const url = params.toString()
      ? `${API_BASE_URL}/api/artistas?${params}`
      : `${API_BASE_URL}/api/artistas`;

    const response = await fetch(url, { credentials: "include" });

    if (!response.ok) throw new Error("Erro ao buscar artistas");

    const data = await response.json();
    return data.data || [];
  },

  async getArtistaById(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/artistas/${id}`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar artista");

    const data = await response.json();
    return data.data;
  },

  // Propostas
  async getPropostasRecebidas(): Promise<Proposta[]> {
    const response = await fetch(`${API_BASE_URL}/api/propostas/recebidas`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar propostas recebidas");

    const data = await response.json();
    return data.data || [];
  },

  async getPropostasEnviadas(): Promise<Proposta[]> {
    const response = await fetch(`${API_BASE_URL}/api/propostas/enviadas`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar propostas enviadas");

    const data = await response.json();
    return data.data || [];
  },

  async getPropostaById(id: number): Promise<Proposta> {
    const response = await fetch(`${API_BASE_URL}/api/propostas/${id}`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar proposta");

    const data = await response.json();
    return data.data;
  },

  async createProposta(data: Partial<Proposta>): Promise<Proposta> {
    const response = await fetch(`${API_BASE_URL}/api/propostas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("Erro ao atualizar status da proposta");

    const data = await response.json();
    return data.data;
  },

  // Avaliações
  async getAvaliacoesByUserId(id: string): Promise<Avaliacao[]> {
    const response = await fetch(`${API_BASE_URL}/api/avaliacoes/usuario/${id}`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar avaliações");

    const data = await response.json();
    return data.data || [];
  },

  async getMediaAvaliacoes(id: string): Promise<{ total_avaliacoes: number; media_nota: number }> {
    const response = await fetch(`${API_BASE_URL}/api/avaliacoes/usuario/${id}/media`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar média de avaliações");

    const data = await response.json();
    return data.data || { total_avaliacoes: 0, media_nota: 0 };
  },

  async createAvaliacao(data: Partial<Avaliacao>): Promise<Avaliacao> {
    const response = await fetch(`${API_BASE_URL}/api/avaliacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao criar avaliação");

    const result = await response.json();
    return result.data;
  },
};
