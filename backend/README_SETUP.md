# Music Connect Backend Setup

## Docker Setup

### Iniciar o banco de dados:

```bash
docker-compose up -d
```

### Ver logs do PostgreSQL:

```bash
docker-compose logs -f postgres
```

### Parar o banco de dados:

```bash
docker-compose down
```

### Resetar o banco (perderá dados):

```bash
docker-compose down -v && docker-compose up -d
```

## Dependências instaladas

- `pg` - Driver PostgreSQL
- `dotenv` - Gerenciar variáveis de ambiente
- `cors` - CORS middleware
- `bcryptjs` - Hash de senhas
- `jsonwebtoken` - JWT para autenticação
- `@types/pg` - Types para TypeScript

## Executar backend

### Em desenvolvimento:

```bash
npm run dev
```

### Build para produção:

```bash
npm run build
npm start
```

## Acessar banco de dados

### Via pgAdmin (UI Web):

- URL: http://localhost:5050
- Email: admin@musicconnect.com
- Senha: admin123

### Via psql (CLI):

```bash
docker exec -it music-connect-db psql -U music_user -d music_connect_db
```

## Endpoints disponíveis

### Status

- `GET /health` - Health check simples
- `GET /api/status` - Status com banco de dados

### Usuários

- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/:id` - Obter por ID
- `POST /api/usuarios` - Criar novo

### Artistas

- `GET /api/artistas` - Listar todos
- `GET /api/artistas?search=termo` - Buscar artistas
- `GET /api/artistas/:id` - Obter por ID

### Propostas

- `GET /api/propostas/recebidas/:id` - Propostas recebidas
- `GET /api/propostas/enviadas/:id` - Propostas enviadas
- `GET /api/propostas/:id` - Obter proposta
- `POST /api/propostas` - Criar proposta
- `PUT /api/propostas/:id/status` - Atualizar status

### Avaliações

- `GET /api/avaliacoes/:id_alvo` - Listar avaliações
- `POST /api/avaliacoes` - Criar avaliação

## Testando a API

### Com curl:

```bash
# Listar usuários
curl http://localhost:3001/api/usuarios

# Listar artistas
curl http://localhost:3001/api/artistas

# Criar nova proposta
curl -X POST http://localhost:3001/api/propostas \
  -H "Content-Type: application/json" \
  -d '{
    "id_contratante": 1,
    "id_artista": 2,
    "titulo": "Show para Casamento",
    "descricao": "Evento ao vivo",
    "data_evento": "2026-02-15",
    "hora_evento": "19:00",
    "local_evento": "Salão ABC",
    "valor_proposto": 2500
  }'
```

## 🗄️ Estrutura do Banco

### Tabelas criadas:

- `usuarios` - Usuários do sistema
- `artistas` - Dados adicionais de artistas
- `propostas` - Propostas de trabalho
- `avaliacoes` - Avaliações/reviews
- `mensagens` - Chat messages (preparado)
- `notificacoes` - Notifications (preparado)
- `favoritos` - Favoritos (preparado)

### Dados iniciais:

4 usuários de teste foram criados automaticamente com IDs 1-4
