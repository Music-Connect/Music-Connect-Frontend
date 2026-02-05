# Guia de Desenvolvimento

Este documento contém informações úteis para desenvolvedores que desejam contribuir ou entender a arquitetura interna da Music Connect.

## Estrutura de Pastas

```
music-connect/
├── backend/                 # Express API principal
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── routes/          # Definição de rotas
│   │   ├── middleware/      # Autenticação e validação
│   │   ├── database.ts      # Conexão PostgreSQL
│   │   ├── types/           # Interfaces TypeScript
│   │   └── index.ts         # Servidor principal
│   ├── .env                 # Variáveis de ambiente
│   └── package.json
│
├── frontend-web/            # Next.js web
│   └── frontend-web/
│       ├── app/             # Páginas e rotas
│       ├── components/      # Componentes React
│       ├── lib/             # Utilitários (API client)
│       └── package.json
│
├── bff-mobile/              # BFF para mobile
│   ├── src/routes/          # Agregação de APIs
│   └── package.json
│
├── bff-web/                 # BFF para web
│   ├── src/routes/          # Agregação de APIs
│   └── package.json
│
├── mobile/                  # React Native
│   └── mobile/
│       ├── app/             # Telas (Expo Router)
│       ├── components/      # Componentes
│       └── package.json
│
└── scripts/                 # SQL e utilitários
    └── init.sql             # Schema do banco
```

## Fluxo de Dados

### Arquitetura Completa com BFF

```
┌────────────────────┐       ┌────────────────────┐
│ Frontend Mobile    │       │ Frontend Web       │
│ (Expo/React)       │       │ (Next.js)          │
└────────┬───────────┘       └────────┬───────────┘
         │                           │
         │ credentials:              │ credentials:
         │ 'include'                 │ 'include'
         │                           │
    ┌────▼────────────┐      ┌───────▼──────────┐
    │ BFF Mobile      │      │ BFF Web          │
    │ Express.js      │      │ Express.js       │
    │ localhost:3002  │      │ localhost:3003   │
    └────┬────────────┘      └────────┬─────────┘
         │                            │
         │ Otimizado mobile          │ SSR/ISR friendly
         │                           │
         └────────────┬──────────────┘
                      │
          ┌───────────▼────────────┐
          │ Backend Core           │
          │ Express.js             │
          │ localhost:3001         │
          │ - Validação JWT        │
          │ - Lógica de negócio    │
          │ - Queries no banco      │
          └───────────┬────────────┘
                      │
          ┌───────────▼────────────┐
          │ PostgreSQL 15          │
          │ localhost:5433         │
          └────────────────────────┘
```

### Fluxo Detalhado de Autenticação

```
Cliente (Mobile ou Web)
        │
        └─▶ POST /api/auth/login
                    │
            ┌───────▼────────┐
            │ BFF (opcional) │ (otimiza dados)
            └───────┬────────┘
                    │
        ┌───────────▼───────────┐
        │ Backend Express       │
        │ - Valida credenciais  │
        │ - Gera JWT token      │
        │ - Define httpOnly     │
        │   cookie (7 dias)     │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────┐
        │ Cliente recebe        │
        │ - Token em cookie     │
        │ - Dados do usuário    │
        └───────────────────────┘

Próximas Requisições Autenticadas
        │
        └─▶ GET /api/propostas
                    │
            Cookie enviado automaticamente
                    │
        ┌───────────▼───────────┐
        │ Backend               │
        │ - Lê cookie           │
        │ - Verifica JWT        │
        │ - Autoriza ou nega    │
        │ - Retorna dados       │
        └───────────────────────┘
```

## Padrões de Desenvolvimento

### 1. Controladores

Sempre seguir este padrão:

