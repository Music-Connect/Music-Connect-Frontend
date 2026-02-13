# Arquitetura e Fluxo do BFF (Backend for Frontend)

## 📋 Visão Geral

O projeto utiliza um padrão **BFF (Backend for Frontend)** com dois serviços especializados:

- **BFF Web** (porta 3003): Otimizado para Next.js (SSR/ISR)
- **BFF Mobile** (porta 3002): Otimizado para React Native/Expo

Ambos funcionam como **proxy inteligente** entre o frontend e o backend principal, adaptando respostas, cachê e formato de dados para cada plataforma.

### Arquitetura Geral

```
[Frontend Web (Next.js)]               [Mobile App (React Native)]
         ↓                                      ↓
  [BFF Web :3003]                      [BFF Mobile :3002]
         ↓                                      ↓
         └─────────────→ [Backend API :3001] ←─────────────┘
                          (PostgreSQL)
```

---

## 🔧 Configuração Inicial

### Variáveis de Ambiente (.env)

```bash
# BFF Web
PORT=3003
BACKEND_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3000

# BFF Mobile
PORT=3002
BACKEND_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:19006

# Backend
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/music_connect
JWT_SECRET=seu_secret_aqui
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=senha_app_google
```

### Inicializar BFFs

```bash
# BFF Web
cd bff-web
npm install
npm run dev

# BFF Mobile
cd bff-mobile
npm install
npm run dev
```

---

## 📡 Endpoints Principais do BFF Web

### Health Check

```
GET /health
```

**Response:**

```json
{
  "status": "BFF Web is running",
  "backend": "http://localhost:3001",
  "timestamp": "2026-02-13T10:30:00Z"
}
```

---

## 🔐 Autenticação

### 1. Login

**Endpoint:** `POST /api/web/auth/login`

**Request:**

```json
{
  "email": "usuario@example.com",
  "senha": "sua_senha"
}
```

**Response (Sucesso):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id_usuario": 1,
      "usuario": "joao_silva",
      "email": "joao@example.com",
      "tipo_usuario": "artista",
      "email_verificado": true
    }
  }
}
```

**Response (Erro):**

```json
{
  "success": false,
  "error": "Credenciais inválidas"
}
```

**Fluxo no BFF:**

```typescript
// bff-web/src/routes/auth.ts
app.post("/api/web/auth/login", async (req, res) => {
  const { email, senha } = req.body;

  // Valida campos obrigatórios
  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  // Faz chamada para backend
  const response = await axios.post(`${backendUrl}/api/usuarios/auth/login`, {
    email,
    senha,
  });

  // Retorna resposta otimizada para web
  res.json({
    success: true,
    data: {
      token: response.data.data?.token,
      user: response.data.data?.user,
    },
  });
});
```

---

### 2. Registrar

**Endpoint:** `POST /api/web/auth/register`

**Request:**

```json
{
  "usuario": "novo_user",
  "email": "novo@example.com",
  "senha": "minhasenha123",
  "tipo_usuario": "artista",
  "genero_musical": "Rock",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      /* dados completos do usuário */
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Verificar Email

**Endpoint:** `POST /api/web/auth/verify-email`

**Request:**

```json
{
  "token": "abc123def456..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email verificado com sucesso"
}
```

**Fluxo:**

- User registra → email enviado com token
- User clica no link ou envia token manualmente
- BFF valida token com backend
- Email marcado como verificado no banco

---

### 4. Reenviar Email de Verificação

**Endpoint:** `POST /api/web/auth/resend-verification`

**Request:**

```json
{
  "email": "usuario@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email de verificação reenviado",
  "verificationToken": "xyz789..." // Apenas em desenvolvimento
}
```

---

### 5. Recuperar Senha

**Endpoint:** `POST /api/web/auth/forgot-password`

**Request:**

```json
{
  "email": "usuario@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Se o email existir, você receberá instruções para redefinir sua senha",
  "resetToken": "token123..." // Apenas em desenvolvimento
}
```

---

### 6. Redefinir Senha

**Endpoint:** `POST /api/web/auth/reset-password`

**Request:**

```json
{
  "token": "token123...",
  "novaSenha": "minhasenha456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

---

### 7. Verificar Sessão (Next.js Middleware)

**Endpoint:** `GET /api/web/auth/session`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Autenticado):**

```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "id_usuario": 1,
    "usuario": "joao_silva",
    "email": "joao@example.com"
  }
}
```

**Response (Não autenticado):**

```json
{
  "success": false,
  "error": "Não autenticado"
}
```

**Fluxo no BFF:**

```typescript
app.get("/api/web/auth/session", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Não autenticado",
    });
  }

  // Valida JWT com backend
  const response = await axios.get(`${backendUrl}/api/usuarios/me`, {
    headers: { Authorization: authHeader },
  });

  res.json({
    success: true,
    authenticated: true,
    user: response.data.data,
  });
});
```

---

## 👥 Usuários

### 1. Listar Usuários

**Endpoint:** `GET /api/web/usuarios`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id_usuario": 1,
      "usuario": "joao_silva",
      "tipo_usuario": "artista",
      "genero_musical": "Rock",
      "cidade": "São Paulo",
      "email_verificado": true
    },
    {
      /* mais usuários */
    }
  ]
}
```

