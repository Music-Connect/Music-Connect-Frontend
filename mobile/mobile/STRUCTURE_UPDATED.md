# 🎵 Music Connect - Mobile App (Expo)

## 📋 Estrutura Atualizada do Projeto

### Telas Implementadas (25 telas)

#### **Autenticação (6 telas)**

- `app/index.tsx` - Landing Page com hero section e CTAs
- `app/login.tsx` - Login com email/senha
- `app/profile-selector.tsx` - Seleção entre Artista/Contractor
- `app/register-artist.tsx` - Formulário de registro de artista
- `app/register-contractor.tsx` - Formulário de registro de contratante
- `app/forgot-password.tsx` - Recuperação de senha

#### **App Principal (4 telas)**

- `app/(tabs)/index.tsx` - Dashboard com propostas recebidas
- `app/(tabs)/explore.tsx` - Descoberta de artistas com filtros básicos
- `app/(tabs)/profile.tsx` - Perfil do usuário com tabs
- `app/(tabs)/_layout.tsx` - Navegação em tabs (Dashboard, Explore, Profile)

#### **Detalhes e Propostas (4 telas)**

- `app/artist/[id].tsx` - Perfil público de artista
- `app/proposal/[id].tsx` - Detalhes de proposta recebida
- `app/proposals-sent.tsx` - Lista de propostas enviadas
- `app/proposal-sent/[id].tsx` - Detalhes de proposta enviada

#### **Novas Telas Implementadas (5 telas)**

- ✨ `app/create-proposal.tsx` - Formulário para criar proposta para um artista
- ✨ `app/reviews.tsx` - Avaliações recebidas e enviadas com sistema de rating
- ✨ `app/history.tsx` - Histórico de propostas aceitas/recusadas com estatísticas
- ✨ `app/edit-profile.tsx` - Edição completa do perfil do usuário
- ✨ `app/advanced-search.tsx` - Busca avançada com filtros (tipo, gênero, localização)

#### **Configurações (2 telas)**

- `app/settings.tsx` - Configurações com tabs e atalhos rápidos
- `app/modal.tsx` - Modal padrão

---

## 🧩 Componentes Compartilhados (4 componentes)

### `components/shared/Header.tsx`

- Header reutilizável com botão voltar
- Props: `title`, `showBack`, `rightComponent`, `style`
- Usado em: Todas as telas de detalhe

### `components/shared/Button.tsx`

- Button com variantes: primary, secondary, danger, outline
- Props: `label`, `onPress`, `variant`, `disabled`, `icon`, `style`
- Usado em: Todas as telas

### `components/shared/Card.tsx`

- Container reutilizável com 2 variantes: default, ghost
- Props: `children`, `variant`, `style`
- Usado em: Formulários, listas, informações

### `components/shared/Badge.tsx`

- Badge para status com 4 variantes: info, success, warning, error
- Props: `label`, `variant`, `icon`
- Usado em: Status de propostas, avaliações

---

## 🎣 Hooks Customizados (2 hooks)

### `hooks/useFormState.ts`

- Gerencia estado de formulário
- Retorna: `form`, `setForm`, `handleChange`, `reset`

### `hooks/useConfirm.ts`

- Hook para confirmação de ações
- Retorna: `confirm(title, message, onConfirm)`

---

## 🎨 Utilitários (2 arquivos)

### `utils/theme.ts`

Design tokens centralizados:

```typescript
COLORS: {
  primary: '#EC4899',
  secondary: '#FCD34D',
  background: '#000',
  surface: '#18181B',
  border: '#3F3F46',
  text: '#fff',
  textSecondary: '#999',
}
SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT
```

### `utils/proposalHelpers.ts`

Funções utilitárias:

- `getStatusColor(status)` - Retorna cor do status
- `getStatusLabel(status)` - Retorna label do status
- `getStatusIcon(status)` - Retorna emoji do status
- `getFilterLabel(status)` - Label para filtros
- `formatDate(date)` - Formata data completa
- `formatDateShort(date)` - Formata data curta
- `formatDateLong(date)` - Formata data longa

---

## 📊 Mock Data

### `constants/mockData.ts`

- `mockUser` - Usuário logado com todas as propriedades
- `mockArtists` - 8 artistas com detalhes completos
- `mockProposals` - 5 propostas recebidas
- `mockProposalsSent` - 4 propostas enviadas
- `mockPosts` - 6 posts para demonstração

---

## 🔄 Fluxo de Navegação

### Autenticação → App Principal

```
index (Landing) → login → profile-selector
→ register-artist/contractor → (tabs)
```

