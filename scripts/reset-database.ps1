# Comandos para recriar o banco de dados PostgreSQL

# 1. Parar e remover o container do banco de dados (preserva volumes)
docker-compose stop music-connect-db

# 2. Remover o container
docker-compose rm -f music-connect-db

# 3. Remover o volume do banco (APAGA TODOS OS DADOS!)
docker volume rm music-connect_postgres_data

# 4. Recriar e iniciar o banco com o novo schema
docker-compose up -d music-connect-db

# 5. Aguardar o banco inicializar (15-20 segundos)
Start-Sleep -Seconds 20

# 6. Verificar se as tabelas foram criadas
docker exec music-connect-db psql -U music_user -d music_connect_db -c "\dt"

# 7. Verificar as colunas da tabela usuarios
docker exec music-connect-db psql -U music_user -d music_connect_db -c "\d usuarios"

# 8. Verificar dados de exemplo
docker exec music-connect-db psql -U music_user -d music_connect_db -c "SELECT id_usuario, usuario, email, tipo_usuario FROM usuarios;"