---

### 2. Obter Perfil Completo

**Endpoint:** `GET /api/web/usuarios/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "usuario": "joao_silva",
    "email": "joao@example.com",
    "tipo_usuario": "artista",
    "genero_musical": "Rock",
    "descricao": "Músico experiente",
    "cidade": "São Paulo",
    "estado": "SP",
    "telefone": "11999999999",
    "avatar_url": "https://...",
    "link_spotify": "https://spotify.com/...",
    "email_verificado": true,
    "avaliacoes": [
      {
        "id_avaliacao": 1,
        "nota": 5,
        "comentario": "Excelente trabalho!",
        "id_avaliador": 2
      }
    ],
    "media_avaliacoes": 4.8,
    "total_avaliacoes": 10
  }
}
```

**Fluxo no BFF (Parallelização):**

```typescript
app.get("/api/web/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  // Busca dados em paralelo (mais rápido)
  const [userResponse, avaliacoesResponse, mediaResponse] = await Promise.all([
    axios.get(`${backendUrl}/api/usuarios/${id}`),
    axios.get(`${backendUrl}/api/avaliacoes/usuario/${id}`),
    axios.get(`${backendUrl}/api/avaliacoes/usuario/${id}/media`),
  ]);

  // Agrega dados para web
  res.json({
    success: true,
    data: {
      ...userResponse.data.data,
      avaliacoes: avaliacoesResponse.data.data,
      media_avaliacoes: mediaResponse.data.data?.media,
      total_avaliacoes: mediaResponse.data.data?.total,
    },
  });
});
```

---

### 3. Atualizar Perfil

**Endpoint:** `PUT /api/web/usuarios/:id`

**Request:**

```json
{
  "descricao": "Nova descrição",
  "link_spotify": "https://spotify.com/...",
  "avatar_url": "https://..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    /* usuário atualizado */
  }
}
```

---

### 4. Deletar Usuário

**Endpoint:** `DELETE /api/web/usuarios/:id`

**Response:**

```json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
```

---

## 🎵 Artistas

### 1. Listar Artistas (com Filtros)

**Endpoint:** `GET /api/web/artistas?genero=Rock&local=São Paulo`

**Response:**

```json
{
  "success": true,
  "data": {
    "artistas": [
      {
        "id_usuario": 1,
        "usuario": "joao_silva",
        "genero_musical": "Rock",
        "cidade": "São Paulo",
        "estado": "SP",
        "descricao": "Guitarrista experiente"
      },
      {
        /* mais artistas */
      }
    ],
    "filters": {
      "generos": ["Rock", "Blues", "Jazz"],
      "locais": ["São Paulo, SP", "Rio de Janeiro, RJ"]
    },
    "total": 42
  }
}
```

**Fluxo no BFF:**

```typescript
app.get("/api/web/artistas", async (req, res) => {
  const { genero, local } = req.query;

  const params = new URLSearchParams();
  if (genero) params.append("genero", genero);
  if (local) params.append("local", local);

  // Chama backend com filtros
  const response = await axios.get(
    `${backendUrl}/api/artistas?${params.toString()}`,
  );

  const artistas = response.data.data || [];

  // Extrai filtros disponíveis para UI
  const generos = [...new Set(artistas.map((a) => a.genero_musical))];
  const locais = [...new Set(artistas.map((a) => `${a.cidade}, ${a.estado}`))];

  res.json({
    success: true,
    data: {
      artistas,
      filters: { generos, locais },
      total: artistas.length,
    },
  });
});
```

