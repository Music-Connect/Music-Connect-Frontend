# API Reference

Documentação completa das rotas da API da Music Connect.

## Base URL

```
http://localhost:3001/api
```

## Autenticação

A maioria das rotas requer autenticação via **JWT tokens em httpOnly cookies**.

### Como Autenticar

1. Fazer login em `/usuarios/auth/login`
2. O servidor retorna um cookie `token` (httpOnly)
3. O navegador envia automaticamente em requisições com `credentials: 'include'`

### Requisições com Autenticação

```bash
curl -X GET http://localhost:3001/api/propostas/recebidas \
  -b cookies.txt  # Envia cookie automaticamente
```

---

## Usuários

### POST `/usuarios/auth/register`

**Descrição**: Registrar novo usuário

**Acesso**: Público

**Body**:

```json
{
  "usuario": "joao_silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "tipo_usuario": "artista"
}
```

**Resposta (201)**:

```json
{
  "user": {
    "id_usuario": 1,
    "usuario": "joao_silva",
    "email": "joao@example.com",
    "tipo_usuario": "artista"
  },
  "token": "eyJhbGc..."
}
```

**Erros**:

- `400`: Email já existe
- `400`: Tipo de usuário inválido

---

### POST `/usuarios/auth/login`

**Descrição**: Fazer login

**Acesso**: Público

**Body**:

```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta (200)**:

```json
{
  "user": {
    "id_usuario": 1,
    "usuario": "joao_silva",
    "email": "joao@example.com",
    "tipo_usuario": "artista",
    "telefone": null,
    "cidade": null
  },
  "token": "eyJhbGc..."
}
```

**Cookies Definidos**:

- `token`: JWT token com expiração 7 dias (httpOnly)

**Erros**:

- `401`: Email ou senha incorretos
- `404`: Usuário não encontrado

---

### POST `/usuarios/auth/logout`

**Descrição**: Fazer logout e limpar cookie

**Acesso**: Público

**Resposta (200)**:

```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

**Efeito**: Cookie `token` é deletado

---

### POST `/usuarios/auth/forgot-password`

**Descrição**: Solicitar recuperação de senha

**Acesso**: Público

**Body**:

```json
{
  "email": "joao@example.com"
}
```

**Resposta (200)**:

```json
{
  "success": true,
  "message": "Se o email existir, você receberá instruções para redefinir sua senha"
}
```

**Comportamento**:

- Se as variáveis `EMAIL_USER` e `EMAIL_PASSWORD` estiverem configuradas, envia email com link de recuperação
- Se não configuradas, o token é exibido no console do backend (para desenvolvimento)
- Em ambiente de desenvolvimento sem email configurado, retorna `resetToken` na resposta

**Notas**:

- Não informa se o email existe (por segurança, previne enumeração de emails)
- Token expira em 1 hora
- Apenas um token ativo por usuário (tokens anteriores são invalidados)

**Configuração de Email**: Veja [EMAIL_SETUP.md](EMAIL_SETUP.md) para instruções de como configurar Gmail SMTP.

---

### POST `/usuarios/auth/reset-password`

**Descrição**: Redefinir senha com token

**Acesso**: Público

**Body**:

```json
{
  "token": "abc123...",
  "novaSenha": "minhaNovaSenha123"
}
```

**Resposta (200)**:

