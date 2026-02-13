# Log de Correcoes de Seguranca

## 2026-02-13

- Corrigido armazenamento de senha em texto puro no cadastro de artista, aplicando hash antes do insert.
  - Arquivo: backend/src/controllers/artistasController.ts
- Corrigido IDOR em usuarios: agora so o proprio usuario pode atualizar ou deletar sua conta.
  - Arquivo: backend/src/controllers/usuariosController.ts
- Corrigido IDOR em artistas: agora so o proprio artista pode atualizar seu perfil.
  - Arquivo: backend/src/controllers/artistasController.ts
- Corrigido IDOR em propostas: listagens por artista/contratante e detalhe por id agora validam o usuario autenticado.
  - Arquivo: backend/src/controllers/propostasController.ts
- Removida exposicao de emails em respostas publicas: listagem de usuarios e feed publico de propostas.
  - Arquivos: backend/src/controllers/usuariosController.ts, backend/src/controllers/propostasController.ts
- Removido fallback hardcoded de JWT e exigida configuracao de JWT_SECRET.
  - Arquivo: backend/src/utils/auth.ts
- Corrigido endpoint de sessao do BFF web para validar JWT via backend.
  - Arquivo: bff-web/src/routes/auth.ts
- Restringido CORS nos BFFs com allowlist via variavel de ambiente.
  - Arquivos: bff-web/src/index.ts, bff-mobile/src/index.ts
- Avaliacoes agora exigem relacao previa com proposta aceita entre avaliador e avaliado.
  - Arquivo: backend/src/controllers/avaliacoesController.ts

## Pendencias

Comportamento atual:

✅ Login permitido sem email verificado
✅ Retorna message: "Email ainda nao verificado" na resposta
✅ Funciona igual em dev e produção
tem 3 opções:

Manter como está (recomendado para UX) — login funciona, frontend avisa o user a verificar email
Bloquear login até verificar email — mais seguro, mas pode frustrar users
Verificação opcional — login permitido, mas algumas features bloqueadas até verificação