---

## 💼 Propostas

### 1. Listar Propostas Recebidas (do ponto de vista de um artista)

**Endpoint:** `GET /api/web/propostas/recebidas?id_artista=1`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id_proposta": 5,
      "titulo": "Produção de Beat",
      "descricao": "Preciso de um beat para meu novo clipe",
      "genero_musical": "Hip-Hop",
      "orcamento": 500.0,
      "prazo": "2026-03-13",
      "status": "aberta",
      "id_contratante": 3,
      "contratante": {
        "usuario": "produtor_xyz",
        "email": "produtor@example.com"
      }
    },
    {
      /* mais propostas */
    }
  ]
}
```

---

### 2. Listar Propostas Enviadas (do ponto de vista de um contratante)

**Endpoint:** `GET /api/web/propostas/enviadas?id_contratante=3`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id_proposta": 5,
      "titulo": "Produção de Beat",
      "descricao": "Preciso de um beat para meu novo clipe",
      "orcamento": 500.0,
      "data_envio": "2026-02-13",
      "status": "aceita",
      "id_artista": 1,
      "artista": {
        "usuario": "joao_silva",
        "genero_musical": "Hip-Hop"
      }
    }
  ]
}
```

---

### 3. Obter Detalhes da Proposta

**Endpoint:** `GET /api/web/propostas/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "id_proposta": 5,
    "titulo": "Produção de Beat",
    "descricao": "Preciso de um beat para meu novo clipe",
    "genero_musical": "Hip-Hop",
    "orcamento": 500.0,
    "prazo": "2026-03-13",
    "status": "aceita",
    "data_envio": "2026-02-13",
    "id_artista": 1,
    "id_contratante": 3,
    "artista": {
      "usuario": "joao_silva",
      "genero_musical": "Hip-Hop",
      "media_avaliacoes": 4.8
    },
    "contratante": {
      "usuario": "produtor_xyz"
    }
  }
}
```

---

### 4. Criar Proposta

**Endpoint:** `POST /api/web/propostas`

**Request:**

```json
{
  "titulo": "Produção de Beat",
  "descricao": "Preciso de um beat para meu novo clipe",
  "genero_musical": "Hip-Hop",
  "orcamento": 500.0,
  "prazo": "2026-03-13",
  "id_artista": 1,
  "id_contratante": 3
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id_proposta": 5,
    "titulo": "Produção de Beat"
    /* dados completos */
  }
}
```

---

### 5. Atualizar Status da Proposta

**Endpoint:** `PUT /api/web/propostas/:id`

**Request:**

```json
{
  "status": "aceita"
}
```

**Status Válidos:** `aberta`, `aceita`, `rejeitada`, `cancelada`

**Response:**

```json
{
  "success": true,
  "message": "Proposta atualizada com sucesso"
}
```

---

## ⭐ Avaliações

### 1. Avaliar Usuário

**Endpoint:** `POST /api/web/avaliacoes`

**Request:**

```json
{
  "id_avaliado": 1,
  "id_avaliador": 3,
  "nota": 5,
  "comentario": "Excelente trabalho!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id_avaliacao": 15,
    "id_avaliado": 1,
    "id_avaliador": 3,
    "nota": 5,
    "comentario": "Excelente trabalho!",
    "data_criacao": "2026-02-13T10:30:00Z"
  }
}
```

**Validações (Backend):**

- Nota entre 1 e 5
- Avaliador e avaliado devem ter relação prévia (proposta aceita)
- Não pode avaliar a si mesmo

---

### 2. Obter Avaliações de um Usuário

