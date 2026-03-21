# Music Connect — UI System

Design system de referência para reutilização de padrões visuais no frontend.

**Stack**: Next.js 16 · React 19 · Tailwind CSS v4 · Lucide React · TypeScript
**Idioma**: pt-BR
**Tema**: Dark (zinc + black base)

---

## Tokens de Design

### Paleta de Cores

```
Brand gradient:  from-amber-300 via-rose-400 to-fuchsia-500
Background:      #0a0a0a / black
Surface:         zinc-900/40  (cards)
Surface hover:   zinc-900/60
Border:          zinc-800/60  → hover: zinc-700/80
Text primary:    white
Text secondary:  zinc-400
Text muted:      zinc-500 / zinc-600
```

**Status colors:**

| Status      | Bg                      | Dot            | Label       |
|-------------|-------------------------|----------------|-------------|
| `pendente`  | `amber-500/10`          | `amber-400`    | Pendente    |
| `aceita`    | `emerald-500/10`        | `emerald-400`  | Aceita      |
| `recusada`  | `red-500/10`            | `red-400`      | Recusada    |
| `cancelada` | `zinc-500/10`           | `zinc-500`     | Cancelada   |

### Tipografia

```
Font:   system-ui, -apple-system, sans-serif
Pesos:  400 / 500 / 700 / 900 (font-black)

Headings:   text-3xl / text-4xl  font-black
Subtítulos: text-xl / text-2xl   font-bold
Body:       text-sm / text-base
Labels:     text-[13px]          font-medium
Caps:       text-[11px]          font-bold uppercase tracking-[0.2em]
Micro:      text-[10px]          font-semibold uppercase tracking-[0.25em]
```

### Border Radius

```
Inputs / Buttons:   rounded-xl   (0.75rem)
Cards:              rounded-2xl  (1rem)
Avatars / Pills:    rounded-full
Ícones wraps:       rounded-xl / rounded-2xl
```

### Transições

```
Rápido:   duration-200   (hover states)
Normal:   duration-300   (cards, elevação)
Lento:    duration-500   (glows, blobs)
Easing:   ease-out (default)
```

---

## Componentes

### BackButton

```tsx
import BackButton from "@/components/BackButton";

// Ir para rota específica
<BackButton href="/dashboard" />

// Voltar para página anterior
<BackButton />

// Personalizado
<BackButton href="/login" label="Login" className="..." />
```

**Quando usar**: Em todas as páginas exceto `/dashboard`.

---

### Sidebar

```tsx
import Sidebar from "@/components/Sidebar";

<Sidebar
  isArtist={user.tipo_usuario === "artista"}
  activePage="dashboard"   // "dashboard" | "proposals" | "explore" | "profile" | "settings"
  onLogout={handleLogout}
/>
```

**Visibilidade**: `hidden md:flex` — oculta em mobile.

---

### Header

```tsx
import Header from "@/components/Header";

<Header
  user={user}
  userType={user.tipo_usuario}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  onSearch={handleSearch}
/>
```

**Comportamento**: sticky, `top-0 z-30`, backdrop blur.

---

### ProposalCard

```tsx
import ProposalCard from "@/components/ProposalCard";

<ProposalCard
  item={proposta}
  isArtist={isArtist}
  onAcceptDecline={handleAcceptDecline}  // opcional
/>
```

**Ações**: botões Aceitar/Recusar aparecem apenas para artistas com propostas pendentes.

---

### DashboardBanner

```tsx
import DashboardBanner from "@/components/DashboardBanner";

<DashboardBanner isArtist={isArtist} />
```

Renderiza conteúdo diferente para artistas e contratantes.

---

## Padrões de UI

### Input

```tsx
const inputClass =
  "w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50";

<input className={inputClass} placeholder="..." />
```

### Input com ícone à esquerda

```tsx
<div className="group relative">
  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-zinc-400">
    <Search size={14} />
  </span>
  <input className="... pl-10" />
</div>
```

### Label

```tsx
const labelClass = "mb-1.5 block text-[13px] font-medium text-zinc-400";

<label className={labelClass}>Campo *</label>
```

### Botão primário (white)

