# 🏗️ Arquitetura do Music Connect

## 📌 Visão Geral

O **Music Connect** é uma plataforma de conexão entre artistas e contratantes, implementada com arquitetura **BFF (Backend for Frontend)** com 3 servidores Node.js/Express separados.

```
┌─────────────────────────────────────────────────────────┐
│                   MÚSICA CONNECT                         │
│                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────┐ │
│  │   Mobile     │    │     Web      │    │  Backend   │ │
│  │  (Expo/RN)   │    │   (Next.js)  │    │ (Express)  │ │
│  └──────┬───────┘    └──────┬───────┘    └─────┬──────┘ │
│         │                   │                   │        │
│    (Port 3002)         (Port 3003)        (Port 3001)   │
│         │                   │                   │        │
│         └───────────┬───────┴───────────────────┘        │
│                     │                                    │
│              BFF (Backend for Frontend)                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
         ↓         ↓         ↓
      Database  Auth System  Cache
```

---

## 🏛️ Arquitetura em Camadas

### **Nível 1: Frontend - Mobile (Expo)**

```
┌─────────────────────────────────────────┐
│         EXPO / REACT NATIVE             │
│  - File-based routing (Expo Router)     │
│  - 25 telas + componentes               │
│  - Estado local (useState)              │
│  - Mock data (em desenvolvimento)       │
│  - Dark theme consistente               │
└─────────────────────────────────────────┘
           ↓
     HTTP/REST API
           ↓
┌─────────────────────────────────────────┐
│    BFF MOBILE (Express - Port 3002)     │
│  - Endpoints específicos para mobile    │
│  - Autenticação                         │
│  - Validação                            │
│  - Cache                                │
└─────────────────────────────────────────┘
```

### **Nível 2: Backend for Frontend (BFF)**

Cada BFF é responsável por um cliente específico:

#### **BFF Mobile (Port 3002)**

```typescript
GET  /api/artistas           // Lista artistas
GET  /api/artistas/:id       // Perfil artista
GET  /api/propostas          // Minhas propostas
POST /api/propostas          // Criar proposta
GET  /api/reviews            // Minhas avaliações
POST /api/reviews            // Criar avaliação
GET  /api/historico          // Histórico
GET  /api/perfil             // Meu perfil
PUT  /api/perfil             // Atualizar perfil
POST /api/auth/login         // Login
POST /api/auth/register      // Registro
GET  /api/chat/:id           // Conversas
```

#### **BFF Web (Port 3003)**

```typescript
GET  /api/dashboard          // Dashboard
GET  /api/artistas           // Galeria artistas
POST /api/projetos           // Criar projeto
GET  /api/projetos/:id       // Detalhes projeto
POST /api/pagamentos         // Processar pagamento
```

### **Nível 3: Backend Principal (Port 3001)**

```typescript
Database Layer
├── Autenticação (JWT)
├── Usuários
├── Propostas
├── Artistas
├── Avaliações
├── Chats/Mensagens
├── Notificações
└── Pagamentos
```

---

## 🗂️ Estrutura de Pastas - Mobile

```
mobile/mobile/
│
├── app/                          # Telas (Expo Router)
│   ├── (tabs)/                   # Navegação em tabs
│   │   ├── _layout.tsx           # Config tabs
│   │   ├── index.tsx             # Dashboard
│   │   ├── explore.tsx           # Explorar artistas
│   │   └── profile.tsx           # Perfil
│   │
│   ├── artist/[id].tsx           # Perfil artista dinâmico
│   ├── proposal/[id].tsx         # Detalhes proposta recebida
│   ├── proposals-sent.tsx        # Minhas propostas
│   ├── proposal-sent/[id].tsx    # Detalhes proposta enviada
│   │
│   ├── create-proposal.tsx       # Criar proposta
│   ├── reviews.tsx               # Avaliações
│   ├── history.tsx               # Histórico
│   ├── edit-profile.tsx          # Editar perfil
│   ├── advanced-search.tsx       # Busca avançada
│   │
│   ├── settings.tsx              # Configurações
│   ├── login.tsx                 # Login
│   ├── register-artist.tsx       # Registro artista
│   ├── register-contractor.tsx   # Registro contratante
│   ├── profile-selector.tsx      # Seleção tipo perfil
│   ├── forgot-password.tsx       # Recuperar senha
│   │
│   ├── index.tsx                 # Landing page
│   ├── _layout.tsx               # Root layout
│   └── modal.tsx                 # Modal exemplo
│
├── components/                   # Componentes reutilizáveis
│   └── shared/
│       ├── Header.tsx            # Header com voltar
│       ├── Button.tsx            # Button 4 variantes
│       ├── Card.tsx              # Container card
│       └── Badge.tsx             # Badge status
│
├── hooks/                        # Custom hooks
│   ├── useFormState.ts           # Gerenciar form
│   └── useConfirm.ts             # Confirmação
│
├── utils/                        # Utilitários
│   ├── theme.ts                  # Design tokens
│   └── proposalHelpers.ts        # Funções propostas
│
├── constants/                    # Constantes
│   └── mockData.ts               # Dados mock
│
└── package.json                  # Dependências
```

