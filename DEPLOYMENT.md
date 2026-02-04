# Guia de Deployment

Instruções para fazer deploy da Music Connect em produção.

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 15 instalado
- npm ou yarn
- Acesso SSH ao servidor (ou plataforma de hosting)
- Domínio configurado (opcional)
- Certificado SSL/TLS (obrigatório em produção)

---

## Deploy em Servidor Linux

### 1. Preparar o Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar Nginx (como reverse proxy)
sudo apt install -y nginx

# Instalar PM2 (gerenciador de processos)
sudo npm install -g pm2
```

### 2. Configurar PostgreSQL

```bash
# Conectar ao PostgreSQL
sudo su - postgres
psql

# Criar banco e usuário
CREATE DATABASE music_connect_db;
CREATE USER music_user WITH PASSWORD 'senha_segura_aqui';
ALTER ROLE music_user SET client_encoding TO 'utf8';
ALTER ROLE music_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE music_user SET default_transaction_deferrable TO on;
ALTER ROLE music_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE music_connect_db TO music_user;

# Sair
\q
exit
```

### 3. Clonar Repositório

```bash
cd /home/usuario
git clone <seu-repositorio> music-connect
cd music-connect

# Ou se usar arquivo .zip
unzip music-connect.zip
cd music-connect
```

### 4. Executar Migração do Banco

```bash
# Conectar como music_user
psql -U music_user -d music_connect_db -h localhost

# Executar SQL
\i scripts/init.sql

# Sair
\q
```

### 5. Instalar Dependências e Build

```bash
# Backend
cd backend
npm install
npm run build  # Se houver script de build

# BFF Mobile
cd ../bff-mobile
npm install

# BFF Web
cd ../bff-web
npm install

# Frontend Web
cd ../frontend-web/frontend-web
npm install
npm run build  # Next.js gera arquivos otimizados

cd ../../..
```

### 6. Configurar Variáveis de Ambiente

```bash
# Backend
cd backend
cat > .env << EOF
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_USER=music_user
DB_PASSWORD=senha_segura_aqui
DB_NAME=music_connect_db
JWT_SECRET=gerar_uma_chave_aleatoria_segura_aqui
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com
EOF

# Restringir permissões
chmod 600 .env

# BFF Mobile
cd ../bff-mobile
cat > .env << EOF
PORT=3002
NODE_ENV=production
BACKEND_URL=http://localhost:3001
EOF
chmod 600 .env

# BFF Web
cd ../bff-web
cat > .env << EOF
PORT=3003
NODE_ENV=production
BACKEND_URL=http://localhost:3001
EOF
chmod 600 .env

# Frontend Web
cd ../frontend-web/frontend-web
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://seu-dominio.com/api
EOF
chmod 600 .env.local

cd ../../..
```

### 7. Configurar Nginx

```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/music-connect

# Adicionar conteúdo:
```

```nginx
# Upstream servers
upstream backend {
  server 127.0.0.1:3001;
}

upstream bff_mobile {
  server 127.0.0.1:3002;
}

upstream bff_web {
  server 127.0.0.1:3003;
}

upstream frontend {
  server 127.0.0.1:3000;
}

# HTTP to HTTPS redirect
server {
  listen 80;
  server_name seu-dominio.com www.seu-dominio.com;
  return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
  listen 443 ssl http2;
  server_name seu-dominio.com www.seu-dominio.com;

  # SSL Certificate (Let's Encrypt)
  ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

  # SSL Configuration
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # Compression
  gzip on;
  gzip_types text/plain text/css text/javascript application/json;

  # Root location -> Frontend
  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # API Backend
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # BFF Mobile
  location /bff-mobile {
    proxy_pass http://bff_mobile;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
  }

  # BFF Web
  location /bff-web {
    proxy_pass http://bff_web;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
  }
}
```

```bash
# Ativar configuração
sudo ln -s /etc/nginx/sites-available/music-connect /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reinicar Nginx
sudo systemctl restart nginx
```

### 8. Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 9. Iniciar Aplicações com PM2

```bash
# Backend
cd /home/usuario/music-connect/backend
pm2 start "npm run dev" --name "backend" --env production

# BFF Mobile
cd /home/usuario/music-connect/bff-mobile
pm2 start "npm run dev" --name "bff-mobile" --env production

# BFF Web
cd /home/usuario/music-connect/bff-web
pm2 start "npm run dev" --name "bff-web" --env production

# Frontend Web (Next.js)
cd /home/usuario/music-connect/frontend-web/frontend-web
pm2 start "npm run start" --name "frontend" --env production

# Salvar configuração
pm2 save

# Ativar startup
pm2 startup
```

### 10. Monitorar Aplicações

```bash
# Ver logs em tempo real
pm2 logs backend