```typescript
// backend/src/controllers/nomeController.ts

import { Request, Response } from "express";
import db from "../database.js";
import { TipoResposta } from "../types/index.js";

// Erro handler personalizado
interface RequestWithUser extends Request {
  user?: { id_usuario: number };
}

export const getNome = async (req: RequestWithUser, res: Response) => {
  try {
    // 1. Validação de entrada
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // 2. Query no banco
    const result = await db.query(
      "SELECT * FROM tabela WHERE id_exemplo = $1",
      [id],
    );

    // 3. Verificar se existe
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Não encontrado" });
    }

    // 4. Retornar sucesso
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// Com autenticação
export const updateNome = async (req: RequestWithUser, res: Response) => {
  try {
    // O middleware auth já verificou e setou req.user
    const userId = req.user?.id_usuario;
    const { nome } = req.body;

    if (!nome || nome.trim().length === 0) {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    await db.query("UPDATE tabela SET nome = $1 WHERE id_usuario = $2", [
      nome,
      userId,
    ]);

    res.json({ success: true, message: "Atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
```

### 2. Rotas

```typescript
// backend/src/routes/nomeRoutes.ts

import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getNome, updateNome } from "../controllers/nomeController.js";

const router = Router();

// Rotas públicas
router.get("/:id", getNome);

// Rotas autenticadas
router.put("/:id", authenticateToken, updateNome);

export default router;
```

### 3. Middleware de Autenticação

```typescript
// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id_usuario: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Tentar obter token do cookie
    let token = req.cookies?.token;

    // 2. Fallback para Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }

    // 3. Validar presença
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    // 4. Verificar validade
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret",
    ) as DecodedToken;

    // 5. Adicionar ao request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
```

### 4. Tipos TypeScript

```typescript
// backend/src/types/index.ts

// Sempre usar 'export interface' para tipos compartilhados
export interface Usuario {
  id_usuario: number;
  usuario: string;
  email: string;
  tipo_usuario: "artista" | "contratante";
  telefone?: string;
  created_at: string;
}

export interface Proposta {
  id_proposta: number;
  id_contratante: number;
  id_artista: number;
  titulo: string;
  status: "pendente" | "aceita" | "recusada" | "cancelada";
  valor_oferecido: number;
  created_at: string;
}
```

## Frontend - Chamadas à API

### Pattern de API Client

```typescript
// frontend-web/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getHeaders(): HeadersInit {
  return { "Content-Type": "application/json" };
}

export const api = {
  // Sempre incluir credentials: 'include' para enviar cookies
  async getUsuarios(): Promise<Usuario[]> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  },

  // Rotas autenticadas
  async updateUsuario(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar");
    }

    return response.json();
  },
};
```

### Pattern de Componentes com Dados

```typescript
// frontend-web/app/exemplo/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, Usuario } from "@/lib/api";

export default function ExemploPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar autenticação
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/login");
          return;
        }

        const userData = JSON.parse(storedUser);

        // Carregar dados frescos da API
        const data = await api.getUsuarios();
        setUsuario(data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar");

        // Se 401, deslogar
        if (err instanceof Error && err.message.includes("401")) {
          localStorage.removeItem("user");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!usuario) return <div>Não encontrado</div>;

  return <div>{usuario.usuario}</div>;
}
```

## Adicionando Novo Recurso (Exemplo Completo)

Digamos que você quer adicionar **Comentários em Propostas**:

### 1. Adicionar Tipo

```typescript
// backend/src/types/index.ts
export interface Comentario {
  id_comentario: number;
  id_proposta: number;
  id_usuario: number;
  texto: string;
  created_at: string;
}
```

### 2. Criar Controlador

```typescript
// backend/src/controllers/comentariosController.ts
export const getComenatarios = async (req: Request, res: Response) => {
  try {
    const { id_proposta } = req.params;

    const result = await db.query(
      `SELECT c.*, u.usuario, u.imagem_perfil_url 
       FROM comentarios c
       JOIN usuarios u ON c.id_usuario = u.id_usuario
       WHERE c.id_proposta = $1
       ORDER BY c.created_at DESC`,
      [id_proposta],
    );

    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar comentários" });
  }
};

export const createComentario = async (req: RequestWithUser, res: Response) => {
  try {
    const { id_proposta, texto } = req.body;
    const userId = req.user?.id_usuario;

    if (!texto || texto.trim().length === 0) {
      return res.status(400).json({ message: "Texto obrigatório" });
    }

    const result = await db.query(
      `INSERT INTO comentarios (id_proposta, id_usuario, texto, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [id_proposta, userId, texto],
    );

    res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar comentário" });
  }
};
```

### 3. Criar Rota

```typescript
// backend/src/routes/comentarios.ts
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getComentarios,
  createComentario,
} from "../controllers/comentariosController.js";

