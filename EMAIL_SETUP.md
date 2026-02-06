# Configuração de Email - Gmail

Este guia explica como configurar o envio de emails usando Gmail SMTP no Music Connect.

## Pré-requisitos

- Uma conta do Gmail
- Autenticação de 2 fatores ativada na sua conta Google

## Passo a Passo

### 1. Ativar Autenticação de 2 Fatores

1. Acesse: https://myaccount.google.com/security
2. Na seção "Como fazer login no Google", clique em "Verificação em duas etapas"
3. Siga as instruções para ativar

### 2. Gerar Senha de Aplicativo

1. Acesse: https://myaccount.google.com/apppasswords
2. No campo "Selecionar app", escolha "Outro (nome personalizado)"
3. Digite "Music Connect" como nome
4. Clique em "Gerar"
5. **Copie a senha de 16 dígitos** (sem espaços)

### 3. Configurar Variáveis de Ambiente

No arquivo `.env` do backend:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Senha de aplicativo de 16 dígitos
EMAIL_FROM=Music Connect <seu_email@gmail.com>
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:**

- Use a **senha de aplicativo** (16 dígitos), não sua senha normal do Gmail
- Nunca compartilhe seu arquivo `.env` ou faça commit dele no Git
- Em produção, use variáveis de ambiente do servidor

### 4. Testar

1. Reinicie o backend:

```bash
cd backend
npm run dev
```

2. Você deve ver a mensagem:

```
✅ [EMAIL] Email service is ready
```

3. Teste a recuperação de senha:

```bash
curl -X POST http://localhost:3001/api/usuarios/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"seu_email@gmail.com"}'
```

4. Verifique seu email para o link de recuperação

## Solução de Problemas

### Erro: "Invalid login: 535-5.7.8"

- Você não gerou a senha de aplicativo. Siga o passo 2 acima.
- Ou a autenticação de 2 fatores não está ativada.

### Erro: "Connection timeout"

- Verifique se você está usando a porta 587
- Alguns firewalls podem bloquear SMTP. Tente usar uma rede diferente.

### Email não chega

1. Verifique a pasta de spam
2. Verifique se o email está correto no banco de dados
3. Olhe os logs do backend para erros

### Em desenvolvimento sem email configurado

Se você não configurar EMAIL_USER e EMAIL_PASSWORD:

- O sistema **NÃO enviará emails**
- O token será exibido no **console do backend** para testes
- A resposta da API incluirá o token (apenas em NODE_ENV=development)

## Alternativas ao Gmail

### SendGrid (Recomendado para produção)

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.sua_api_key_aqui
```

### Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=seu_email@outlook.com
EMAIL_PASSWORD=sua_senha
```

### SMTP Genérico

```env
EMAIL_HOST=smtp.seuservidor.com
EMAIL_PORT=587
EMAIL_USER=usuario
EMAIL_PASSWORD=senha
```

## Segurança

- **Nunca** compartilhe sua senha de aplicativo
- Use variáveis de ambiente em produção
- Considere usar um serviço como SendGrid ou AWS SES em produção
- Adicione rate limiting para prevenir abuso da funcionalidade de recuperação

## Email em Produção

Para produção, recomendamos:

1. **SendGrid** - 100 emails/dia grátis
2. **AWS SES** - $0.10 por 1000 emails
3. **Mailgun** - 5000 emails/mês grátis
4. **Postmark** - Melhor deliverability

Configure `NODE_ENV=production` para desabilitar o retorno do token na API.
