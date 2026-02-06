# Guia Rápido - Music Connect

Comece a desenvolver em 5 minutos!

## Arquitetura

```
┌─────────────┐      ┌─────────────┐
│  Web App    │      │  Mobile App │
│ (Next.js)   │      │   (Expo)    │
└──────┬──────┘      └──────┬──────┘
       │                    │
       ▼                    ▼
  ┌────────┐           ┌────────┐
  │BFF Web │           │BFF Mob │
  └────┬───┘           └───┬────┘
       │                   │
       └───────────┬───────┘
                   ▼
              ┌─────────┐
              │ Backend │
              │(Express)│
              └────┬────┘
                   ▼
            ┌────────────┐
            │PostgreSQL  │
            └────────────┘
```

## Setup Rápido

### 1. Clonar e Instalar

```bash
git clone <repositorio>
cd music-connect

# Backend
cd backend && npm install && cd ..

# BFF Mobile
cd bff-mobile && npm install && cd ..

# BFF Web
cd bff-web && npm install && cd ..

# Frontend Web
cd frontend-web/frontend-web && npm install && cd ../..

# Frontend Mobile
cd mobile/mobile && npm install && cd ../..
```

### 2. Configurar Ambiente

**Backend** - Criar `backend/.env`:

```env
DATABASE_URL=postgresql://music_user:postgres@localhost:5433/music_connect_db
JWT_SECRET=seu-secret-seguro-aqui
NODE_ENV=development
PORT=3001

# Email (Opcional - apenas se quiser testar recuperação de senha)
# EMAIL_USER=seu_email@gmail.com
# EMAIL_PASSWORD=sua_senha_de_aplicativo
# FRONTEND_URL=http://localhost:3000
```

> 💡 **Recuperação de Senha**: O email é opcional. Sem configuração, o token aparece no console do backend para testes. Para configurar Gmail, veja [EMAIL_SETUP.md](EMAIL_SETUP.md).

**Frontend Web** - Criar `frontend-web/frontend-web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

**Mobile** - Já existe `mobile/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3002
EXPO_PUBLIC_DEBUG=true
```

### 3. Configurar PostgreSQL

```bash
# Criar banco (executar uma vez)
psql -U postgres -c "CREATE DATABASE music_connect_db;"
psql -U postgres -c "CREATE USER music_user WITH PASSWORD 'postgres';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE music_connect_db TO music_user;"

# Executar schema
psql -U music_user -d music_connect_db -f scripts/init.sql
```

### 4. Executar Tudo em Paralelo (5 Terminais)

**Terminal 1 - Backend** (porta 3001)

```bash
cd backend && npm run dev
```

Teste: `curl http://localhost:3001/health`

**Terminal 2 - BFF Mobile** (porta 3002)

```bash
cd bff-mobile && npm run dev
```

Teste: `curl http://localhost:3002/health`

**Terminal 3 - BFF Web** (porta 3003)

```bash
cd bff-web && npm run dev
```

Teste: `curl http://localhost:3003/health`

**Terminal 4 - Frontend Web** (porta 3000)

```bash
cd frontend-web/frontend-web && npm run dev
```

Acesse: http://localhost:3000

**Terminal 5 - Frontend Mobile** (porta 19000)

```bash
cd mobile/mobile && npm start
```

Escaneie o QR Code com Expo Go app ou pressione 'w' para web

## Estrutura Principal

```
music-connect/
├── backend/                     # API Principal
│   └── src/
│       ├── controllers/         # Lógica de negócio
│       ├── routes/              # Definição de rotas
│       ├── middleware/          # Autenticação
│       ├── types/               # Interfaces TypeScript
│       └── index.ts             # Express app
│
├── bff-mobile/                  # Otimizado para Mobile
│   └── src/
│       ├── routes/              # Proxy inteligente
│       └── index.ts
│
├── bff-web/                     # Otimizado para Web
│   └── src/
│       ├── routes/              # Proxy com SSR
│       └── index.ts
│
├── frontend-web/                # Web (Next.js)
│   └── frontend-web/
│       ├── app/                 # Páginas
│       ├── components/          # Componentes
│       ├── lib/api.ts           # Cliente HTTP
│       └── package.json
│
├── mobile/                      # Mobile (React Native)
│   └── mobile/
│       ├── app/                 # Telas
│       ├── services/api.ts      # Cliente HTTP
│       ├── components/          # Componentes
│       └── package.json
│
└── scripts/init.sql             # Schema PostgreSQL
```

