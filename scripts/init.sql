-- Music Connect Database Schema
-- This file is executed when PostgreSQL container starts

-- Drop tables if they exist (for development only)
DROP TABLE IF EXISTS avaliacoes CASCADE;
DROP TABLE IF EXISTS propostas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Drop types if they exist
DROP TYPE IF EXISTS tipo_usuario CASCADE;
DROP TYPE IF EXISTS status_proposta CASCADE;

-- Create ENUM types
CREATE TYPE tipo_usuario AS ENUM ('artista', 'contratante');
CREATE TYPE status_proposta AS ENUM ('pendente', 'aceita', 'recusada', 'cancelada');

-- Usuarios table
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  usuario VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo_usuario tipo_usuario NOT NULL,
  telefone VARCHAR(20),
  imagem_perfil_url TEXT,
  descricao TEXT,
  cidade VARCHAR(255),
  estado VARCHAR(2),
  
  -- Campos específicos para artistas
  genero_musical VARCHAR(100),
  preco_minimo DECIMAL(10, 2),
  preco_maximo DECIMAL(10, 2),
  portfolio TEXT[], -- Array de URLs
  spotify_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  
  -- Customização
  cor_tema VARCHAR(7),
  cor_banner VARCHAR(7),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Propostas table
CREATE TABLE propostas (
  id_proposta SERIAL PRIMARY KEY,
  id_contratante INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_artista INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  data_evento DATE NOT NULL,
  hora_evento TIME,
  local_evento VARCHAR(255) NOT NULL,
  endereco_completo TEXT,
  tipo_evento VARCHAR(100),
  duracao_horas DECIMAL(3, 1),
  publico_esperado INTEGER,
  equipamento_incluso BOOLEAN DEFAULT false,
  nome_responsavel VARCHAR(255),
  telefone_contato VARCHAR(20),
  observacoes TEXT,
  valor_oferecido DECIMAL(10, 2) NOT NULL,
  status status_proposta DEFAULT 'pendente',
  mensagem_resposta TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_valor_positivo CHECK (valor_oferecido > 0),
  CONSTRAINT check_contratante_artista CHECK (id_contratante != id_artista)
);

-- Avaliacoes table
CREATE TABLE avaliacoes (
  id_avaliacao SERIAL PRIMARY KEY,
  id_avaliador INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_avaliado INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_auto_avaliacao CHECK (id_avaliador != id_avaliado),
  UNIQUE(id_avaliador, id_avaliado)
);

-- Indexes for performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_genero ON usuarios(genero_musical);
CREATE INDEX idx_usuarios_cidade ON usuarios(cidade);
CREATE INDEX idx_usuarios_estado ON usuarios(estado);

CREATE INDEX idx_propostas_contratante ON propostas(id_contratante);
CREATE INDEX idx_propostas_artista ON propostas(id_artista);
CREATE INDEX idx_propostas_status ON propostas(status);
CREATE INDEX idx_propostas_data_evento ON propostas(data_evento);

CREATE INDEX idx_avaliacoes_avaliado ON avaliacoes(id_avaliado);
CREATE INDEX idx_avaliacoes_avaliador ON avaliacoes(id_avaliador);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_user ON password_reset_tokens(id_usuario);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_propostas_updated_at
  BEFORE UPDATE ON propostas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO usuarios (usuario, email, senha, tipo_usuario, telefone, cidade, estado, descricao, genero_musical, preco_minimo, preco_maximo, spotify_url, instagram_url) VALUES
('DJ Zé', 'dj.ze@example.com', '$2a$10$XQNpZz.qJlZ0QJnJZ0QJnO.qJlZ0QJnJZ0QJnO.qJlZ0QJnJZ0QJn', 'artista', '11987654321', 'São Paulo', 'SP', 'DJ especializado em festas e eventos corporativos', 'Eletrônica', 1500.00, 5000.00, 'https://spotify.com/djze', '@djze'),
('Ana Silva', 'ana.silva@example.com', '$2a$10$XQNpZz.qJlZ0QJnJZ0QJnO.qJlZ0QJnJZ0QJnO.qJlZ0QJnJZ0QJn', 'contratante', '11912345678', 'São Paulo', 'SP', 'Organizadora de eventos', NULL, NULL, NULL, NULL, NULL),
('Banda Rock Brasil', 'contato@rockbrasil.com', '$2a$10$XQNpZz.qJlZ0QJnJZ0QJnO.qJlZ0QJnJZ0QJnO.qJlZ0QJnJZ0QJn', 'artista', '11999887766', 'Rio de Janeiro', 'RJ', 'Banda de rock com 10 anos de estrada', 'Rock', 3000.00, 10000.00, 'https://spotify.com/rockbrasil', '@rockbrasil'),
('Maria Santos', 'maria.santos@example.com', '$2a$10$XQNpZz.qJlZ0QJnJZ0QJnO.qJlZ0QJnJZ0QJnO.qJlZ0QJnJZ0QJn', 'artista', '11988776655', 'Belo Horizonte', 'MG', 'Cantora de MPB e samba', 'MPB', 2000.00, 6000.00, 'https://spotify.com/mariasantos', '@mariasantosmusic');

INSERT INTO propostas (id_contratante, id_artista, titulo, descricao, data_evento, local_evento, valor_oferecido, status) VALUES
(2, 1, 'Festa de Aniversário', 'Preciso de um DJ para festa de 30 anos, aproximadamente 150 pessoas', '2024-06-15', 'Salão de Festas - Av. Paulista, 1000', 2500.00, 'pendente'),
(2, 3, 'Show Corporativo', 'Evento de fim de ano da empresa, cerca de 500 pessoas', '2024-12-20', 'Centro de Convenções - São Paulo', 8000.00, 'aceita');

INSERT INTO avaliacoes (id_avaliador, id_avaliado, nota, comentario) VALUES
(2, 1, 5, 'DJ excelente! Festa foi um sucesso!'),
(2, 3, 4, 'Banda muito profissional, recomendo!');


