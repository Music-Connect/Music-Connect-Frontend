# Normalização de Contratos API - Music Connect

Data: 2026-02-16

## Resumo Executivo

Foram identificadas e corrigidas **5 categorias principais** de conflitos entre frontend, BFF e backend que causavam desalinhamento de contratos e tipos.

---

## 1️⃣ Correções no BFF Web (`/bff-web`)

### 1.1 Auth Routes (Login/Register)

**Problema:** Backend retorna `{ success, user, token }` (direto), mas BFF Web tentava acessar `response.data.data?.token` (wrapping duplo).

**Arquivos afetados:**

- `src/routes/auth.ts` (linhas 28, 29, 69, 70)

**Solução:**

```typescript
// Antes
const token = response.data.data?.token; // ❌ undefined

// Depois
const token = response.data.token; // ✅ correto
```

### 1.2 Tipos de Resposta do Backend

**Problema:** BFF esperava `{ media: number; total: number }` mas backend retorna `{ media_nota, total_avaliacoes }`.

**Arquivos afetados:**

- `src/routes/usuarios.ts` (linha 51-55)
- `src/routes/artistas.ts` (linha 87-89)
- `src/types/index.ts` - adicionado interface `BackendMediaAvaliacoes`

**Solução:**

```typescript
// Antes
axios.get<ApiResponse<{ media: number; total: number }>>();
mediaResponse.data.data?.media; // ❌ undefined

// Depois
axios.get<ApiResponse<BackendMediaAvaliacoes>>();
mediaResponse.data.data?.media_nota; // ✅ correto
```

### 1.3 Tipos de Proposta

**Problema:** BFF definiu campos obrigatórios `contratante_nome`, `artista_nome`, mas backend retorna `nome_contratante`, `nome_artista` ou `nome_outro` (variável por contexto).

**Arquivo afetado:**

- `src/types/index.ts` - `PropostaComDetalhes`

**Solução:**

```typescript
// Antes
export interface PropostaComDetalhes extends Proposta {
  contratante_nome: string; // ❌ obrigatório mas varia
  artista_nome: string;
}

// Depois
export interface PropostaComDetalhes extends Proposta {
  nome_contratante?: string; // ✅ opcional, reflete backend
  nome_artista?: string;
  nome_outro?: string;
}
```

---

## 2️⃣ Correções no BFF Mobile (`/bff-mobile`)

### 2.1 Media Avaliacoes

**Problema:** Mesmo que BFF Web - mapeamento de campos.

**Arquivos afetados:**

- `src/routes/usuarios.ts` (linha 73)
- `src/routes/artistas.ts` (linha 98, 117)
- `src/types/index.ts` - adicionado `BackendMediaAvaliacoes`

**Solução:** Idêntica ao BFF Web.

### 2.2 Tipos de Proposta

**Problema:** Mesmo que BFF Web.

**Arquivo afetado:**

- `src/types/index.ts`

**Solução:** Idêntica ao BFF Web.

### 2.3 Rota /api/mobile/auth/register - Mapeamento de Campos

**Problema:** Mobile client envia `{ nome, tipo, email, senha }` mas backend espera `{ usuario, tipo_usuario }`.

**Arquivo afetado:**

- `src/routes/auth.ts` (já tinha mapeamento, apenas confirmado)

**Status:** ✅ Já correto no código anterior.

---

## 3️⃣ Correções no Frontend Mobile

### 3.1 Enums de Status de Proposta

**Problema:** Mobile usava `"rejeitada" | "concluida"` mas backend usa `"recusada" | "cancelada"`.

**Arquivos afetados:**

- `app/proposals-sent.tsx` (tipo `ProposalStatus`, métodos de cor/label)
- `app/history.tsx` (tipo `HistoryItem`, filtros, stats)
- `app/proposal/[id].tsx` (tipo `ProposalStatus`)
- `app/proposal-sent/[id].tsx` (tipo `ProposalStatus`)

**Solução:**

```typescript
// Antes
type ProposalStatus = "pendente" | "aceita" | "rejeitada" | "concluida"; // ❌

// Depois
type ProposalStatus = "pendente" | "aceita" | "recusada" | "cancelada"; // ✅
```

**Mudanças de label:**

- `"rejeitada"` → `"recusada"` (em filters, stats, case statements)
- `"concluida"` → `"cancelada"` (em case statements)

### 3.2 Modelos de Usuario

