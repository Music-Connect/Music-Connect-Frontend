# Guia Rápido - Music Connect

Comece a desenvolver em 5 minutos!

## ⚡ Setup Rápido

### 1. Clonar e Instalar

```bash
git clone <repositorio>
cd music-connect

# Backend
cd backend && npm install && cd ..

# Frontend Web
cd frontend-web/frontend-web && npm install && cd ../..

# BFF Mobile
cd bff-mobile && npm install && cd ..

# BFF Web
cd bff-web && npm install && cd ..
```

### 2. Configurar PostgreSQL

```bash
# Criar banco (executar uma vez)
psql -U postgres -c "CREATE DATABASE music_connect_db;"
psql -U postgres -c "CREATE USER music_user WITH PASSWORD 'postgres';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE music_connect_db TO music_user;"

# Executar schema
psql -U music_user -d music_connect_db -f scripts/init.sql
```

### 3. Executar Tudo em Paralelo

**Terminal 1 - Backend**

```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend**

```bash
cd frontend-web/frontend-web && npm run dev
```

**Terminal 3 - BFF Mobile** (opcional)

```bash
cd bff-mobile && npm run dev
```

**Terminal 4 - BFF Web** (opcional)

```bash
cd bff-web && npm run dev
```

Pronto! Acesse `http://localhost:3000`

---

## 🔐 Teste de Autenticação

```bash
# 1. Registrar
curl -X POST http://localhost:3001/api/usuarios/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "teste",
    "email": "teste@test.com",
    "senha": "123456",
    "tipo_usuario": "artista"
  }' -c cookies.txt

# 2. Ver propostas recebidas (autenticado)
curl -X GET 'http://localhost:3001/api/propostas/recebidas?id_artista=1' \
  -b cookies.txt
```

---

## 📚 Documentação Completa

- **[README.md](README.md)** - Visão geral do projeto
- **[DESENVOLVIMENTO.md](DESENVOLVIMENTO.md)** - Como adicionar features
- **[API.md](API.md)** - Documentação de todas as rotas
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Como fazer deploy

---

## 🎯 Estrutura Principal

```
backend/
  src/controllers/   → Lógica de negócio
  src/routes/        → Definição de rotas
  src/middleware/    → Autenticação
  src/types/         → Interfaces TypeScript

frontend-web/
  app/               → Páginas
  components/        → Componentes React
  lib/api.ts         → Cliente HTTP

bff-mobile/          → Agregação de APIs para mobile
bff-web/             → Agregação de APIs para web
```

---

## 🔑 Padrões Importantes

### 1. Todas as requisições HTTP devem incluir `credentials: 'include'`

```typescript
const response = await fetch(url, {
  credentials: "include", // Envia cookie automaticamente
});
```

### 2. Tipos TypeScript vão em `backend/src/types/index.ts`

```typescript
export interface MinhaEntidade {
  id: number;
  nome: string;
}
```

### 3. Rotas protegidas usam middleware `authenticateToken`

```typescript
router.put("/:id", authenticateToken, updateController);
```

### 4. Sempre tratar erros em try/catch

```typescript
try {
  // código
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Erro" });
}
```

---

## 🚀 Adicionar Nova Rota (Exemplo)

### Passo 1: Tipo

```typescript
// backend/src/types/index.ts
export interface Exemplo {
  id_exemplo: number;
  titulo: string;
}
```

### Passo 2: Controller

```typescript
// backend/src/controllers/exemplosController.ts
export const getExemplos = async (req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM exemplos");
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Erro" });
  }
};
```

### Passo 3: Rota

```typescript
// backend/src/routes/exemplos.ts
import { Router } from "express";
import { getExemplos } from "../controllers/exemplosController.js";

const router = Router();
router.get("/", getExemplos);
export default router;
```

### Passo 4: Registrar no Express

```typescript
// backend/src/index.ts
import exemplosRouter from "./routes/exemplos.js";
app.use("/api/exemplos", exemplosRouter);
```

### Passo 5: Usar no Frontend

```typescript
// lib/api.ts
export const api = {
  async getExemplos() {
    const response = await fetch(`${API_BASE_URL}/api/exemplos`, {
      credentials: "include",
    });
    return response.json();
  },
};

// Usar em componente
const [exemplos, setExemplos] = useState([]);
useEffect(() => {
  api.getExemplos().then((data) => setExemplos(data.data));
}, []);
```

---

## 🐛 Erros Comuns

| Erro                                | Solução                               |
| ----------------------------------- | ------------------------------------- |
| `Cannot find module`                | Executar `npm install`                |
| `ECONNREFUSED`                      | PostgreSQL não está rodando           |
| `401 Unauthorized`                  | Token expirado, fazer login novamente |
| `CORS error`                        | Adicionar `credentials: 'include'`    |
| `Cannot read property of undefined` | Verificar tipos TypeScript            |

---

## 🧪 Testar Backend

```bash
# Listar artistas
curl http://localhost:3001/api/artistas

# Usuário específico
curl http://localhost:3001/api/usuarios/1

# Com autenticação (usar cookies.txt gerado no login)
curl http://localhost:3001/api/propostas/recebidas?id_artista=1 -b cookies.txt
```

---

## 💾 Salvar Progresso

```bash
git add .
git commit -m "descrição da mudança"
git push origin main
```

---

## 📞 Precisa de Ajuda?

- Ver logs do backend: `npm run dev` (já mostra no terminal)
- Ver rede: DevTools do navegador (F12)
- Testar API: Use Postman ou curl
- Ler documentação: Veja os arquivos `.md`

---

## ✅ Checklist de Desenvolvimento

Antes de commitar:

- [ ] Sem `console.log()` de debug
- [ ] TypeScript compila sem erros
- [ ] Tipos definidos para tudo
- [ ] Autenticação implementada se necessário
- [ ] Tratamento de erros completo
- [ ] Sem `any` types
- [ ] Commit message descritiva
