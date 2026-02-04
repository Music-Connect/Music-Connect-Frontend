# Music Connect - Plataforma de Conexão entre Artistas e Contratantes

Um ecossistema integrado para conectar músicos profissionais com contratantes, facilitando descoberta, comunicação e fechamento de propostas.

## Documentação

- **[QUICK_START.md](QUICK_START.md)** - Comece em 5 minutos!
- **[DESENVOLVIMENTO.md](DESENVOLVIMENTO.md)** - Como adicionar features e padrões do código
- **[API.md](API.md)** - Documentação completa de todas as rotas
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guia de deployment em produção

## Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Web (Next.js)                  │
│              localhost:3000 | React + TypeScript            │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼───────┐  ┌──────▼────────┐
│   BFF Mobile   │  │   BFF Web    │  │  Backend Core │
│  Expo/React    │  │  Next.js     │  │   Express.js  │
│ localhost:3002 │  │ localhost:3003│  │ localhost:3001│
└────────────────┘  └──────────────┘  └───────┬───────┘
                                               │
                                      ┌────────▼─────────┐
                                      │  PostgreSQL 15   │
                                      │  localhost:5433  │
                                      └──────────────────┘
```

## Quick Start

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15 rodando em `localhost:5433`
- npm ou yarn

### Instalação

```bash
# 1. Instalar dependências do backend
cd backend
npm install

# 2. Instalar dependências BFF Mobile
cd ../bff-mobile
npm install

# 3. Instalar dependências BFF Web
cd ../bff-web
npm install

# 4. Instalar dependências Frontend Web
cd ../frontend-web/frontend-web
npm install

# 5. Instalar dependências Mobile (React Native)
cd ../../mobile/mobile
npm install
```

### Variáveis de Ambiente

**Backend** (`.env`):

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5433
DB_USER=music_user
DB_PASSWORD=postgres
DB_NAME=music_connect_db
JWT_SECRET=seu_segredo_super_secreto_aqui_mudar_em_producao
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Executar Serviços

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: BFF Mobile
cd bff-mobile
npm run dev

# Terminal 3: BFF Web
cd bff-web
npm run dev

# Terminal 4: Frontend Web
cd frontend-web/frontend-web
npm run dev

# Terminal 5: Mobile (opcional)
cd mobile/mobile
npm start
```

Acesse `http://localhost:3000` no navegador.

## Estrutura de Dados

### Tabelas Principais

**usuarios**

- `id_usuario` (PK)
- `usuario`, `email`, `senha`
- `tipo_usuario` enum: 'artista' | 'contratante'
- `telefone`, `cidade`, `estado`
- `genero_musical` (apenas artistas)
- `imagem_perfil_url`, `cor_tema`, `cor_banner`

**propostas**

- `id_proposta` (PK)
- `id_contratante` (FK), `id_artista` (FK)
- `titulo`, `descricao`
- `local_evento`, `data_evento`
- `valor_oferecido` (numeric)
- `status` enum: 'pendente' | 'aceita' | 'recusada' | 'cancelada'
- `created_at`, `updated_at`

**avaliacoes**

- `id_avaliacao` (PK)
- `id_avaliador` (FK), `id_avaliado` (FK)
- `nota` (1-5), `comentario`
- `created_at`

## Autenticação e Segurança

### JWT + httpOnly Cookies

Tokens JWT são armazenados em **httpOnly cookies** para proteger contra XSS:

```
┌─────────────────────────────────────┐
│ Login/Register Request              │
└────────────────┬────────────────────┘
                 │
        ┌────────▼────────┐
        │  Valida email   │
        │  e senha        │
        └────────┬────────┘
                 │
        ┌────────▼──────────────────────────┐
        │ Gera JWT Token                   │
        │ exp: 7 dias                      │
        └────────┬──────────────────────────┘
                 │
        ┌────────▼──────────────────────────┐
        │ Define httpOnly Cookie:          │
        │ - httpOnly: true (XSS protection)│
        │ - secure: true (HTTPS em prod)   │
        │ - sameSite: lax (CSRF protection)│
        │ - maxAge: 7 dias                 │
        └────────┬──────────────────────────┘
                 │
        ┌────────▼────────────────────────────┐
        │ Cliente recebe resposta com token   │
        │ Cookie enviado automaticamente      │
        └─────────────────────────────────────┘
```

### Fluxo de Requisições Autenticadas

```javascript
// Frontend
const response = await fetch("http://localhost:3001/api/propostas", {
  method: "GET",
  credentials: "include", // Envia cookie automaticamente
});

// Backend - Middleware de Auth
const token =
  req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
```

## Rotas da API

### Autenticação