```tsx
<button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:scale-[1.01] hover:shadow-white/10 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none">
  {isLoading ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
      Carregando...
    </>
  ) : (
    "Ação"
  )}
</button>
```

### Botão secundário (outline)

```tsx
<button className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:text-white active:scale-[0.97]">
  Ação
</button>
```

### Botão com ícone animado

```tsx
<button className="group flex items-center gap-2 ...">
  Texto
  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
    <ArrowRight size={14} />
  </span>
</button>
```

### Card padrão

```tsx
<div className="group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-zinc-700/80 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5">
  {/* Glow no hover */}
  <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-linear-to-br from-amber-500/0 to-rose-500/0 blur-2xl transition-all duration-500 group-hover:from-amber-500/10 group-hover:to-rose-500/10" />
  {/* Conteúdo */}
</div>
```

### Card de formulário (auth pages)

```tsx
<div
  className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 backdrop-blur-sm"
  style={{ animationDelay: "80ms" }}
>
  {/* conteúdo */}
</div>
```

### Status badge

```tsx
const statusConfig = {
  pendente: { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  aceita:   { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  recusada: { bg: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-400" },
};

<span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${status.bg}`}>
  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
  {label}
</span>
```

### Alerta de erro

```tsx
<div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
  <AlertTriangle size={16} />
  {error}
</div>
```

### Alerta de sucesso

```tsx
<div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
  <CheckCircle2 size={16} />
  {message}
</div>
```

### Skeleton de loading

```tsx
<div className="animate-pulse rounded-2xl border border-zinc-800/40 bg-zinc-900/30 p-4">
  <div className="aspect-square rounded-xl bg-zinc-800/60 mb-4" />
  <div className="h-4 w-3/4 rounded bg-zinc-800/60 mb-2" />
  <div className="h-3 w-1/2 rounded bg-zinc-800/40" />
</div>
```

### Estado vazio (empty state)

```tsx
<div className="flex flex-col items-center justify-center py-20 text-center">
  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/60 text-zinc-600">
    <Search size={24} />
  </div>
  <p className="text-zinc-500 text-sm">Nenhum resultado encontrado</p>
  <p className="text-zinc-600 text-xs mt-1">Tente ajustar os filtros</p>
</div>
```

### Divisor com gradiente

```tsx
<div className="h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
```

### Section label (caps)

```tsx
<p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
  Seção
</p>
```

---

## Background Blobs (decoração)

Usado em páginas de auth e landing. Combinar 2–3 blobs em `pointer-events-none fixed inset-0`:

```tsx
<div className="pointer-events-none fixed inset-0">
  <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
  <div className="absolute -bottom-40 -left-40 h-100 w-100 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
</div>
```

**Combinações de cor por página:**

| Página               | Blobs                                 |
|----------------------|---------------------------------------|
| Login                | fuchsia/6 + amber/5                   |
| Forgot/Reset         | fuchsia/6 + amber/5                   |
| Register artist      | rose/6 + fuchsia/5                    |
| Register contractor  | amber/6 + rose/5                      |
| Invalid token        | red/6                                 |
| Profile selector     | rose/6 + amber/5                      |

---

## Animações

### Classes CSS

```css
/* globals.css */
.fade-in-up {
  animation: fade-in-up 0.5s ease-out both;
}

/* Stagger com style prop: */
<div className="fade-in-up" style={{ animationDelay: "80ms" }} />
<div className="fade-in-up" style={{ animationDelay: "160ms" }} />
/* Escalar com índice: animationDelay: `${Math.min(i * 60, 400)}ms` */
```

### Classes Tailwind nativas

| Classe           | Uso                              |
|------------------|----------------------------------|
| `animate-pulse`  | Skeleton loading, status dot     |
| `animate-ping`   | Notificação / status online      |
| `animate-spin`   | Spinner de loading em botões     |

### Spinner de botão

```tsx
<span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
```

---

## Layout de Páginas Autenticadas

```
┌──────────────────────────────────────────────┐
│  Sidebar (w-72, hidden md:flex)              │
│  ├── Brand                                   │
│  ├── Nav (Painel / Perfil sections)          │
│  └── Logout                                  │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │  Header (sticky, z-30, backdrop-blur)   │ │
│  │  ├── Search input                       │ │
│  │  └── Bell + Separator + User avatar     │ │
│  ├─────────────────────────────────────────┤ │
│  │  Main content (overflow-y-auto)         │ │
│  │  └── px-4 sm:px-6 lg:px-8  py-8        │ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

