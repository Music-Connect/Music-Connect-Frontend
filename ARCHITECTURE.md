# Arquitetura BFF - Music Connect

## Visão Geral

Esta arquitetura implementa o padrão **Backend-For-Frontend (BFF)** para servir múltiplos clientes (mobile e web) com APIs otimizadas para cada plataforma.

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENTS                               │
├────────────────────┬──────────────────┬──────────────────┤
│   React Native     │    Next.js       │   Desktop App    │
│    (Mobile)        │    (Web)         │   (Future)       │
└────────┬───────────┴────────┬─────────┴──────────┬───────┘
         │                    │                    │
         │ HTTP/REST         │ HTTP/REST         │ HTTP/REST
         │                    │                    │
┌────────▼──────────┐  ┌──────▼──────────┐  ┌────▼──────────┐
│   BFF Mobile      │  │   BFF Web       │  │  BFF Desktop  │
│  (Port 3002)      │  │  (Port 3003)    │  │  (Port 3004)  │
└────────┬──────────┘  └──────┬──────────┘  └────┬──────────┘
         │                    │                    │
         │ HTTP/REST         │ HTTP/REST         │ HTTP/REST
         │                    │                    │
         └────────┬───────────┴────────────────────┘
                  │
         ┌────────▼──────────┐
         │   Backend Core    │
         │   (Port 3001)     │
         └────────┬──────────┘
                  │
         ┌────────▼──────────────┐
         │   Microservices       │
         │  - Audio Controller   │
         │  - Cache Service      │
         │  - Analytics Service  │
         └───────────────────────┘
```

## Componentes

### 1. Backend Core (`/backend`)

- **Responsabilidade**: Lógica de negócio centralizada
- **Port**: 3001
- **Linguagem**: TypeScript + Express
- **Endpoints Principais**:
  - `POST /api/auth/login`
  - `GET /api/users`
  - `GET /api/audio/tracks`
  - `POST /api/audio/tracks`

### 2. BFF Mobile (`/bff-mobile`)

- **Responsabilidade**: API otimizada para aplicativo React Native
- **Port**: 3002
- **Linguagem**: TypeScript + Express
- **Características**:
  - Endpoints V1 (`/api/v1/*`)
  - Respostas compactas e otimizadas
  - Paginação para economia de banda
  - Streaming de áudio
  - Autenticação por token

**Endpoints**:

```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/users/profile
GET    /api/v1/audio/tracks
GET    /api/v1/audio/tracks/:trackId
GET    /api/v1/audio/stream/:trackId
```

### 3. BFF Web (`/bff-web`)

- **Responsabilidade**: API otimizada para aplicativo Next.js
- **Port**: 3003
- **Linguagem**: TypeScript + Express
- **Características**:
  - Endpoints sem versionamento (`/api/*`)
  - Dados com mais detalhes
  - Suporte a search e filtros avançados
  - Gerenciamento de playlists

**Endpoints**:

```
POST   /api/auth/login
GET    /api/users/profile
GET    /api/users/preferences
PUT    /api/users/preferences
GET    /api/audio/tracks
GET    /api/audio/tracks/:trackId
GET    /api/audio/playlists
POST   /api/audio/playlists
POST   /api/audio/playlists/:playlistId/tracks
```

### 4. Mobile App (`/mobile`)

- **Responsabilidade**: Aplicativo React Native
- **Linguagem**: TypeScript + React Native
- **Estrutura**:
  ```
  src/
  ├── services/
  │   ├── api.ts          (Cliente HTTP)
  │   ├── auth.ts         (Autenticação)
  │   └── audio.ts        (Áudio/Tracks)
  ├── screens/
  │   ├── LoginScreen.tsx
  │   └── HomeScreen.tsx
  ├── navigation/
  │   └── AppNavigator.tsx
  └── App.tsx
  ```

## Fluxo de Requisição

### Exemplo: Buscar Tracks no Mobile

```
1. Mobile App (HomeScreen)
   └─> audioService.getTracks()
       └─> apiClient.get('/api/v1/audio/tracks?limit=20&offset=0')
           └─> BFF Mobile (Port 3002)
               └─> audioRoutes.setupAudioRoutes()
                   └─> axios.get('http://localhost:3001/api/audio/tracks')
                       └─> Backend Core (Port 3001)
                           └─> Retorna dados
                               └─> BFF transforma/filtra
                                   └─> Retorna ao Mobile
```

## Variáveis de Ambiente

### Backend Core (`.env`)

```
PORT=3001
NODE_ENV=development
```

### BFF Mobile (`.env`)

```
PORT=3002
BACKEND_URL=http://localhost:3001
NODE_ENV=development
```

### BFF Web (`.env`)

```
PORT=3003
BACKEND_URL=http://localhost:3001
NODE_ENV=development
```

### Mobile App (`.env.local`)

```
EXPO_PUBLIC_BFF_MOBILE_URL=http://localhost:3002
```

## Instalação e Execução

### Backend Core

```bash
cd backend
npm install
npm run dev
```

### BFF Mobile

```bash
cd bff-mobile
npm install
npm run dev
```

### BFF Web

```bash
cd bff-web
npm install
npm run dev
```

### Mobile App

```bash
cd mobile
npm install
npm start
# iOS: npm run ios
# Android: npm run android
```

## Padrões de Resposta

### Sucesso

```json
{
  "success": true,
  "data": { ... }
}
```

### Erro

```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

## Benefícios da Arquitetura BFF

1. **API Otimizada**: Cada cliente obtém exatamente o que precisa
2. **Escalabilidade**: Fácil adicionar novos clientes (desktop, smartwatch, etc.)
3. **Segurança**: BFF pode implementar lógica específica de segurança por cliente
4. **Cache**: Cada BFF pode manter seu próprio cache
5. **Rate Limiting**: Controlar uso por cliente
6. **Versionamento**: Cada cliente evolui independentemente