### Dashboard

```
(tabs)/index (Dashboard)
├─ proposal/[id] (Detalhes proposta recebida)
├─ proposals-sent (Minhas propostas)
│  └─ proposal-sent/[id] (Detalhes proposta enviada)
├─ reviews (Minhas avaliações)
├─ history (Histórico)
├─ settings (Configurações)
│  ├─ reviews
│  ├─ history
│  └─ advanced-search
└─ profile (Meu perfil)
   └─ edit-profile (Editar perfil)
```

### Explore

```
(tabs)/explore (Explorar artistas)
├─ advanced-search (Busca avançada com filtros)
└─ artist/[id] (Perfil do artista)
   └─ create-proposal (Criar proposta)
```

---

## 🎯 Recursos Implementados

### ✅ Completo

- [x] Autenticação (6 telas de auth)
- [x] Dashboard com propostas
- [x] Exploração de artistas
- [x] Perfil do usuário
- [x] Edição de perfil
- [x] Sistema de propostas (enviadas e recebidas)
- [x] Detalhes de propostas
- [x] Criação de propostas
- [x] Avaliações com sistema de rating
- [x] Histórico de propostas com filtros
- [x] Busca avançada com múltiplos filtros
- [x] Settings com atalhos rápidos
- [x] Dark theme consistente
- [x] Componentes reutilizáveis
- [x] Hooks customizados
- [x] Responsividade (mobile)

### ⏳ Futuro

- [ ] Chat/Messaging
- [ ] Notificações em tempo real
- [ ] Favoritos/Bookmarks
- [ ] Reviews detalhados
- [ ] Integração com API real
- [ ] Autenticação real (JWT)
- [ ] Upload de fotos
- [ ] Agendamento de eventos
- [ ] Pagamentos

---

## 🚀 Como Usar

### Instalação

```bash
npm install
# ou
yarn install
```

### Rodar

```bash
expo start
npx expo start
```

### Build

```bash
expo build:ios
expo build:android
```

---

## 📱 Design System

### Cores

- **Primária**: #EC4899 (Pink)
- **Secundária**: #FCD34D (Yellow)
- **Background**: #000 (Black)
- **Surface**: #18181B (Dark Gray)
- **Border**: #3F3F46 (Gray)
- **Texto**: #fff (White)
- **Texto Secundário**: #999 (Gray)
- **Sucesso**: #10B981 (Green)
- **Erro**: #EF4444 (Red)
- **Warning**: #F59E0B (Amber)

### Tipografia

- **Font Weight**: 400, 500, 600, 700, 900
- **Font Sizes**: 11, 12, 13, 14, 16, 18, 20, 24, 28, 48

---

## 📦 Dependências Principais

```json
{
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.0",
  "expo-router": "^2.0.0",
  "expo-status-bar": "~1.8.1"
}
```

---

## 🏗️ Arquitetura

```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx (Dashboard)
│   │   ├── explore.tsx (Explore)
│   │   ├── profile.tsx (Profile)
│   │   └── _layout.tsx
│   ├── artist/[id].tsx
│   ├── proposal/[id].tsx
│   ├── proposals-sent.tsx
│   ├── proposal-sent/[id].tsx
│   ├── create-proposal.tsx ✨
│   ├── reviews.tsx ✨
│   ├── history.tsx ✨
│   ├── edit-profile.tsx ✨
│   ├── advanced-search.tsx ✨
│   ├── settings.tsx
│   ├── _layout.tsx (Root Stack)
│   └── (auth) - Login, Register, etc
├── components/
│   └── shared/
│       ├── Header.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Badge.tsx
├── hooks/
│   ├── useFormState.ts
│   └── useConfirm.ts
├── utils/
│   ├── theme.ts
│   └── proposalHelpers.ts
├── constants/
│   └── mockData.ts
└── package.json
```

---

## 💡 Próximos Passos

1. **Chat System**: Implementar sistema de mensagens entre usuários
2. **Notificações**: Sistema de notificações em tempo real
3. **Pagamentos**: Integrar Stripe/PagSeguro para pagamentos
4. **Backend API**: Conectar com API real em vez de mock data
5. **Autenticação**: Implementar JWT e autenticação real
6. **Upload de Fotos**: Permitir upload de avatares e posts
7. **Agendamento**: Sistema de agendamento de eventos
8. **Reviews**: Sistema completo de avaliações e comentários

---

**Última Atualização**: Fevereiro 2026
**Status**: 25 telas implementadas, app funcional com mock data
**BFF**: 3 Express servers (Backend: 3001, Mobile: 3002, Web: 3003)