```tsx
<div className="flex h-screen overflow-hidden bg-black text-white">
  <Sidebar isArtist={isArtist} activePage="dashboard" onLogout={handleLogout} />
  <div className="flex flex-1 flex-col overflow-hidden">
    <Header user={user} userType={user.tipo_usuario} />
    <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* conteúdo */}
    </main>
  </div>
</div>
```

## Layout de Páginas de Auth

```tsx
<div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
  {/* Blobs de fundo */}
  <div className="pointer-events-none fixed inset-0">
    <div className="absolute ... blur-3xl" />
  </div>

  <div className="relative z-10 w-full max-w-md px-6 py-12">
    <div className="mb-6">
      <BackButton href="/login" />
    </div>

    {/* Brand */}
    <div className="fade-in-up mb-10 text-center">
      <Link href="/">
        <h1 className="text-3xl font-black tracking-tight">
          <span className="bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
            Music Connect
          </span>
        </h1>
      </Link>
    </div>

    {/* Card principal */}
    <div className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 backdrop-blur-sm"
         style={{ animationDelay: "80ms" }}>
      {/* form */}
    </div>

    {/* Footer link */}
    <p className="fade-in-up mt-8 text-center text-sm text-zinc-500"
       style={{ animationDelay: "160ms" }}>
      Texto{" "}
      <Link href="/login" className="font-semibold text-zinc-300 transition-colors hover:text-white">
        Link
      </Link>
    </p>
  </div>
</div>
```

---

## Avatar do Usuário

```tsx
{/* Com gradiente de fundo */}
<div className="relative h-10 w-10 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-0.5 shadow-lg shadow-rose-500/10">
  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
    {user.name.substring(0, 2).toUpperCase()}
  </div>
</div>
```

---

## Guard de Autenticação (auth pages)

Redireciona usuário já logado para o dashboard:

```tsx
const { user, sessionLoaded } = useAuthStore();

useEffect(() => {
  if (sessionLoaded && user) {
    router.replace("/dashboard");
  }
}, [user, sessionLoaded, router]);
```

**Aplicar em**: login, profile-selector, register-artist, register-contractor.

---

## Ícones (Lucide React)

Importação:
```tsx
import { NomeDoIcone } from "lucide-react";

<NomeDoIcone size={16} />  // tamanho padrão para ações
<NomeDoIcone size={24} />  // tamanho padrão para cards/headers
```

**Ícones em uso no projeto:**

| Ícone          | Uso                                    |
|----------------|----------------------------------------|
| `ArrowLeft`    | BackButton                             |
| `ArrowRight`   | CTAs, botões de ação                   |
| `ArrowUpRight` | Logout                                 |
| `BarChart2`    | Dashboard / visão geral                |
| `Bell`         | Notificações (header)                  |
| `Building2`    | Contratante / empresa                  |
| `Calendar`     | Data do evento                         |
| `CheckCircle2` | Sucesso / aceito                       |
| `ClipboardList`| Propostas do contratante               |
| `DollarSign`   | Valor / cachê                          |
| `FileText`     | Propostas / contratos                  |
| `Gem`          | Cachê / tier premium                   |
| `Headphones`   | Contratante (perfil selector)          |
| `Hourglass`    | Pendente                               |
| `Instagram`    | Rede social Instagram                  |
| `KeyRound`     | Recuperação de senha                   |
| `Lock`         | Senha / reset password                 |
| `Mail`         | Email de contato                       |
| `MapPin`       | Localização                            |
| `Mic`          | Artista                                |
| `Music`        | Gênero musical / artista               |
| `Search`       | Busca                                  |
| `Settings`     | Configurações                          |
| `Smartphone`   | Telefone                               |
| `User`         | Perfil do usuário                      |
| `Users`        | Grupo / todos                          |
| `X`            | Fechar / remover filtro                |
| `XCircle`      | Recusado / erro                        |
| `Youtube`      | Rede social YouTube                    |
| `AlertTriangle`| Erro / aviso                           |