---

## 🔄 Fluxo de Dados

### **1. Autenticação**

```
┌─────────────┐
│   Login     │
│   Screen    │
└──────┬──────┘
       │ (email, password)
       ↓
┌──────────────────────┐
│  BFF Mobile (3002)   │
│  POST /auth/login    │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│  Backend (3001)      │
│  Validar credenciais │
│  Gerar JWT token     │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│  Armazenar token     │
│  (AsyncStorage)      │
└──────────────────────┘
       │
       ↓
┌──────────────────────┐
│  Redirecionar para   │
│  Dashboard           │
└──────────────────────┘
```

### **2. Busca de Artistas**

```
┌─────────────────┐
│  Explore Tab    │
│  (explore.tsx)  │
└────────┬────────┘
         │ user query: "João"
         ↓
┌──────────────────────────┐
│  Filter Local            │
│  (useEffect + useState)  │
└────────┬─────────────────┘
         │
         ├─→ [Artistas filtrados]
         │
         ↓
┌──────────────────────────┐
│  Renderizar com FlatList │
│  (mockArtists)           │
└──────────────────────────┘
         │
         ↓
┌──────────────────────────┐
│  Usuário clica artista   │
│  router.push(/artist/2)  │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│  artist/[id].tsx         │
│  (Perfil artista)        │
└──────────────────────────┘
```

**Futuro (com API):**

```
Explore (search query)
    ↓
BFF Mobile: GET /api/artistas?search=joão
    ↓
Backend: Query Database
    ↓
Retorna JSON com artistas
    ↓
Renderizar resultado
```

### **3. Criar Proposta**

```
┌──────────────────────┐
│  artist/[id].tsx     │
│  (Perfil artista)    │
└────────┬─────────────┘
         │ Clica "Enviar Proposta"
         ↓
┌──────────────────────┐
│  create-proposal.tsx │
│  (Formulário)        │
└────────┬─────────────┘
         │
         │ Preenche:
         │  - Título
         │  - Descrição
         │  - Data/Hora
         │  - Local
         │  - Valor
         │
         ↓
┌──────────────────────────┐
│  BFF Mobile              │
│  POST /api/propostas     │
│  (com JWT token)         │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│  Backend (3001)          │
│  Salvar no Database      │
│  Notificar artista       │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│  Retorna sucesso         │
│  Redireciona Dashboard   │
└──────────────────────────┘
```

---

## 🎨 Sistema de Design

### **Componentes Reutilizáveis**

```typescript
// Header - Todas as telas de detalhe
<Header title="Meu Título" showBack />

// Button - 4 variantes
<Button label="Salvar" variant="primary" onPress={handleSave} />
<Button label="Cancelar" variant="secondary" />
<Button label="Deletar" variant="danger" />
<Button label="Sair" variant="outline" />

// Card - Container genérico
<Card>
  <Text>Conteúdo aqui</Text>
</Card>
<Card variant="ghost">Transparente</Card>

// Badge - Status
<Badge label="Aceito" variant="success" />
<Badge label="Pendente" variant="warning" />
<Badge label="Recusado" variant="error" />
```

### **Design Tokens**

```typescript
// Cores
PRIMARY: #EC4899        (Pink)
SECONDARY: #FCD34D      (Yellow)
BACKGROUND: #000        (Black)
SURFACE: #18181B        (Dark)
BORDER: #3F3F46         (Gray)
TEXT: #fff              (White)
TEXT_SECONDARY: #999    (Gray)
SUCCESS: #10B981        (Green)
ERROR: #EF4444          (Red)
WARNING: #F59E0B        (Amber)

// Spacing
8px, 12px, 16px, 20px, 24px

// Border Radius
8px, 10px, 12px, 16px, 20px

// Font
400 (regular)
500 (medium)
600 (semibold)
700 (bold)
900 (black)
```

---

## 🌳 Navegação

### **Stack Navigation (Expo Router)**

