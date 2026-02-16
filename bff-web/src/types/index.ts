// Shared types for BFF Web

export interface Usuario {
  id_usuario: number;
  usuario: string;
  email: string;
  tipo_usuario: "artista" | "contratante";
  descricao?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  genero_musical?: string;
  cor_tema?: string;
  cor_banner?: string;
  imagem_perfil_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Proposta {
  id_proposta: number;
  id_contratante: number;
  id_artista: number;
  titulo: string;
  descricao: string;
  data_evento: string;
  local_evento: string;
  valor_oferecido: number;
  status: "pendente" | "aceita" | "recusada" | "cancelada";
  mensagem_resposta?: string;
  created_at: string;
  updated_at: string;
}

export interface PropostaComDetalhes extends Proposta {
  // Campos opcionais do backend (variam conforme contexto)
  nome_contratante?: string;
  email_contratante?: string;
  nome_artista?: string;
  email_artista?: string;
  nome_outro?: string;
  email_outro?: string;
  imagem_perfil_url?: string;
  artista_genero?: string;
}

export interface Avaliacao {
  id_avaliacao: number;
  id_avaliador: number;
  id_avaliado: number;
  nota: number;
  comentario?: string;
  created_at: string;
}

export interface AvaliacaoComAvaliador extends Avaliacao {
  avaliador_nome: string;
  avaliador_foto?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Backend direct response types (not wrapped in data)
export interface BackendAuthResponse {
  success: boolean;
  user: Omit<Usuario, "senha">;
  token: string;
  type: "artista" | "contratante";
  message?: string;
}

export interface BackendMediaAvaliacoes {
  total_avaliacoes: number;
  media_nota: number;
}

// Web-specific response types
export interface WebDashboardData {
  usuario: Usuario;
  propostas_recentes: PropostaComDetalhes[];
  stats: {
    total_propostas: number;
    propostas_pendentes: number;
    propostas_aceitas: number;
    media_avaliacoes?: number;
  };
}

export interface WebExploreData {
  artistas: Usuario[];
  filters: {
    generos: string[];
    locais: string[];
  };
  total: number;
}
