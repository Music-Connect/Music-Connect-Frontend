# PostgreSQL com Docker

Guia objetivo para novos desenvolvedores configurarem o banco local com Docker.

## Requisitos

- Docker Desktop instalado e em execução
- Porta 5432 livre para PostgreSQL
- Porta 5050 livre para pgAdmin

## Arquivos envolvidos

- docker-compose.yml
- scripts/init.sql
- backend/.env

## Variáveis de ambiente (backend/.env)

Confira se o arquivo backend/.env contém as credenciais corretas:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=music_user
DB_PASSWORD=postgres
DB_NAME=music_connect_db
```

Se você alterar as credenciais aqui, também precisa atualizar o docker-compose.yml.

## Como iniciar o banco

```
docker-compose up -d
```

Isso cria o container do PostgreSQL e o pgAdmin. O arquivo scripts/init.sql será executado automaticamente.

## Como resetar o banco

Use quando precisar recriar o banco do zero:

```
docker-compose down -v
docker-compose up -d
```

## Como acessar o banco

### pgAdmin (interface web)

- URL: http://localhost:5050
- Email: admin@musicconnect.com
- Password: admin123

### psql (CLI)

```
docker exec -it music-connect-db psql -U music_user -d music_connect_db
```

Comandos úteis no psql:

```
\dt
SELECT 1;
\q
```

## Ver logs do PostgreSQL

```
docker-compose logs -f postgres
```

## Observações importantes

- O scripts/init.sql está vazio para criação das tabelas passo a passo.
- Se você alterar qualquer senha, recrie o container com down -v.
- Se receber erro de autenticação, confirme credenciais no backend/.env e no docker-compose.yml.

## Próximos passos (desenvolvimento)

- Criar tabelas no scripts/init.sql conforme o avanço do projeto.
- Adicionar seeds somente quando necessário.