```
Root Layout (_layout.tsx)
│
├── index.tsx                 (Landing)
│   └── login.tsx
│       └── profile-selector.tsx
│           ├── register-artist.tsx
│           └── register-contractor.tsx
│
├── (tabs)/_layout.tsx        (Tab Navigation)
│   │
│   ├── index.tsx             (Dashboard)
│   │   ├── proposal/[id].tsx (Detalhes proposta)
│   │   └── proposals-sent.tsx
│   │       └── proposal-sent/[id].tsx
│   │
│   ├── explore.tsx           (Explorar)
│   │   ├── advanced-search.tsx
│   │   └── artist/[id].tsx
│   │       └── create-proposal.tsx
│   │
│   └── profile.tsx           (Perfil)
│       └── edit-profile.tsx
│
├── settings.tsx              (Configurações)
│   ├── reviews.tsx
│   ├── history.tsx
│   └── advanced-search.tsx
│
└── forgot-password.tsx
```

---

## 💾 Gestão de Estado

### **Padrão Atual (Mock Data)**

```typescript
// Componente
import { mockArtists } from '@/constants/mockData';

export default function ExploreScreen() {
  const [filteredArtists, setFilteredArtists] = useState(mockArtists);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Filtrar localmente
    const filtered = mockArtists.filter(a =>
      a.usuario.includes(searchQuery)
    );
    setFilteredArtists(filtered);
  }, [searchQuery]);

  return (
    <FlatList
      data={filteredArtists}
      renderItem={({ item }) => <ArtistCard {...item} />}
    />
  );
}
```

### **Padrão Futuro (Com API)**

```typescript
// Custom Hook
export function useArtistas(query: string) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3002/api/artistas?search=${query}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await response.json();
      setArtists(data);
      setLoading(false);
    };

    fetchArtists();
  }, [query]);

  return { artists, loading };
}

// Componente
export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { artists, loading } = useArtistas(searchQuery);

  // Renderizar...
}
```

---

## 🔐 Autenticação e Segurança

### **Fluxo Atual (Mock)**

```
1. Usuário faz login na tela /login
2. Validação local (apenas verificar preenchimento)
3. Redirecionar para dashboard
```

### **Fluxo Futuro (Com JWT)**

```
┌──────────────┐
│  Login Form  │
└──────┬───────┘
       │ POST /auth/login
       │ { email, password }
       ↓
┌────────────────────────────┐
│  BFF Mobile (3002)         │
│  Validar credenciais       │
└──────┬─────────────────────┘
       │
       ↓
┌────────────────────────────┐
│  Backend (3001)            │
│  Verificar no Database     │
│  Gerar JWT                 │
│  JWT = {user_id, role}     │
└──────┬─────────────────────┘
       │
       ↓
┌────────────────────────────┐
│  Retornar JWT              │
│  { token, refreshToken }   │
└──────┬─────────────────────┘
       │
       ↓
┌────────────────────────────┐
│  AsyncStorage.setItem      │
│  ('token', jwt)            │
└──────┬─────────────────────┘
       │
       ↓
┌────────────────────────────┐
│  Próximas requisições:     │
│  Header: Authorization:    │
│  Bearer {jwt}              │
└────────────────────────────┘
```

---

## 🗄️ Dados - Estrutura

### **Usuário**

```typescript
{
  id_usuario: 1,
  usuario: "João Silva",
  email: "joao@email.com",
  telefone: "11999999999",
  tipo_usuario: "Artista",
  local_atuacao: "São Paulo, SP",
  descricao: "Guitarrista profissional...",
  cor_tema: "#EC4899",
  cor_banner: "#000"
}
```

### **Artista**

```typescript
{
  id_usuario: 2,
  usuario: "Maria Santos",
  tipo_usuario: "Artista",
  local_atuacao: "Rio de Janeiro, RJ",
  descricao: "Cantora de música popular",
  disponivel: true,
  rating: 4.8,
  totalReviews: 12
}
```

### **Proposta**

```typescript
{
  id_proposta: 1,
  titulo: "Show para Casamento",
  descricao: "Evento ao vivo...",
  artista_id: 2,
  contratante_id: 1,
  data: "2026-02-15",
  hora: "19:00",
  local: "Salão Festa ABC",
  valor: "2500.00",
  status: "pendente",
  criada_em: "2026-02-01"
}
```

### **Avaliação**

```typescript
{
  id_avaliacao: 1,
  autor_id: 1,
  alvo_id: 2,
  rating: 5,
  comentario: "Excelente profissional!",
  criada_em: "2026-02-01"
}
```

---

## 🚀 Implementação Futura - Roadmap

### **Fase 1: API Integration** (Próxima)

