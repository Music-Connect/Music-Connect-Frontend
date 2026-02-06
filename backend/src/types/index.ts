// Types e Interfaces para o sistema Music Connect

export interface Usuario {
  id_usuario: number;
  usuario: string;
  email: string;
  senha?: string; // Opcional porque não retornamos em respostas
  tipo_usuario: "artista" | "contratante";
  descricao?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  genero_musical?: string;
  cor_tema?: string;
  cor_banner?: string;
  imagem_perfil_url?: string;
  preco_minimo?: number;
  preco_maximo?: number;
  portfolio?: string[];
  spotify_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUsuarioDTO {
  usuario: string;
  email: string;
  senha: string;
  tipo_usuario: "artista" | "contratante";
  descricao?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  genero_musical?: string;
}

export interface UpdateUsuarioDTO {
  usuario?: string;
  descricao?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  genero_musical?: string;
  cor_tema?: string;
  cor_banner?: string;
  imagem_perfil_url?: string;
  preco_minimo?: number;
  preco_maximo?: number;
  portfolio?: string[];
  spotify_url?: string;
  instagram_url?: string;
  youtube_url?: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
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
  created_at?: Date;
  updated_at?: Date;
}

export interface CreatePropostaDTO {
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
}

export interface UpdatePropostaStatusDTO {
  status: "pendente" | "aceita" | "recusada" | "cancelada";
  mensagem_resposta?: string;
}

export interface Avaliacao {
  id_avaliacao: number;
  id_avaliador: number;
  id_avaliado: number;
  nota: number;
  comentario?: string;
  created_at?: Date;
}

export interface CreateAvaliacaoDTO {
  id_avaliador: number;
  id_avaliado: number;
  nota: number;
  comentario?: string;
}

export interface PropostaComDetalhes extends Proposta {
  nome_outro?: string;
  imagem_perfil_url?: string;
  email_outro?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  user: Omit<Usuario, "senha">;
  token: string;
  type: "artista" | "contratante";
}

export interface QueryParams {
  search?: string;
  genero?: string;
  local?: string;
  cidade?: string;
  estado?: string;
  tipo_usuario?: "artista" | "contratante";
}