- `POST /api/usuarios/auth/login` - Login
- `POST /api/usuarios/auth/register` - Registro
- `POST /api/usuarios/auth/logout` - Logout (limpa cookie)

### Usuários

- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/:id` - Detalhe de usuário
- `PUT /api/usuarios/:id` - Atualizar perfil (autenticado)

### Artistas

- `GET /api/artistas` - Listar todos artistas
- `GET /api/artistas/:id` - Detalhe de artista

### Propostas

- `GET /api/propostas/recebidas?id_artista=X` - Para artistas
- `GET /api/propostas/enviadas?id_contratante=X` - Para contratantes
- `GET /api/propostas/:id` - Detalhe de proposta
- `POST /api/propostas` - Criar proposta (autenticado)
- `PUT /api/propostas/:id/status` - Aceitar/recusar (autenticado)

### Avaliações

- `GET /api/avaliacoes/usuario/:id` - Avaliações recebidas
- `POST /api/avaliacoes` - Criar avaliação (autenticado)

## Stack Tecnológico

### Backend

- **Express.js 5.2** - Framework web
- **TypeScript** - Type safety
- **PostgreSQL 15** - Banco de dados
- **jsonwebtoken** - JWT tokens
- **bcryptjs** - Hash de senhas
- **cookie-parser** - Parse de cookies

### Frontend Web

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Fetch API** - Requisições HTTP

### BFF (Backend for Frontend)

- **Express.js 5.2** - Agregação de serviços
- **TypeScript** - Type safety
- Camada adicional para mobile e web

### Mobile

- **React Native** - Desenvolvimento mobile
- **Expo** - Gerenciador de build
- **TypeScript** - Type safety

## Guia para Desenvolvedores

### Adicionando Nova Rota

1. **Criar controlador** em `backend/src/controllers/`
2. **Adicionar rota** em `backend/src/routes/`
3. **Proteger com middleware** se necessário

```typescript
// controllers/exemplosController.ts
export const getExemplos = async (req: Request, res: Response) => {
  try {
    const examples = await db.query("SELECT * FROM exemplos");
    res.json({ data: examples.rows });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar exemplos" });
  }
};

// routes/exemplos.ts
import { authenticateToken } from "../middleware/auth.js";

router.get("/", getExemplos); // Público
router.post("/", authenticateToken, createExemplo); // Autenticado
```

### Adicionando Tipo TypeScript

Todos os tipos devem estar em `backend/src/types/index.ts`:

```typescript
export interface Exemplo {
  id_exemplo: number;
  titulo: string;
  descricao: string;
  created_at: string;
}
```

### Testando Rotas

Use ferramentas como Postman ou curl com cookies:

```bash
# Login e obter cookie
curl -i -X POST http://localhost:3001/api/usuarios/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","senha":"password"}' \
  -c cookies.txt

# Usar cookie em requisição subsequente
curl -X GET http://localhost:3001/api/propostas/recebidas \
  -b cookies.txt
```

## Fluxo de Usuário

### Artista

1. **Registro** → Especificar tipo "artista"
2. **Perfil** → Adicionar gênero musical, descrição, fotos
3. **Explorar** → Ver propostas disponíveis
4. **Propostas** → Aceitar/recusar ofertas
5. **Avaliações** → Receber e dar avaliações

### Contratante

1. **Registro** → Especificar tipo "contratante"
2. **Buscar Artistas** → Filtrar por gênero, local
3. **Enviar Propostas** → Descrever evento, valor oferecido
4. **Gerenciar** → Acompanhar status das propostas
5. **Avaliar** → Deixar feedback após contratação

## Troubleshooting

### Erro: "Unexpected token" no Next.js

Verificar se há duplicação de código ou sintaxe inválida em arquivo `.tsx`

### Erro: "401 Unauthorized"

Cookie pode ter expirado (7 dias) ou não foi enviado com `credentials: 'include'`

### Erro: "Connection refused" PostgreSQL

Verificar se PostgreSQL está rodando em `localhost:5433` com credenciais corretas

## Notas Importantes

- **Todos os tokens têm expiração de 7 dias**
- **Senhas são hasheadas com bcrypt (10 rounds)**
- **CORS está configurado para localhost com credenciais habilitadas**
- **httpOnly cookies impedem acesso via JavaScript (proteção XSS)**
- **Migrations de banco de dados estão em `scripts/init.sql`**

## Links Úteis

- PostgreSQL: [https://www.postgresql.org/](https://www.postgresql.org/)
- Express.js: [https://expressjs.com/](https://expressjs.com/)
- Next.js: [https://nextjs.org/](https://nextjs.org/)
- JWT: [https://jwt.io/](https://jwt.io/)
- React Native/Expo: [https://expo.dev/](https://expo.dev/)
