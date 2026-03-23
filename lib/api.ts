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

// ── Feed System ──

export interface Post {
  id: string;
  id_autor: string;
  conteudo: string;
  tipo: "post" | "disponibilidade" | "buscando";
  visibilidade: "publico" | "seguidores" | "privado";
  imagens: string[];
  video_url?: string | null;
  tags: string[];
  cidade?: string | null;
  estado?: string | null;
  curtidas_count: number;
  comentarios_count: number;
  created_at: string;
  updated_at: string;
  curtiu?: boolean;
  autor: {
    id: string;
    name: string;
    image: string | null;
    tipo_usuario: string;
    genero_musical?: string | null;
    cidade?: string | null;
    estado?: string | null;
  };
}

export interface Comentario {
  id: string;
  id_autor: string;
  id_post: string;
  id_comentario_pai?: string | null;
  conteudo: string;
  created_at: string;
  autor: { id: string; name: string; image: string | null; tipo_usuario: string };
  respostas?: Comentario[];
}

export interface Story {
  id: string;
  midia_url: string;
  tipo_midia: "imagem" | "video";
  duracao: number;
  views_count: number;
  created_at: string;
  expira_em: string;
  visto?: boolean;
}

export interface StoryGroup {
  user: { id: string; name: string; image: string | null; tipo_usuario: string };
  stories: Story[];
  hasUnseen: boolean;
}

export interface CursorMeta {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ArtistaRecomendado {
  id: string;
  name: string;
  image: string | null;
  tipo_usuario: string;
  genero_musical?: string | null;
  cidade?: string | null;
  estado?: string | null;
  descricao?: string | null;
  media_avaliacoes: number;
  total_avaliacoes: number;
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

  // ── Posts / Feed ──

  async getFeed(params?: {
    cursor?: string;
    limit?: number;
    tipo?: string;
    genero?: string;
    cidade?: string;
    estado?: string;
    tag?: string;
  }): Promise<{ data: Post[]; meta: CursorMeta }> {
    const qs = new URLSearchParams();
    if (params?.cursor) qs.append("cursor", params.cursor);
    if (params?.limit) qs.append("limit", String(params.limit));
    if (params?.tipo) qs.append("tipo", params.tipo);
    if (params?.genero) qs.append("genero", params.genero);
    if (params?.cidade) qs.append("cidade", params.cidade);
    if (params?.estado) qs.append("estado", params.estado);
    if (params?.tag) qs.append("tag", params.tag);

    const response = await fetch(`${API_BASE_URL}/api/posts?${qs}`, { credentials: "include" });
    if (!response.ok) throw new Error("Erro ao buscar feed");
    const result = await response.json();
    return { data: result.data || [], meta: result.meta };
  },

  async getFeedRecomendado(params?: { cursor?: string; limit?: number }): Promise<{ data: Post[]; meta: CursorMeta }> {
    const qs = new URLSearchParams();
    if (params?.cursor) qs.append("cursor", params.cursor);
    if (params?.limit) qs.append("limit", String(params.limit));

    const response = await fetch(`${API_BASE_URL}/api/posts/feed/recomendados?${qs}`, { credentials: "include" });
    if (!response.ok) throw new Error("Erro ao buscar feed recomendado");
    const result = await response.json();
    return { data: result.data || [], meta: result.meta };
  },

  async getPostById(id: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, { credentials: "include" });
    if (!response.ok) throw new Error("Erro ao buscar post");
    const result = await response.json();
    return result.data;
  },

  async getPostsByUser(userId: string, cursor?: string): Promise<{ data: Post[]; meta: CursorMeta }> {
    const qs = new URLSearchParams();
    if (cursor) qs.append("cursor", cursor);

    const response = await fetch(`${API_BASE_URL}/api/posts/usuario/${userId}?${qs}`, { credentials: "include" });
    if (!response.ok) throw new Error("Erro ao buscar posts do usuário");
    const result = await response.json();
    return { data: result.data || [], meta: result.meta };
  },

  async createPost(data: {
    conteudo: string;
    tipo?: string;
    visibilidade?: string;
    imagens?: string[];
    video_url?: string;
    tags?: string[];
  }): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar post");
    const result = await response.json();
    return result.data;
  },

  async deletePost(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Erro ao deletar post");
  },

  async curtirPost(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}/curtir`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Erro ao curtir post");
  },

  async descurtirPost(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}/curtir`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Erro ao descurtir post");
  },

  async getComentarios(postId: string, cursor?: string): Promise<{ data: Comentario[]; meta: CursorMeta }> {
    const qs = new URLSearchParams();
    if (cursor) qs.append("cursor", cursor);

    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comentarios?${qs}`, { credentials: "include" });
    if (!response.ok) throw new Error("Erro ao buscar comentários");
    const result = await response.json();
    return { data: result.data || [], meta: result.meta };
  },

  async createComentario(postId: string, data: { conteudo: string; id_comentario_pai?: string }): Promise<Comentario> {
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar comentário");
    const result = await response.json();
    return result.data;
  },

  async deleteComentario(postId: string, comentarioId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comentarios/${comentarioId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Erro ao deletar comentário");
  },

  // ── Stories ──

  async getStories(): Promise<StoryGroup[]> {
    const response = await fetch(`${API_BASE_URL}/api/stories`, { credentials: "include" });
    if (!response.ok) throw new Error("Erro ao buscar stories");
    const result = await response.json();
    return result.data || [];
  },

  async createStory(data: { midia_url: string; tipo_midia?: string; duracao?: number }): Promise<Story> {
    const response = await fetch(`${API_BASE_URL}/api/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar story");
    const result = await response.json();
    return result.data;
  },

  async deleteStory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/stories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Erro ao deletar story");
  },

  async visualizarStory(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/api/stories/${id}/visualizar`, {
      method: "POST",
      credentials: "include",
    });
  },

  // ── Recomendações ──

  async getRecomendacoes(params?: { page?: number; limit?: number }): Promise<ArtistaRecomendado[]> {
    const qs = new URLSearchParams();
    if (params?.page) qs.append("page", String(params.page));
    if (params?.limit) qs.append("limit", String(params.limit));

    const response = await fetch(`${API_BASE_URL}/api/recomendacoes/artistas?${qs}`, { credentials: "include" });
    if (!response.ok) throw new Error("Erro ao buscar recomendações");
    const result = await response.json();
    return result.data || [];
  },
};
