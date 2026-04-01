# Music Connect — Documentação para Desenvolvedores

> Marketplace para conexão entre artistas musicais e contratantes de eventos.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Setup Rápido](#3-setup-rápido)
4. [Variáveis de Ambiente](#4-variáveis-de-ambiente)
5. [Backend](#5-backend)
6. [Frontend Web](#6-frontend-web)
7. [Mobile](#7-mobile)
8. [Banco de Dados](#8-banco-de-dados)
9. [Git Workflow](#9-git-workflow)
10. [Roadmap & Pendências](#10-roadmap--pendências)

---

## 1. Visão Geral

O **Music Connect** é uma plataforma que conecta artistas musicais a contratantes de eventos. O sistema permite cadastro com dois perfis (artista/contratante), busca de artistas com filtros, envio de propostas, avaliações, feed social com posts e stories, e recomendações personalizadas.

### Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Backend** | Fastify + Prisma ORM + PostgreSQL | Fastify 5 / Prisma 7 / PG 15 |
| **Frontend** | Next.js + React + Tailwind CSS | Next 16 / React 19 / Tailwind 4 |
| **Mobile** | Expo + React Native | Expo 54 / RN 0.81 |
| **Auth** | Better Auth (sessões + cookies) | 1.5.5 |
| **Banco** | PostgreSQL via Docker | 15-alpine |
| **Linguagem** | TypeScript em todos os repos | 5.x |

### Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        Clientes                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Frontend Web │  │  Mobile App  │  │  pgAdmin (dev)   │  │
│  │  :3000        │  │  Expo :8081  │  │  :5050           │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────────┘  │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (:3001)                        │
│  Fastify 5 + Better Auth + Prisma 7 + Zod                  │
│                                                             │
│  /api/auth/*        → Better Auth (login, registro, sessão) │
│  /api/usuarios/*    → Perfis de usuário                     │
│  /api/artistas/*    → Diretório de artistas                 │
│  /api/propostas/*   → Sistema de propostas                  │
│  /api/avaliacoes/*  → Avaliações e ratings                  │
│  /api/posts/*       → Feed social (posts, curtidas, etc.)   │
│  /api/stories/*     → Stories (24h)                         │
│  /api/recomendacoes → Recomendações de artistas             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL (:5433)                          │
│  Database: music_connect_db                                 │
│  User: music_user / Password: postgres                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Pré-requisitos

| Ferramenta | Versão Mínima | Uso |
|-----------|---------------|-----|
| **Node.js** | 20+ | Runtime para todos os projetos |
| **npm** | 10+ | Gerenciador de pacotes |
| **Docker Desktop** | 4.x | PostgreSQL + pgAdmin |
| **Git** | 2.x | Controle de versão |
| **Expo CLI** | — | `npx expo` (não precisa instalar globalmente) |
| **Android Studio** ou **Xcode** | — | Emuladores mobile (opcional) |

---

## 3. Setup Rápido

### 3.1 Clonar os repositórios

```bash
mkdir music-connect && cd music-connect

git clone https://github.com/seu-usuario/Music-Connect-Backend.git
git clone https://github.com/seu-usuario/Music-Connect-Frontend.git
git clone https://github.com/seu-usuario/Music-Connect-Mobile.git
```

> **Branch ativa:** `stg` (staging). Faça checkout se necessário:
> ```bash
> cd Music-Connect-Backend && git checkout stg && cd ..
> cd Music-Connect-Frontend && git checkout stg && cd ..
> cd Music-Connect-Mobile && git checkout stg && cd ..
> ```

### 3.2 Subir o banco de dados

```bash
cd Music-Connect-Backend
docker-compose up -d
```

Isso inicia:
- **PostgreSQL** na porta `5433`
- **pgAdmin** na porta `5050` (email: `admin@musicconnect.com` / senha: `admin`)

Verifique se está rodando:
```bash
docker ps
```

### 3.3 Configurar variáveis de ambiente

```bash
# Backend
cp .env.example .env
# Edite o .env se necessário (os padrões funcionam para dev)

# Frontend
cd ../Music-Connect-Frontend
cp .env.example .env.local

# Mobile
cd ../Music-Connect-Mobile
cp .env.example .env
```

### 3.4 Instalar dependências e rodar migrations

```bash
# Backend
cd Music-Connect-Backend
npm install
npm run db:generate
npm run db:migrate

# Frontend
cd ../Music-Connect-Frontend
npm install

# Mobile
cd ../Music-Connect-Mobile
npm install
```

### 3.5 Iniciar os serviços

```bash
# Terminal 1 — Backend
cd Music-Connect-Backend
npm run dev
# → http://localhost:3001

# Terminal 2 — Frontend
cd Music-Connect-Frontend
npm run dev
# → http://localhost:3000

# Terminal 3 — Mobile
cd Music-Connect-Mobile
npx expo start
# → Expo DevTools + QR code
```

### 3.6 Primeiro acesso

Não existem usuários pré-cadastrados. Crie uma conta:

1. Acesse `http://localhost:3000`
2. Clique em **"Começar"**
3. Escolha **Artista** ou **Contratante**
4. Preencha o formulário de registro

Ou via API:
```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@teste.com",
    "password": "123456",
    "name": "Teste",
    "tipo_usuario": "artista"
  }'
```

---

## 4. Variáveis de Ambiente

### Backend (`.env`)

| Variável | Descrição | Valor Padrão |
|----------|-----------|-------------|
| `PORT` | Porta do servidor | `3001` |
| `NODE_ENV` | Ambiente | `development` |
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://music_user:postgres@localhost:5433/music_connect_db` |
| `BETTER_AUTH_SECRET` | Segredo para sessões (trocar em produção!) | `seu_segredo_super_secreto...` |
| `BETTER_AUTH_URL` | URL base do backend | `http://localhost:3001` |
| `CORS_ORIGIN` | Origens permitidas (separadas por vírgula) | `http://localhost:3000,http://localhost:8081` |

### Frontend (`.env.local`)

| Variável | Descrição | Valor Padrão |
|----------|-----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://localhost:3001` |

### Mobile (`.env`)

| Variável | Descrição | Valor Padrão |
|----------|-----------|-------------|
| `EXPO_PUBLIC_API_URL` | URL da API backend | `http://localhost:3001` |
| `EXPO_PUBLIC_DEBUG` | Debug mode | `true` |

> **Nota Mobile:** No emulador Android, `localhost` é mapeado automaticamente para `10.0.2.2` pelo código em `services/api.ts`.

---

## 5. Backend

### 5.1 Estrutura de Pastas

```
Music-Connect-Backend/
├── src/
│   ├── index.ts              # Entry point — Fastify, plugins, rotas
│   ├── lib/
│   │   ├── auth.ts           # Configuração Better Auth
│   │   ├── prisma.ts         # Instância singleton do Prisma Client
│   │   └── schemas.ts        # Schemas Zod para validação
│   ├── middleware/
│   │   └── auth.ts           # Middleware de autenticação
│   └── routes/
│       ├── usuarios.ts       # CRUD de usuários
│       ├── artistas.ts       # Listagem/busca de artistas
│       ├── propostas.ts      # Sistema de propostas
│       ├── avaliacoes.ts     # Avaliações/ratings
│       ├── posts.ts          # Feed social (posts, curtidas, comentários)
│       ├── stories.ts        # Stories 24h
│       └── recomendacoes.ts  # Recomendações de artistas
├── prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   └── migrations/           # Histórico de migrations
├── docker-compose.yml        # PostgreSQL + pgAdmin
├── prisma.config.ts          # Config do Prisma (datasource URL)
├── .env.example
├── package.json
└── tsconfig.json
```

### 5.2 Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento com hot-reload (tsx) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda build de produção |
| `npm run db:generate` | Gera Prisma Client |
| `npm run db:migrate` | Roda migrations (dev) |
| `npm run db:push` | Push do schema sem criar migration |
| `npm run db:studio` | Abre Prisma Studio em `localhost:5555` |

### 5.3 Modelos do Banco (Prisma)

#### Enums

| Enum | Valores |
|------|---------|
| `TipoUsuario` | `artista`, `contratante` |
| `StatusProposta` | `pendente`, `aceita`, `recusada`, `cancelada` |
| `TipoPost` | `post`, `disponibilidade`, `buscando` |
| `VisibilidadePost` | `publico`, `seguidores`, `privado` |
| `TipoMidia` | `imagem`, `video` |

#### Modelos

| Modelo | Campos Principais | Relações |
|--------|-------------------|----------|
| **User** | id, name, email, tipo_usuario, cidade, estado, genero_musical, preco_min/max, portfolio[], spotify/instagram/youtube_url, cor_tema, cor_banner | sessions, accounts, propostas, avaliacoes, posts, curtidas, comentarios, stories |
| **Session** | id, token (unique), expiresAt, ipAddress, userAgent | → User |
| **Account** | id, providerId, accountId, password (hashed), accessToken | → User |
| **Verification** | id, identifier, value, expiresAt | — |
| **Proposta** | id_proposta, titulo, descricao, data_evento, hora_evento, local_evento, valor_oferecido, status, duracao_horas, publico_esperado, equipamento_incluso | → User (contratante), → User (artista) |
| **Avaliacao** | id_avaliacao, nota (1-5), comentario | → User (avaliador), → User (avaliado). Unique: (avaliador, avaliado) |
| **Post** | id, conteudo, tipo, visibilidade, imagens[], video_url, tags[], curtidas_count, comentarios_count, cidade, estado | → User (autor), curtidas[], comentarios[] |
| **Curtida** | id, created_at | → User, → Post. Unique: (usuario, post) |
| **Comentario** | id, conteudo, id_comentario_pai | → User, → Post, → self (respostas) |
| **Story** | id, midia_url, tipo_midia, duracao (1-30s), views_count, expira_em | → User (autor), visualizacoes[] |
| **StoryView** | id, created_at | → User, → Story. Unique: (usuario, story) |

### 5.4 API Endpoints

#### Autenticação (Better Auth — `/api/auth/*`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/sign-up/email` | Não | Cadastro com email/senha |
| POST | `/api/auth/sign-in/email` | Não | Login |
| POST | `/api/auth/sign-out` | Sim | Logout |
| GET | `/api/auth/session` | Opcional | Retorna sessão atual |
| POST | `/api/auth/forget-password` | Não | Envia email de reset |
| POST | `/api/auth/reset-password` | Não | Reseta senha com token |

**Body de cadastro:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "tipo_usuario": "artista | contratante",
  "telefone": "string?",
  "descricao": "string?",
  "cidade": "string?",
  "estado": "string?",
  "genero_musical": "string?"
}
```

#### Usuários — `/api/usuarios`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/me` | Sim | Dados do usuário autenticado |
| GET | `/:id` | Não | Perfil público de um usuário |
| PUT | `/:id` | Sim (dono) | Atualizar perfil |
| DELETE | `/:id` | Sim (dono) | Deletar conta |

#### Artistas — `/api/artistas`

| Método | Rota | Auth | Query Params | Descrição |
|--------|------|------|-------------|-----------|
| GET | `/` | Não | `page, limit, genero, cidade, estado, local` | Buscar artistas com filtros |
| GET | `/:id` | Não | — | Perfil do artista + avaliações |
| PUT | `/:id` | Sim (dono) | — | Atualizar perfil de artista |

#### Propostas — `/api/propostas`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/recebidas` | Sim | Propostas recebidas (artista) |
| GET | `/enviadas` | Sim | Propostas enviadas (contratante) |
| GET | `/:id` | Sim | Detalhes da proposta |
| POST | `/` | Sim | Criar nova proposta |
| PUT | `/:id/status` | Sim (artista) | Aceitar/recusar/cancelar proposta |

**Body de criação:**
```json
{
  "id_artista": "string",
  "titulo": "string (min 3)",
  "descricao": "string (min 10)",
  "data_evento": "YYYY-MM-DD",
  "hora_evento": "HH:MM?",
  "local_evento": "string (min 3)",
  "endereco_completo": "string?",
  "tipo_evento": "string?",
  "duracao_horas": "number?",
  "publico_esperado": "number?",
  "equipamento_incluso": "boolean?",
  "nome_responsavel": "string?",
  "telefone_contato": "string?",
  "observacoes": "string?",
  "valor_oferecido": "number (positivo)"
}
```

**Body de atualização de status:**
```json
{
  "status": "aceita | recusada | cancelada",
  "mensagem_resposta": "string?"
}
```

#### Avaliações — `/api/avaliacoes`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/usuario/:id` | Não | Avaliações de um usuário |
| GET | `/usuario/:id/media` | Não | Média + total de avaliações |
| POST | `/` | Sim | Criar avaliação (requer proposta aceita) |

**Body:** `{ "id_avaliado": "string", "nota": 1-5, "comentario": "string?" }`

#### Posts (Feed Social) — `/api/posts`

| Método | Rota | Auth | Query Params | Descrição |
|--------|------|------|-------------|-----------|
| GET | `/` | Não | `cursor, limit, tipo, genero, cidade, estado, tag` | Feed público (cursor pagination) |
| GET | `/feed/recomendados` | Sim | `cursor, limit` | Feed personalizado por localização |
| GET | `/usuario/:id` | Não | `cursor, limit` | Posts de um usuário |
| GET | `/:id` | Não | — | Post específico |
| POST | `/` | Sim | — | Criar post |
| PUT | `/:id` | Sim (autor) | — | Editar post |
| DELETE | `/:id` | Sim (autor) | — | Deletar post |
| POST | `/:id/curtir` | Sim | — | Curtir post |
| DELETE | `/:id/curtir` | Sim | — | Descurtir post |
| GET | `/:id/comentarios` | Não | `cursor, limit` | Comentários do post |
| GET | `/:id/comentarios/:cid/respostas` | Não | `cursor, limit` | Respostas a um comentário |
| POST | `/:id/comentarios` | Sim | — | Adicionar comentário |
| DELETE | `/:id/comentarios/:cid` | Sim (autor) | — | Deletar comentário |

**Body de criação de post:**
```json
{
  "conteudo": "string (1-2000 chars)",
  "tipo": "post | disponibilidade | buscando",
  "visibilidade": "publico | seguidores | privado",
  "imagens": ["url1", "url2"],
  "video_url": "string?",
  "tags": ["tag1", "tag2"],
  "cidade": "string?",
  "estado": "string? (2 chars)"
}
```

**Algoritmo de recomendação:** Mesma cidade (+3) → Mesmo estado (+2) → Mesmo gênero (+2) → Média de avaliações → Fator aleatório (0-2)

#### Stories — `/api/stories`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/` | Sim | Stories ativos agrupados por usuário (não vistos primeiro) |
| GET | `/usuario/:id` | Não | Stories de um usuário |
| POST | `/` | Sim | Criar story (expira em 24h) |
| DELETE | `/:id` | Sim (autor) | Deletar story |
| POST | `/:id/visualizar` | Sim | Marcar como visto |
| GET | `/:id/visualizacoes` | Sim (autor) | Lista de visualizações |

**Body:** `{ "midia_url": "string (URL)", "tipo_midia": "imagem | video", "duracao": 1-30 }`

#### Recomendações — `/api/recomendacoes`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/artistas` | Não | Artistas recomendados com scoring |

### 5.5 Autenticação

O sistema usa **Better Auth** com sessões baseadas em cookies.

**Fluxo:**
1. Cliente chama `/api/auth/sign-in/email` com email + senha
2. Backend retorna cookie `better-auth.session_token`
3. Todas as requests subsequentes incluem o cookie automaticamente
4. Middleware `authenticate` valida a sessão e injeta `req.user = { id, email, tipo_usuario }`

**Middleware de autenticação** (`src/middleware/auth.ts`):
```typescript
// Uso nas rotas:
fastify.get('/rota-protegida', { preHandler: authenticate }, handler)
```

**Configurações:**
- Sessão expira em **30 dias**
- Cookie é renovado **diariamente**
- Cache local de **5 minutos**

### 5.6 Validação com Zod

Todas as entradas são validadas em `src/lib/schemas.ts`:

| Schema | Uso |
|--------|-----|
| `updateUsuarioSchema` | PUT /usuarios/:id |
| `createPropostaSchema` | POST /propostas |
| `updatePropostaStatusSchema` | PUT /propostas/:id/status |
| `createAvaliacaoSchema` | POST /avaliacoes |
| `createPostSchema` | POST /posts |
| `updatePostSchema` | PUT /posts/:id |
| `createComentarioSchema` | POST /posts/:id/comentarios |
| `createStorySchema` | POST /stories |
| `paginationSchema` | Paginação offset (page, limit) |
| `feedQuerySchema` | Filtros do feed (cursor, tipo, genero...) |
| `cursorPaginationSchema` | Paginação cursor |

### 5.7 Docker

**`docker-compose.yml`** sobe dois serviços:

| Serviço | Porta | Credenciais |
|---------|-------|-------------|
| **PostgreSQL 15** | `5433:5432` | user: `music_user` / pass: `postgres` / db: `music_connect_db` |
| **pgAdmin 4** | `5050:80` | email: `admin@musicconnect.com` / pass: `admin` |

```bash
docker-compose up -d      # Subir
docker-compose down        # Derrubar
docker-compose down -v     # Derrubar + apagar dados
```

---

## 6. Frontend Web

### 6.1 Estrutura de Pastas

```
Music-Connect-Frontend/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (Providers)
│   ├── providers.tsx               # Auth + Zustand provider
│   ├── globals.css                 # Estilos globais + animações
│   ├── dashboard/page.tsx          # Dashboard principal
│   ├── feed/page.tsx               # Feed social
│   ├── proposals/page.tsx          # Gestão de propostas
│   ├── explore/page.tsx            # Explorar artistas
│   ├── profile/page.tsx            # Editar perfil
│   ├── u/[id]/page.tsx             # Perfil público
│   ├── settings/page.tsx           # Configurações
│   ├── login/page.tsx              # Login
│   ├── register-artist/page.tsx    # Registro artista
│   ├── register-contractor/page.tsx # Registro contratante
│   ├── profile-selector/page.tsx   # Seletor de perfil
│   ├── forgot-password/page.tsx    # Esqueci senha
│   └── reset-password/page.tsx     # Resetar senha
├── components/
│   ├── Sidebar.tsx                 # Navegação lateral
│   ├── Header.tsx                  # Cabeçalho sticky
│   ├── BackButton.tsx              # Botão voltar
│   ├── ProposalCard.tsx            # Card de proposta
│   ├── PostCard.tsx                # Card de post do feed
│   ├── CreatePostModal.tsx         # Modal criar post
│   ├── CommentSection.tsx          # Seção de comentários
│   ├── StoryBar.tsx                # Carrossel de stories
│   ├── StoryViewer.tsx             # Visualizador fullscreen
│   └── DashboardBanner.tsx         # Banner do dashboard
├── lib/
│   ├── api.ts                      # Cliente API (44 métodos)
│   ├── auth-client.ts              # Better Auth client
│   └── store.ts                    # Zustand store (auth)
├── middleware.ts                    # Proteção de rotas
├── UI_SYSTEM.md                    # Documentação do design system
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

### 6.2 Páginas e Rotas

| Rota | Protegida | Descrição |
|------|-----------|-----------|
| `/` | Não | Landing page com features e CTAs |
| `/login` | Não | Login com email/senha |
| `/register-artist` | Não | Registro de artista |
| `/register-contractor` | Não | Registro de contratante |
| `/profile-selector` | Não | Escolher tipo de perfil |
| `/forgot-password` | Não | Solicitar reset de senha |
| `/reset-password` | Não | Resetar senha com token |
| `/explore` | Não | Buscar artistas (filtros: gênero, cidade, estado) |
| `/u/[id]` | Não | Perfil público de qualquer usuário |
| `/dashboard` | **Sim** | Overview com stats e ações rápidas |
| `/feed` | **Sim** | Feed social (posts, stories, recomendações) |
| `/proposals` | **Sim** | Gestão de propostas (recebidas/enviadas) |
| `/profile` | **Sim** | Editar perfil próprio |
| `/settings` | **Sim** | Configurações (conta, segurança, notificações) |

### 6.3 Componentes

| Componente | Descrição |
|------------|-----------|
| `Sidebar` | Navegação lateral com ícones, indicador de role, destaque de página ativa |
| `Header` | Cabeçalho sticky com busca, notificações e avatar do usuário |
| `BackButton` | Botão de voltar reutilizável |
| `ProposalCard` | Card de proposta com badge de status, data, valor, botões aceitar/recusar |
| `PostCard` | Card de post do feed com autor, tags, imagens, vídeo, curtida, comentário |
| `CreatePostModal` | Modal para criar post (tipo, conteúdo, tags, imagens, vídeo) |
| `CommentSection` | Comentários aninhados com respostas, paginação cursor |
| `StoryBar` | Carrossel horizontal de stories com anel gradiente (não visto) |
| `StoryViewer` | Viewer fullscreen com barras de progresso, auto-avanço, teclado |
| `DashboardBanner` | Banner hero com CTA baseado no tipo de usuário |

### 6.4 API Client (`lib/api.ts`)

44 métodos organizados por recurso. Todos usam `credentials: "include"` para enviar cookies.

**Usuários:** `getUsers`, `getUserById`, `updateUser`, `getArtistas`, `getArtistaById`

**Propostas:** `getPropostasRecebidas`, `getPropostasEnviadas`, `getPropostaById`, `createProposta`, `updatePropostaStatus`

**Avaliações:** `getAvaliacoesByUserId`, `getMediaAvaliacoes`, `createAvaliacao`

**Feed:** `getFeed`, `getFeedRecomendado`, `getPostById`, `getPostsByUser`, `createPost`, `deletePost`, `curtirPost`, `descurtirPost`

**Comentários:** `getComentarios`, `createComentario`, `deleteComentario`

**Stories:** `getStories`, `createStory`, `deleteStory`, `visualizarStory`

**Recomendações:** `getRecomendacoes`

### 6.5 Auth & State

**Better Auth Client** (`lib/auth-client.ts`):
```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  fetchOptions: { credentials: "include" }
});
```

**Zustand Store** (`lib/store.ts`):
```typescript
interface AuthStore {
  user: AuthUser | null;
  sessionLoaded: boolean;
  setUser: (user) => void;
  setSessionLoaded: (loaded) => void;
}
```

**Provider** (`app/providers.tsx`): Wrapa a app, carrega sessão via `authClient.useSession()`, popula o store.

### 6.6 Middleware de Rotas

O arquivo `middleware.ts` protege rotas verificando o cookie `better-auth.session_token`:

```
Rotas protegidas: /dashboard, /proposals, /profile, /settings, /feed
```

Se o cookie não existir → redireciona para `/login?redirect=/rota-original`.

### 6.7 Design System

Tema **escuro** com gradientes vibrantes. Referência completa em `UI_SYSTEM.md`.

**Cores principais:**
| Token | Valor | Uso |
|-------|-------|-----|
| Background | `#0a0a0a / black` | Fundo da página |
| Card | `zinc-900/40` | Cards e containers |
| Border | `zinc-800/60` | Bordas |
| Brand gradient | `amber-300 → rose-400 → fuchsia-500` | CTAs, destaques |
| Status pendente | `amber-500` | Badge de pendente |
| Status aceita | `emerald-500` | Badge de aceita |
| Status recusada | `red-500` | Badge de recusada |

**Padrões de componentes:**
- Inputs: `rounded-xl border-zinc-800/60 bg-zinc-900/50 px-4 py-3`
- Botões primários: `bg-white text-black rounded-xl font-bold`
- Cards: `rounded-2xl border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm`
- Transições: `duration-200` (hover), `duration-300` (cards)

---

## 7. Mobile

### 7.1 Estrutura de Pastas

```
Music-Connect-Mobile/
├── app/
│   ├── _layout.tsx               # Root layout (Stack)
│   ├── index.tsx                 # Tela de boas-vindas
│   ├── redirect.tsx              # Redirect por auth/role
│   ├── login.tsx                 # Login
│   ├── register-artist.tsx       # Registro artista
│   ├── register-contractor.tsx   # Registro contratante
│   ├── profile-selector.tsx      # Seletor de perfil
│   ├── forgot-password.tsx       # Esqueci senha
│   ├── create-post.tsx           # Criar post
│   ├── create-proposal.tsx       # Criar proposta
│   ├── edit-profile.tsx          # Editar perfil
│   ├── artist/[id].tsx           # Perfil público do artista
│   ├── proposal/[id].tsx         # Detalhe da proposta
│   ├── reviews.tsx               # Avaliações
│   ├── settings.tsx              # Configurações
│   ├── advanced-search.tsx       # Busca avançada
│   ├── (tabs)/                   # Tabs genéricos
│   │   ├── _layout.tsx           # Tab layout dinâmico por role
│   │   ├── index.tsx             # Home/feed
│   │   ├── social-feed.tsx       # Feed social
│   │   ├── explore.tsx           # Explorar artistas
│   │   ├── minhas-propostas.tsx  # Minhas propostas
│   │   ├── portfolio.tsx         # Portfólio
│   │   └── profile.tsx           # Perfil
│   ├── (artist-tabs)/            # Tabs específicos do artista
│   └── (contractor-tabs)/        # Tabs específicos do contratante
├── components/
│   ├── AppHeader.tsx             # Header com avatar, busca, notificações
│   ├── PostCard.tsx              # Card de post (curtir, comentar, compartilhar)
│   ├── FeedProposalCard.tsx      # Card de proposta no feed
│   ├── StoryCarousel.tsx         # Carrossel de stories
│   └── shared/
│       ├── Button.tsx            # Botão (primary/secondary/danger/outline)
│       ├── Card.tsx              # Card wrapper
│       ├── Header.tsx            # Header de tela
│       └── Badge.tsx             # Badge
├── services/
│   └── api.ts                    # Cliente API (40+ métodos)
├── hooks/
│   ├── useConfirm.ts             # Diálogo de confirmação
│   └── useFormState.ts           # Gerenciamento de form state
├── constants/
│   └── theme.ts                  # Cores e fontes
├── app.json                      # Config Expo
├── eas.json                      # Config EAS Build
└── .env.example
```

### 7.2 Navegação

O app usa **Expo Router** (file-based routing) com **tabs dinâmicos por role**.

**Fluxo de navegação:**
```
Welcome → Login/Register → Redirect (verifica role)
                                ↓
              ┌─────────────────┼─────────────────┐
              ▼                                   ▼
    (artist-tabs)                       (contractor-tabs)
    ├── Feed                            ├── Home
    ├── Propostas                       ├── Artistas
    ├── Portfólio                       ├── Propostas
    └── Perfil                          └── Perfil
```

**Tab bar:**
- Background: `#0B0B0B`
- Cor ativa: `#EC4899` (pink)
- Cor inativa: `#9A9A9A`
- Altura: 72px

### 7.3 Autenticação no Mobile

Diferente do web (que usa cookies nativos), o mobile armazena o token em **AsyncStorage**:

```
Chave: @music-connect:session-cookie
Valor: better-auth.session_token=<token>
```

**Fluxo:**
1. Login → API retorna header `Set-Cookie`
2. App extrai o cookie e salva no AsyncStorage
3. Toda request inclui o cookie no header manualmente
4. Logout → limpa AsyncStorage

### 7.4 Cores do Mobile

| Token | Valor |
|-------|-------|
| Primary | `#EC4899` |
| Secondary | `#FCD34D` |
| Background | `#000000` |
| Card | `#18181B` |
| Border | `#3F3F46` |
| Error | `#EF4444` |
| Success | `#34D399` |

### 7.5 Build & Deploy

**EAS Build** (`eas.json`):

| Profile | Distribuição | Uso |
|---------|-------------|-----|
| `development` | Internal | Dev com Expo Dev Client |
| `preview` | Internal | Staging (API de staging) |
| `production` | Store | Build para lojas |

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Build para teste
eas build --platform android --profile preview

# Build de produção
eas build --platform android --profile production
```

---

## 8. Banco de Dados

### 8.1 Diagrama ER (Simplificado)

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│  User   │────<│ Proposta  │>────│  User    │
│(artista)│     │           │     │(contrat.)│
└────┬────┘     └──────────┘     └────┬─────┘
     │                                 │
     │          ┌──────────┐          │
     └────────<│ Avaliacao │>─────────┘
               └──────────┘

     ┌──────┐     ┌─────────┐     ┌───────────┐
     │ User │────<│  Post   │────<│ Comentario│
     └──┬───┘     └────┬────┘     └───────────┘
        │              │
        │         ┌────┴────┐
        │────────<│ Curtida │
        │         └─────────┘
        │
        │         ┌─────────┐     ┌───────────┐
        └────────<│  Story  │────<│ StoryView │
                  └─────────┘     └───────────┘

     ┌──────┐     ┌──────────┐     ┌──────────────┐
     │ User │────<│ Session  │     │ Verification │
     │      │────<│ Account  │     │ (email)      │
     └──────┘     └──────────┘     └──────────────┘
```

### 8.2 Comandos Prisma Úteis

```bash
# Gerar o client após alterar schema
npx prisma generate

# Criar migration após alterar schema
npx prisma migrate dev --name descricao_da_mudanca

# Aplicar migrations em produção
npx prisma migrate deploy

# Abrir Prisma Studio (GUI do banco)
npx prisma studio

# Resetar banco (CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Push sem migration (prototipação rápida)
npx prisma db push

# Ver status das migrations
npx prisma migrate status
```

### 8.3 Paginação

O sistema usa **dois tipos de paginação**:

**Offset (tradicional)** — para listagens simples:
```
GET /api/artistas?page=2&limit=20
→ { data: [...], meta: { total, page, limit, totalPages } }
```

**Cursor (performante)** — para feeds infinitos:
```
GET /api/posts?cursor=cuid_do_ultimo_post&limit=20
→ { data: [...], meta: { nextCursor, hasMore } }
```

---

## 9. Git Workflow

### Estrutura de Branches

Cada desenvolvedor tem sua própria branch de staging (`stg-{seu-nome}`). Isso evita conflitos entre devs trabalhando em paralelo.

```
main                ← Produção — código estável, deployado
  ↑
 dev                ← Integração — reúne o trabalho de todos antes de ir pra produção
  ↑
stg-lucas           ← Staging do Lucas
stg-danilo          ← Staging do Danilo
stg-gabriel         ← Staging do Gabriel
stg-eduardo         ← Staging do Eduardo
stg-{seu-nome}      ← A sua branch pessoal de staging
```

> **Regra geral:** você nunca commita direto em `dev` ou `main`. Todo trabalho vai para a sua `stg-{seu-nome}`.

---

### Passo a Passo — Fazendo uma tarefa

**1. Antes de começar, pegue o código mais recente:**
```bash
git checkout stg
git pull origin stg
```
> Isso garante que você parte da versão mais atualizada do projeto.

**2. Desenvolva e faça commits:**
```bash
git add nome-do-arquivo.ts
git commit -m "feat: adiciona componente StarRating"
```
> Nunca use `git add .` sem antes verificar o que está sendo adicionado com `git status`.

**3. Suba para a sua branch:**
```bash
git push origin stg-{seu-nome}
```
> Exemplo: `git push origin stg-lucas`, `git push origin stg-danilo`

**4. Após revisão, o líder técnico promove para `dev` e depois `main`.**

---

### Convenção de Commits

Siga o padrão **Conventional Commits** para manter o histórico organizado:

```
feat:     Nova funcionalidade
fix:      Correção de bug
refactor: Refatoração sem mudança de comportamento
docs:     Apenas documentação
style:    Formatação (espaços, vírgulas — sem lógica)
test:     Adição ou correção de testes
chore:    Tarefas de manutenção (deps, configs, build)
```

**Exemplos bons:**
```
feat: adiciona modal de avaliação com StarRating
fix: corrige loading infinito no login do mobile
refactor: extrai lógica de autenticação para hook useAuth
chore: atualiza @fastify/rate-limit para v10
```

**Evite:**
```
fix: correção         ← vago demais
update: mudanças      ← não segue o padrão
WIP                   ← não commite trabalho incompleto
```

---

## 10. Roadmap & Pendências

Consulte a planilha **`Music-Connect-Tarefas.xlsx`** para a lista completa e atualizada.

### Resumo de Status

| Status | Quantidade |
|--------|-----------|
| Concluído | 11 user stories |
| Em andamento | 2 user stories |
| Pendente | 7 user stories |

### Próximas Prioridades

1. **Chat em tempo real** (WebSocket) — Backend + Frontend + Mobile
2. **Upload de imagens** (S3/Cloudflare R2) — substituir URLs manuais
3. **Notificações** — in-app + push (Expo Push API)
4. **UI de avaliações** — componentes de estrelas e formulário
5. **CI/CD** — GitHub Actions para lint, test, build
6. **Deploy** — Backend (Railway/Render), Frontend (Vercel), Mobile (EAS)

---

> **Última atualização:** 2026-03-22