const router = Router();

router.get("/proposta/:id_proposta", getComentarios);
router.post("/", authenticateToken, createComentario);

export default router;
```

### 4. Registrar Rota no Express

```typescript
// backend/src/index.ts
import comentariosRouter from "./routes/comentarios.js";

app.use("/api/comentarios", comentariosRouter);
```

### 5. Migração do Banco

```sql
-- scripts/init.sql (adicionar antes do CREATE TABLE)
CREATE TABLE comentarios (
  id_comentario SERIAL PRIMARY KEY,
  id_proposta INT NOT NULL REFERENCES propostas(id_proposta) ON DELETE CASCADE,
  id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
  texto TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comentarios_proposta ON comentarios(id_proposta);
```

### 6. Adicionar ao API Client

```typescript
// frontend-web/lib/api.ts
export interface Comentario {
  id_comentario: number;
  id_proposta: number;
  id_usuario: number;
  usuario: string;
  texto: string;
  created_at: string;
}

export const api = {
  // ... outros métodos ...

  async getComentarios(id_proposta: number): Promise<Comentario[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/comentarios/proposta/${id_proposta}`,
      { credentials: "include" },
    );

    if (!response.ok) throw new Error("Erro ao buscar comentários");
    const data = await response.json();
    return data.data || [];
  },

  async createComentario(id_proposta: number, texto: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/comentarios`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ id_proposta, texto }),
    });

    if (!response.ok) throw new Error("Erro ao criar comentário");
  },
};
```

### 7. Usar no Frontend

```typescript
// frontend-web/app/proposta/[id]/page.tsx
const [comentarios, setComentarios] = useState<Comentario[]>([]);

useEffect(() => {
  api.getComentarios(id).then(setComentarios);
}, [id]);

const handleAddComentario = async (texto: string) => {
  await api.createComentario(id, texto);
  // Recarregar comentários
  const updated = await api.getComentarios(id);
  setComentarios(updated);
};
```

## Testes Manual com Curl

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3001/api/usuarios/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "joao_artista",
    "email": "joao@example.com",
    "senha": "senha123",
    "tipo_usuario": "artista"
  }' \
  -c cookies.txt

# 2. Fazer login
curl -X POST http://localhost:3001/api/usuarios/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }' \
  -c cookies.txt

# 3. Usar cookie em requisição autenticada
curl -X GET http://localhost:3001/api/usuarios/1 \
  -b cookies.txt

# 4. Logout (limpa cookie)
curl -X POST http://localhost:3001/api/usuarios/auth/logout \
  -b cookies.txt
```

## Erros Comuns

| Erro                                        | Causa                         | Solução                                     |
| ------------------------------------------- | ----------------------------- | ------------------------------------------- |
| `Cannot read property 'token' of undefined` | Cookie não foi enviado        | Adicionar `credentials: 'include'` na fetch |
| `401 Unauthorized`                          | Token expirado ou inválido    | Fazer login novamente                       |
| `CORS error`                                | Origem não autorizada         | Verificar `CORS_ORIGIN` no `.env`           |
| `Connection refused`                        | PostgreSQL desligado          | `pg_ctl start` ou Docker                    |
| `SyntaxError: Unexpected token`             | Arquivo `.tsx` com duplicação | Verificar sintaxe e duplicações             |

## Recursos Úteis

- **Express.js Docs**: https://expressjs.com/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **JWT Debugger**: https://jwt.io/
- **Next.js Docs**: https://nextjs.org/docs

## Checklist para PR

Antes de fazer um Pull Request:

- [ ] Código segue padrões da aplicação
- [ ] Todos os tipos TypeScript definidos
- [ ] Tratamento de erros implementado
- [ ] Autenticação verificada se necessário
- [ ] Banco de dados sincronizado
- [ ] Sem `console.log()` em produção
- [ ] Sem valores hard-coded (usar `.env`)
- [ ] Sem `any` types