```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

**Erros**:

- `400`: Token e nova senha são obrigatórios
- `400`: Token inválido ou expirado
- `400`: A senha deve ter pelo menos 6 caracteres

---

### GET `/usuarios`

**Descrição**: Listar todos os usuários

**Acesso**: Público

**Query Params**:

- `search` (optional): Buscar por nome ou email

**Exemplo**:

```
GET /usuarios?search=joao
```

**Resposta (200)**:

```json
{
  "data": [
    {
      "id_usuario": 1,
      "usuario": "joao_silva",
      "email": "joao@example.com",
      "tipo_usuario": "artista",
      "cidade": "São Paulo",
      "genero_musical": "Rock"
    }
  ]
}
```

---

### GET `/usuarios/:id`

**Descrição**: Obter detalhe de um usuário

**Acesso**: Público

**Parâmetros**:

- `id`: ID do usuário

**Resposta (200)**:

```json
{
  "data": {
    "id_usuario": 1,
    "usuario": "joao_silva",
    "email": "joao@example.com",
    "tipo_usuario": "artista",
    "telefone": "11999999999",
    "cidade": "São Paulo",
    "estado": "SP",
    "genero_musical": "Rock",
    "descricao": "Guitarrista profissional",
    "imagem_perfil_url": "https://...",
    "cor_tema": "#FF6B00",
    "cor_banner": "#FFE5CC"
  }
}
```

**Erros**:

- `404`: Usuário não encontrado

---

### PUT `/usuarios/:id`

**Descrição**: Atualizar perfil do usuário

**Acesso**: Autenticado (deve ser o próprio usuário)

**Body**:

```json
{
  "telefone": "11999999999",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "descricao": "Guitarrista profissional",
  "genero_musical": "Rock",
  "cor_tema": "#FF6B00"
}
```

**Resposta (200)**:

```json
{
  "data": {
    "id_usuario": 1,
    "usuario": "joao_silva",
    "telefone": "11999999999",
    "cidade": "Rio de Janeiro"
  }
}
```

**Erros**:

- `401`: Não autenticado
- `403`: Tentando atualizar outro usuário

---

## Artistas

### GET `/artistas`

**Descrição**: Listar todos os artistas

**Acesso**: Público

**Query Params**:

- `genero` (optional): Filtrar por gênero musical
- `local` (optional): Filtrar por cidade

**Exemplo**:

```
GET /artistas?genero=Rock&local=São Paulo
```

**Resposta (200)**:

```json
{
  "data": [
    {
      "id_usuario": 1,
      "usuario": "joao_silva",
      "tipo_usuario": "artista",
      "genero_musical": "Rock",
      "cidade": "São Paulo",
      "descricao": "Guitarrista profissional",
      "imagem_perfil_url": "https://..."
    }
  ]
}
```

---

### GET `/artistas/:id`

**Descrição**: Obter detalhe de um artista

**Acesso**: Público

**Resposta (200)**:

```json
{
  "data": {
    "id_usuario": 1,
    "usuario": "joao_silva",
    "email": "joao@example.com",
    "tipo_usuario": "artista",
    "genero_musical": "Rock",
    "cidade": "São Paulo",
    "estado": "SP",
    "telefone": "11999999999",
    "descricao": "Guitarrista profissional",
    "imagem_perfil_url": "https://..."
  }
}
```

---

## Propostas

### GET `/propostas/recebidas`

**Descrição**: Obter propostas recebidas (para artistas)

**Acesso**: Autenticado

**Query Params**:

- `id_artista` (required): ID do artista

**Exemplo**:

```
GET /propostas/recebidas?id_artista=1
```

**Resposta (200)**:

```json
{
  "data": [
    {
      "id_proposta": 1,
      "id_contratante": 2,
      "id_artista": 1,
      "titulo": "Show privado",
      "descricao": "Tocador de guitarra para aniversário",
      "local_evento": "Lapa, Rio de Janeiro",
      "data_evento": "2026-02-15",
      "valor_oferecido": 500.0,
      "status": "pendente",
      "created_at": "2026-02-04T10:00:00Z"
    }
  ]
}
```

---

### GET `/propostas/enviadas`

**Descrição**: Obter propostas enviadas (para contratantes)

**Acesso**: Autenticado

**Query Params**:

- `id_contratante` (required): ID do contratante

**Resposta (200)**:

```json
{
  "data": [
    {
      "id_proposta": 1,
      "id_contratante": 2,
      "id_artista": 1,
      "titulo": "Show privado",
      "status": "pendente",
      "valor_oferecido": 500.0,
      "created_at": "2026-02-04T10:00:00Z"
    }
  ]
}
```

---

### GET `/propostas/:id`

**Descrição**: Obter detalhe de uma proposta

**Acesso**: Autenticado

**Resposta (200)**:

```json
{
  "data": {
    "id_proposta": 1,
    "id_contratante": 2,
    "id_artista": 1,
    "titulo": "Show privado",
    "descricao": "Tocador de guitarra para aniversário",
    "local_evento": "Lapa, Rio de Janeiro",
    "data_evento": "2026-02-15",
    "valor_oferecido": 500.0,
    "status": "pendente",
    "mensagem_resposta": null,
    "created_at": "2026-02-04T10:00:00Z",
    "updated_at": "2026-02-04T10:00:00Z"
  }
}
```

---

### POST `/propostas`

**Descrição**: Criar nova proposta

**Acesso**: Autenticado (contratante)

**Body**:

```json
{
  "id_artista": 1,
  "titulo": "Show privado",
  "descricao": "Tocador de guitarra para aniversário",
  "local_evento": "Lapa, Rio de Janeiro",
  "data_evento": "2026-02-15",
  "valor_oferecido": 500.0
}
```

**Resposta (201)**:

```json
{
  "data": {
    "id_proposta": 1,
    "id_contratante": 2,
    "id_artista": 1,
    "titulo": "Show privado",
    "status": "pendente",
    "valor_oferecido": 500.0,
    "created_at": "2026-02-04T10:00:00Z"
  }
}
```

**Erros**:

- `400`: Campo obrigatório faltando
- `401`: Não autenticado

---

### PUT `/propostas/:id/status`

**Descrição**: Aceitar ou recusar uma proposta

**Acesso**: Autenticado (artista)

**Body**:

```json
{
  "status": "aceita",
  "mensagem_resposta": "Ótimo! Vou estar lá!"
}
```

**Status Válidos**:

- `aceita`: Artista aceita a proposta
- `recusada`: Artista recusa a proposta
- `cancelada`: Contratante cancela a proposta

**Resposta (200)**:

```json
{
  "data": {
    "id_proposta": 1,
    "status": "aceita",
    "mensagem_resposta": "Ótimo! Vou estar lá!",
    "updated_at": "2026-02-04T11:00:00Z"
  }
}
```

**Erros**:

- `400`: Status inválido
- `401`: Não autenticado
- `403`: Sem permissão para atualizar essa proposta
- `404`: Proposta não encontrada

---

## Avaliações

### GET `/avaliacoes/usuario/:id`

**Descrição**: Obter avaliações recebidas por um usuário

**Acesso**: Público

**Parâmetros**:

- `id`: ID do usuário avaliado

**Resposta (200)**:

```json
{
  "data": [
    {
      "id_avaliacao": 1,
      "id_avaliador": 2,
      "id_avaliado": 1,
      "nota": 5,
      "comentario": "Excelente profissional!",
      "created_at": "2026-02-04T10:00:00Z"
    }
  ]
}
```

---

### POST `/avaliacoes`

**Descrição**: Criar avaliação para um usuário

**Acesso**: Autenticado

**Body**:

```json
{
  "id_avaliado": 1,
  "nota": 5,
  "comentario": "Excelente profissional!"
}
```

**Validações**:

- `nota`: Deve estar entre 1 e 5
- `comentario`: Máximo 500 caracteres

**Resposta (201)**:

```json
{
  "data": {
    "id_avaliacao": 1,
    "id_avaliador": 2,
    "id_avaliado": 1,
    "nota": 5,
    "comentario": "Excelente profissional!",
    "created_at": "2026-02-04T10:00:00Z"
  }
}
```

**Erros**:

- `400`: Nota fora do intervalo
- `401`: Não autenticado

---

## Códigos de Status HTTP

| Código | Significado                              |
| ------ | ---------------------------------------- |
| `200`  | OK - Requisição bem-sucedida             |
| `201`  | Created - Recurso criado                 |
| `400`  | Bad Request - Dados inválidos            |
| `401`  | Unauthorized - Autenticação necessária   |
| `403`  | Forbidden - Sem permissão                |
| `404`  | Not Found - Recurso não encontrado       |
| `500`  | Internal Server Error - Erro do servidor |

---

## Headers Necessários

### Para Requisições POST/PUT

```
Content-Type: application/json
```

### Para Requisições Autenticadas

```
Cookie: token=<jwt-token>
```

Ou no header Authorization:

```
Authorization: Bearer <jwt-token>
```

---

## Exemplos com Curl

### 1. Registrar Usuário

```bash
curl -X POST http://localhost:3001/api/usuarios/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "joao_silva",
    "email": "joao@example.com",
    "senha": "senha123",
    "tipo_usuario": "artista"
  }' \
  -c cookies.txt
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3001/api/usuarios/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }' \
  -c cookies.txt
```

### 3. Listar Artistas

```bash
curl -X GET "http://localhost:3001/api/artistas?genero=Rock&local=São%20Paulo"
```

### 4. Criar Proposta (Autenticado)

```bash
curl -X POST http://localhost:3001/api/propostas \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id_artista": 1,
    "titulo": "Show privado",
    "descricao": "Tocador de guitarra",
    "local_evento": "São Paulo",
    "data_evento": "2026-02-15",
    "valor_oferecido": 500.00
  }'
```

### 5. Aceitar Proposta (Autenticado)

```bash
curl -X PUT http://localhost:3001/api/propostas/1/status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "aceita",
    "mensagem_resposta": "Ótimo!"
  }'
```

### 6. Fazer Logout

```bash
curl -X POST http://localhost:3001/api/usuarios/auth/logout \
  -b cookies.txt
```