## Testar Fluxo Completo

### 1. Registro

```bash
curl -X POST http://localhost:3001/api/usuarios/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@test.com",
    "nome": "Teste User",
    "senha": "123456",
    "tipo": "artista"
  }' -c cookies.txt
```

### 2. Login Web

- Abrir http://localhost:3000
- Login automático com cookie

### 3. Login Mobile

- Abrir app via Expo
- Login automático com cookie httpOnly

## Autenticação com httpOnly Cookies

### Como Funciona

1. **Login**: Backend gera JWT (7 dias)
2. **Cookie httpOnly**: JWT salvo em cookie seguro (não acessível via JS)
3. **Requisições**: Cookie é enviado automaticamente
4. **Logout**: Cookie é deletado pelo servidor

### Como Usar

**Frontend Web**

```typescript
const response = await fetch(`${API_URL}/api/usuarios/me`, {
  credentials: "include", // Envia cookie
});
```

**Frontend Mobile**

```typescript
import { api } from "@/services/api";
const user = await api.getCurrentUser(); // Inclui automaticamente
```

**Backend**

```typescript
router.get("/me", authenticateToken, async (req, res) => {
  // req.user vem do JWT do cookie
});
```

## BFF - Backend for Frontend

BFF otimiza respostas para cada cliente:

- Mobile: Dados compactos, menos waterfall
- Web: Inclui metadata, paginação, filtros

Exemplo:

```
Mobile  → BFF Mobile (3002)  → Backend (3001)
Web     → BFF Web (3003)     → Backend (3001)
```

## Padrões Importantes

### 1. Tipos em `backend/src/types/index.ts`

```typescript
export interface Usuario {
  id_usuario: string;
  email: string;
  nome: string;
}
```

### 2. Controllers com try/catch

```typescript
export const getUsuario = async (req, res) => {
  try {
    const result = await db.query(...);
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
```

### 3. Rotas Protegidas

```typescript
router.get("/me", authenticateToken, getCurrentUser);
```

### 4. Frontend Service Centralizado

```typescript
// lib/api.ts
export const api = {
  async getUser() {
    return fetch(`${API_URL}/api/usuarios/me`, {
      credentials: "include",
    }).then((r) => r.json());
  },
};
```

## Documentação Completa

- **[README.md](README.md)** - Visão geral
- **[DESENVOLVIMENTO.md](DESENVOLVIMENTO.md)** - Arquitetura
- **[API.md](API.md)** - Endpoints (19 rotas)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Produção
- **[DOCUMENTACAO.md](DOCUMENTACAO.md)** - Índice

## Erros Comuns

| Erro                                | Solução                                |
| ----------------------------------- | -------------------------------------- |
| `Cannot find module`                | `npm install` no diretório             |
| `ECONNREFUSED 5432`                 | PostgreSQL não está rodando            |
| `401 Unauthorized`                  | Fazer login novamente (cookie expirou) |
| `CORS error`                        | Adicionar `credentials: 'include'`     |
| `Cannot read property 'id_usuario'` | Adicionar `authenticateToken` na rota  |

## Testar APIs

```bash
# Listar artistas
curl http://localhost:3001/api/artistas

# Login
curl -X POST http://localhost:3001/api/usuarios/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@test.com","senha":"123456"}' \
  -c cookies.txt

# Com autenticação
curl -X GET http://localhost:3001/api/usuarios/me \
  -b cookies.txt

# BFF Mobile
curl http://localhost:3002/api/mobile/artistas
```

## Suporte

- Logs: Terminal onde rodou `npm run dev`
- Network: F12 > Network tab no browser
- Mobile: Expo app ou Expo Go
- Docs: Veja os arquivos `.md`