```
✅ Criar BFF Mobile (Express + Node)
✅ Criar Backend principal
✅ Conectar telas ao BFF
✅ Autenticação JWT
✅ Mock data → Database real
```

### **Fase 2: Features Críticas**

```
□ Chat/Mensagens
□ Notificações
□ Pagamentos (Stripe)
□ Upload de fotos
□ Agendamento
```

### **Fase 3: Melhorias**

```
□ Push notifications
□ Offline mode
□ Analytics
□ Ratings detalhados
□ Recomendações (ML)
```

---

## 📊 Stack Tecnológico

### **Frontend - Mobile**

- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-based)
- **HTTP**: Fetch API (ou Axios)
- **State**: React Hooks (useState, useEffect)
- **Styling**: StyleSheet (React Native)
- **Storage**: AsyncStorage

### **BFF**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Auth**: JWT
- **Validation**: Zod/Joi

### **Backend**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL / MongoDB
- **ORM**: Prisma / TypeORM
- **Cache**: Redis
- **Auth**: JWT + OAuth2

### **DevOps**

- **Containerization**: Docker
- **Deployment**: AWS / Digital Ocean
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston / Sentry

---

## 🔌 Integração com API

### **Exemplo: Busca de Artistas**

**Antes (Mock Data):**

```typescript
// components/explore.tsx
import { mockArtists } from "@/constants/mockData";
const artists = mockArtists;
```

**Depois (Com API):**

```typescript
// hooks/useArtists.ts
export function useArtists(search: string) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = await AsyncStorage.getItem('token');

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3002/api/artistas?search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [search, token]);

  return { artists, loading };
}

// components/explore.tsx
export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { artists, loading } = useArtists(searchQuery);

  if (loading) return <LoadingSpinner />;

  return <FlatList data={artists} renderItem={renderArtist} />;
}
```

---

## 🧪 Testing Strategy

```
┌─────────────────────────────────────┐
│  Unit Tests (Jest)                  │
│  - Componentes                      │
│  - Hooks customizados               │
│  - Funções utilitárias              │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Integration Tests (Detox)          │
│  - Fluxos de navegação              │
│  - Interações de usuário            │
│  - Dados de formulário              │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  E2E Tests                          │
│  - Login até proposta               │
│  - Avaliação completa               │
│  - Fluxos críticos                  │
└─────────────────────────────────────┘
```

---

## 📚 Referências de Arquivos

| Arquivo                        | Propósito             |
| ------------------------------ | --------------------- |
| `app/_layout.tsx`              | Root navigation stack |
| `app/(tabs)/_layout.tsx`       | Tab navigation config |
| `components/shared/Button.tsx` | Button reutilizável   |
| `hooks/useFormState.ts`        | Form state management |
| `utils/theme.ts`               | Design tokens         |
| `constants/mockData.ts`        | Dados mock            |
| `STRUCTURE_UPDATED.md`         | Documentação telas    |

---

## 🎯 Como Começar o Desenvolvimento

### **1. Entender a navegação**

```
Leia: app/_layout.tsx e app/(tabs)/_layout.tsx
```

### **2. Criar uma nova tela**

```
1. Criar arquivo em app/nome.tsx
2. Adicionar rota em _layout.tsx
3. Importar componentes de shared/
4. Usar dados de constants/mockData.ts
5. Testar navegação
```

### **3. Adicionar funcionalidade**

```
1. Criar hook em hooks/ se precisar lógica reutilizável
2. Usar useState para estado local
3. Usar useEffect para side effects
4. Integrar com API futura (substituir mockData)
```

### **4. Estilizar**

```
1. Usar utils/theme.ts para cores/spacing
2. Usar componentes de shared/ quando possível
3. Replicar dark theme em novo StyleSheet
4. Testar em mobile (largura <= 500px)
```

---

## ✅ Checklist de Implementação

- [x] 25 telas implementadas
- [x] 4 componentes reutilizáveis
- [x] 2 custom hooks
- [x] Design system completo
- [x] Mock data estruturado
- [x] Navegação funcional
- [x] Dark theme
- [x] Responsive design (mobile)
- [ ] BFF Mobile (Express)
- [ ] Backend principal
- [ ] Autenticação JWT
- [ ] Database (PostgreSQL/MongoDB)
- [ ] Chat/Messaging
- [ ] Notificações
- [ ] Upload de fotos
- [ ] Pagamentos

---

**Última atualização**: Fevereiro 2026
**Status**: Arquitetura definida, front-end pronto para integração
**Próximo passo**: Criar BFF Mobile em Express.js