# Ver status
pm2 status

# Reiniciar após erro
pm2 restart all

# Parar aplicações
pm2 stop all

# Dashboard
pm2 web  # Acesso em http://localhost:9615
```

---

## Segurança em Produção

### 1. Senhas Fortes

```bash
# Gerar JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Gerar senha PostgreSQL segura (use gerenciador de senhas)
```

### 2. Firewall

```bash
# UFW (Ubuntu Firewall)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 3. Backup do Banco de Dados

```bash
# Criar backup
pg_dump -U music_user music_connect_db > backup_$(date +%Y%m%d).sql

# Restaurar de backup
psql -U music_user music_connect_db < backup_20260204.sql

# Backup automático (cron)
# Adicionar ao crontab: crontab -e
0 2 * * * pg_dump -U music_user music_connect_db > /backups/backup_$(date +\%Y\%m\%d).sql
```

### 4. Monitoramento

```bash
# Instalar ferramentas de monitoramento
sudo apt install -y htop iotop nethogs

# Ver uso de CPU/Memória
pm2 monit

# Alertas com PM2
pm2 install pm2-auto-restart
```

---

## Deploy em Plataformas Gerenciadas

### Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create music-connect

# Configurar variáveis
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<gerar-seguro>
heroku config:set CORS_ORIGIN=https://music-connect.herokuapp.com

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

### Vercel (Frontend)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy Frontend
cd frontend-web/frontend-web
vercel --env-file .env.local
```

### AWS EC2

1. Lançar instância Ubuntu 22.04
2. Conectar via SSH
3. Seguir passos 1-10 do Deploy em Servidor Linux
4. Usar Elastic IP para IP estático
5. Configurar RDS para PostgreSQL gerenciado

---

## Variáveis de Ambiente em Produção

```env
# Backend Production
NODE_ENV=production
PORT=3001
DB_HOST=db.seu-dominio.com
DB_PORT=5432
DB_USER=music_user
DB_PASSWORD=<senha-super-segura>
DB_NAME=music_connect_db
JWT_SECRET=<chave-aleatoria-32-bytes>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com

# Frontend Production
NEXT_PUBLIC_API_URL=https://seu-dominio.com/api
NODE_ENV=production
```

---

## Atualizações

```bash
# Pullar código atualizado
cd /home/usuario/music-connect
git pull origin main

# Reinstalar dependências se necessário
cd backend && npm install
cd ../bff-mobile && npm install
cd ../bff-web && npm install
cd ../frontend-web/frontend-web && npm install

# Reiniciar aplicações
pm2 restart all

# Verificar status
pm2 status
```

---

## Health Check

```bash
# Endpoint de saúde
curl https://seu-dominio.com/health

# Resposta esperada
{
  "status": "Backend is running"
}
```

---

## Troubleshooting

| Problema                 | Solução                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------ |
| CORS error               | Verificar `CORS_ORIGIN` no `.env`                                                    |
| 502 Bad Gateway          | Verificar se backend está rodando: `pm2 status`                                      |
| Certificado SSL expirado | Renovar: `sudo certbot renew --force-renewal`                                        |
| Sem conexão PostgreSQL   | Verificar credenciais e porta: `psql -h localhost -U music_user -d music_connect_db` |
| Memória insuficiente     | Aumentar swap ou recursos da instância                                               |
| Logs vazios              | Verificar permissões: `pm2 logs backend`                                             |

---

## Performance

### Otimizações Recomendadas

1. **Ativar Compression no Nginx** ✅ (já no exemplo)
2. **Cache de Estatísticos**

   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
     expires 30d;
   }
   ```

3. **Rate Limiting**

   ```nginx
   limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
   location /api {
     limit_req zone=api burst=20;
   }
   ```

4. **Database Connection Pool** (backend)
   ```typescript
   const pool = new Pool({
     max: 20,
     min: 5,
     idle: 10000,
   });
   ```

---

## Monitoramento Contínuo

```bash
# Dashboard PM2
pm2 web
# Acesso: http://seu-servidor:9615

# Logs estruturados
pm2 logs backend --err

# Alertas automáticos
pm2 install pm2-logrotate
pm2 install pm2-email
```

---

## Checklist de Deployment

- [ ] Variáveis de ambiente configuradas
- [ ] PostgreSQL inicializado com dados
- [ ] Certificado SSL válido
- [ ] Firewall configurado
- [ ] PM2 configurado para auto-start
- [ ] Backups automáticos configurados
- [ ] Nginx testado e rodando
- [ ] Monitoramento ativado
- [ ] Logs sendo rotacionados
- [ ] Health check passando