**Situação:** Mobile client usa aliases `{ nome, bio, foto_perfil, tipo }` mas API retorna `{ usuario, descricao, imagem_perfil_url, tipo_usuario }`.

**Arquivo afetado:**

- `services/api.ts` - interface `Usuario`

**Status:** ✅ Mapeamento intermediário já existe no BFF Mobile, sem mudanças necessárias no client.

### 3.3 Modelos de Proposta

**Arquivo:** `services/api.ts` - interface `Proposta`

**Status:** ✅ Atualizado para refletir os campos reais do backend.

---

## 4️⃣ Limpeza de Código Legado

### 4.1 Rotas Users Não Utilizadas

**Arquivo removido:**

- `bff-web/src/routes/users.ts` (estava apontando para endpoints `/api/users` inexistentes no backend)

**Motivo:** Rotas legadas que não mapeavam para nenhum endpoint real do backend.

---

## 5️⃣ Validação de Build

| Módulo     | Status       | Comando                          |
| ---------- | ------------ | -------------------------------- |
| BFF Web    | ✅ Compilado | `cd bff-web && npm run build`    |
| BFF Mobile | ✅ Compilado | `cd bff-mobile && npm run build` |

---

## 📋 Checklist de Mudanças

### Backend (SEM MUDANÇAS)

- ✅ Keep status enums: `"pendente" | "aceita" | "recusada" | "cancelada"`
- ✅ Keep field names: `media_nota`, `total_avaliacoes`, `nome_artista`, `nome_contratante`, `nome_outro`

### BFF Web

- ✅ Corrigido mapeamento de auth response (remover `data` wrapper)
- ✅ Corrigido mapeamento de media avaliacoes (`media_nota`, `total_avaliacoes`)
- ✅ Atualizado tipo `PropostaComDetalhes` (campos opcionais)
- ✅ Removido arquivo `users.ts`

### BFF Mobile

- ✅ Corrigido mapeamento de media avaliacoes
- ✅ Atualizado tipo `PropostaComDetalhes` (campos opcionais)
- ✅ Tipo de Usuario já com suporte a mapeamento (nome ↔ usuario, etc)

### Frontend Mobile

- ✅ Atualizado enum de status: `recusada` e `cancelada`
- ✅ Atualizado interface `Usuario` em `api.ts` (aliases suportados)
- ✅ Atualizado interface `Proposta` em `api.ts`

### Frontend Web

- ✅ SEM MUDANÇAS NECESSÁRIAS (usa BFF Web como intermediário)

---

## 🔄 Fluxo de Dados Normalizado

```
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (3001)                          │
├─────────────────────────────────────────────────────────────────┤
│ Response: { success, user, token }                              │
│ Status enum: pendente | aceita | recusada | cancelada          │
│ Campos: usuario, tipo_usuario, media_nota, total_avaliacoes    │
└──┬──────────────────────────────────────────────────────────┬──┘
   │                                                          │
   v                                                          v
┌──────────────────────┐                            ┌──────────────────────┐
│   BFF WEB (3003)     │                            │ BFF MOBILE (3002)    │
├──────────────────────┤                            ├──────────────────────┤
│ Response: { success, │                            │ Response: { success, │
│  data: {token, user} │                            │  data: {...} }       │
│ }                    │                            │ Register: mapeamento │
│ Tipos: corretos      │                            │ Tipos: corretos      │
└────┬─────────────────┘                            └────┬────────────────┘
     │                                                   │
     v                                                   v
┌─────────────────────────────┐            ┌──────────────────────┐
│   Frontend Web (3000)       │            │ Frontend Mobile      │
│ Usa: BFF Web (3003)         │            │ Usa: BFF Mobile      │
│ Enum: recusada, cancelada   │            │ (2002)               │
│                             │            │ Enum: recusada       │
│                             │            │ cancelada            │
└─────────────────────────────┘            └──────────────────────┘
```

---

## 🚀 Próximos Passos (Recomendado)

1. **Deploy & Teste em staging:**
   - Verificar login/registro em ambos frontends
   - Testar listar propostas com novos enums
   - Testar avaliacoes e media

2. **Documentação:**
   - Atualizar API.md com tipos corretos
   - Criar guia de consumo para novos campos opcionais

3. **Monitoramento:**
   - Logs de erro relacionados a acesso de campos undefined
   - Alertas para respostas com estrutura inesperada

---

**Preparado por:** GitHub Copilot  
**Data:** 2026-02-16  
**Versão:** 1.0