**Endpoint:** `GET /api/web/avaliacoes/usuario/:id`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id_avaliacao": 15,
      "nota": 5,
      "comentario": "Excelente trabalho!",
      "data_criacao": "2026-02-13",
      "avaliador": {
        "usuario": "contratante_xyz",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

---

### 3. Obter Média de Avaliações

**Endpoint:** `GET /api/web/avaliacoes/usuario/:id/media`

**Response:**

```json
{
  "success": true,
  "data": {
    "media": 4.8,
    "total": 10
  }
}
```

---

## 📊 Dashboard

### 1. Estatísticas Gerais

**Endpoint:** `GET /api/web/dashboard/stats?id_usuario=1`

**Response:**

```json
{
  "success": true,
  "data": {
    "propostas_recebidas": 5,
    "propostas_enviadas": 8,
    "propostas_aceitas": 3,
    "media_avaliacoes": 4.8,
    "total_avaliacoes": 10
  }
}
```

---

## 🌐 Diferenças: BFF Web vs BFF Mobile

### BFF Web (Next.js)

- ✅ Dados completos (todas as avaliações)
- ✅ Filtros complexos
- ✅ Suporta SSR/ISR
- ✅ CORS: localhost:3000
- ✅ Porta: 3003

### BFF Mobile (React Native)

- ✅ Dados limitados (primeiras 5 avaliações)
- ✅ Filtros simples
- ✅ Payload menor
- ✅ CORS: localhost:19006
- ✅ Porta: 3002

**Exemplo de diferença:**

```typescript
// BFF Web - Retorna TODAS as avaliações
GET /api/web/usuarios/1
→ "avaliacoes": [/* todos os 50 reviews */]

// BFF Mobile - Retorna LIMITADO
GET /api/mobile/usuarios/1
→ "avaliacoes": [/* primeiros 5 reviews */]
→ "total_avaliacoes": 50
```

---

## 🔄 Fluxo End-to-End: Exemplo Completo

### Cenário: Artista recebe e aceita proposta

```
1. Frontend Web faz login
   POST /api/web/auth/login
   → BFF valida com backend
   → Retorna token + user

2. Frontend armazena token em localStorage

3. Frontend lista propostas recebidas (artista)
   GET /api/web/propostas/recebidas?id_artista=1
   → BFF faz chamada com Authorization header
   → Backend retorna propostas

4. Artista clica em aceitar proposta
   PUT /api/web/propostas/5
   { "status": "aceita" }
   → BFF atualiza status via backend

5. Contratante pode agora avaliar artista
   POST /api/web/avaliacoes
   { "id_avaliado": 1, "nota": 5 }
   → Backend valida relação (proposta aceita)
   → Avaliação salva

6. Frontend busca perfil atualizado
   GET /api/web/usuarios/1
   → Média de avaliações já ajustada
```

---

## 🛡️ Segurança

### CORS

```typescript
// Permitido apenas origens configuradas
cors({
  origin: corsOrigins, // ['http://localhost:3000']
  credentials: true,
});
```

### Autenticação JWT

```typescript
// Token enviado no header Authorization
headers: {
  Authorization: `Bearer ${token}`;
}
```

### Validação

- Campos obrigatórios validados no BFF
- Negócio validado no backend (ACID)
- Senhas hasheadas (bcrypt)
- Emails verificados

---

## 📝 Exemplo: Cliente HTTP (Axios)

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3003", // BFF Web
  headers: {
    "Content-Type": "application/json",
  },
});

// Login
const login = async (email: string, senha: string) => {
  const response = await api.post("/api/web/auth/login", {
    email,
    senha,
  });

  // Armazena token
  localStorage.setItem("token", response.data.data.token);
  api.defaults.headers.Authorization = `Bearer ${response.data.data.token}`;

  return response.data.data;
};

// Verificar sessão
const checkSession = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/api/web/auth/session", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};

// Listar propostas recebidas
const getPropostasRecebidas = async (idArtista: number) => {
  const response = await api.get("/api/web/propostas/recebidas", {
    params: { id_artista: idArtista },
  });

  return response.data.data;
};

// Aceitar proposta
const aceitarProposta = async (idProposta: number) => {
  const response = await api.put(`/api/web/propostas/${idProposta}`, {
    status: "aceita",
  });

  return response.data;
};
```

---

## 🧪 Testing

```bash
# Test login
curl -X POST http://localhost:3003/api/web/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "senha": "password123"}'

# Test session
curl -X GET http://localhost:3003/api/web/auth/session \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test list artistas
curl -X GET "http://localhost:3003/api/web/artistas?genero=Rock"

# Test list propostas
curl -X GET "http://localhost:3003/api/web/propostas/recebidas?id_artista=1"
```

---

## 📚 Referências

- Backend API: [API.md](API.md)
- Segurança: [SECURITY_FIXES.md](SECURITY_FIXES.md)
- Banco de Dados: [scripts/init.sql](scripts/init.sql)

