# Minimal Auth Flow — Guia de configuração

Autenticador web com **login social (Google + GitHub)**. Frontend em React +
Vite, backend/API em **Convex** (hospedável junto do frontend no **Cloudflare
Pages**).

---

## 1. Rodar no VS Code

Pré-requisitos: [Node.js 18+](https://nodejs.org) e [Bun](https://bun.sh).

```bash
bun install          # instalar dependências
bunx convex dev      # conecta/cria o backend Convex (pede login na 1ª vez)
bun run dev          # inicia o frontend em http://localhost:5173
```

> O `bunx convex dev` pede login na primeira execução. Alternativa sem login:
> crie um projeto em [dashboard.convex.dev](https://dashboard.convex.dev) e
> rode `bunx convex deploy --cmd 'bun run build'` seguindo o assistente.

O arquivo `.env.local` precisa conter (o Convex cria isso para você no `dev`):

```
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=https://<seu-deploy>.convex.cloud
```

---

## 2. Credenciais do Google

1. Acesse o [Google Cloud Console → Credenciais](https://console.cloud.google.com/apis/credentials).
2. Crie um projeto (ou use um existente) → **Criar credenciais → ID do cliente OAuth**.
3. Tipo de aplicativo: **Aplicativo da Web**.
4. Em **URIs de redirecionamento autorizados**, adicione:
   - Desenvolvimento: `https://SEU-DEPLOY.convex.site/api/auth/callback/google`
   - Produção: pode usar a mesma URI dev; o callback é sempre no domínio do
     Convex e não muda com a hospedagem do frontend

   > O callback é sempre no domínio do **Convex** (quem troca o código OAuth é
   > o backend), não no domínio do frontend. Descubra o seu com:
   > `bunx convex env list` (variável `SITE_URL` atual = domínio `convex.site`)
   > ou pela saída do `bunx convex dev`.
5. **Tela de consentimento OAuth** (importante): apps recém-criados ficam em
   modo **Testes**. Nesse modo o Google bloqueia com "Error 403: Access
   blocked" qualquer conta que não esteja em *Usuários de teste*. Adicione o
   e-mail Gmail que você usa para testar (ou publique o app em *In
   production* — para os escopos de perfil básicos não é exigida verificação).
6. Copie o **Client ID** e o **Client Secret**.

> Erro 403 na tela do Google quase sempre é (a) chaves ausentes no deploy
> Convex ou (b) conta fora da lista de usuários de teste.

---

## 3. Credenciais do GitHub

1. Acesse [GitHub → Developer settings → OAuth Apps](https://github.com/settings/developers) → **New OAuth App**.
2. Preencha:
   - **Homepage URL**: a URL do seu app (ex.: `http://localhost:5173`)
   - **Authorization callback URL**: `https://SEU-DEPLOY.convex.site/api/auth/callback/github`
3. Copie o **Client ID** e gere o **Client Secret**.

---

## 4. Salvar as chaves no Convex

As chaves ficam no backend Convex (nunca no frontend). Rode:

```bash
bunx convex env set AUTH_GOOGLE_ID "xxxx.apps.googleusercontent.com"
bunx convex env set AUTH_GOOGLE_SECRET "xxxx"
bunx convex env set AUTH_GITHUB_ID "xxxx"
bunx convex env set AUTH_GITHUB_SECRET "xxxx"
```

> Para produção, repita os comandos com `bunx convex env set --prod ...`
> usando as credenciais criadas com o domínio de produção.

Defina também a **URL do app** (onde a interface roda). É para lá que o
usuário volta depois de autenticar no provedor:

```bash
bunx convex env set SITE_URL "http://localhost:5173"                 # dev
bunx convex env set --prod SITE_URL "https://SEU-APP.com"            # produção
```

> Importante: `SITE_URL` é a URL do **frontend** (Vite/preview), não a do
> Convex. Se apontar para o domínio `convex.site`, o login até conclui, mas o
> usuário cai numa página em branco no final.

Resumo de quem é o quê:

| Variável | Valor | Papel |
| --- | --- | --- |
| Callback nos provedores | `https://SEU-DEPLOY.convex.site/api/auth/callback/{google\|github}` | Recebe o código OAuth (backend) |
| `SITE_URL` | URL do app (ex.: `http://localhost:5173`) | Destino após o login (frontend) |

---

## 5. Deploy no Cloudflare

O app é um site estático (Vite) — o "backend/API" roda no Convex e o frontend
pode ser servido pelo **Cloudflare Pages**.

1. Gere o build:

   ```bash
   bun run build
   ```

2. Instale o Wrangler e faça o deploy:

   ```bash
   bunx wrangler login
   bunx wrangler pages deploy dist --project-name minimal-auth-flow
   ```

   Ou conecte o repositório em
   [dash.cloudflare.com → Workers & Pages](https://dash.cloudflare.com) com:

   - **Build command**: `bun run build`
   - **Output directory**: `dist`
   - **Variável de ambiente**: `VITE_CONVEX_URL` = URL do seu deploy Convex
     (a mesma de produção; obtenha com `bunx convex env list`).

3. Aponte o Convex para o domínio final:

   ```bash
   bunx convex env set --prod SITE_URL "https://minimal-auth-flow.pages.dev"
   ```

4. Os callbacks dos provedores **não mudam** ao migrar de hospedagem: eles
   apontam para o domínio do Convex (`...convex.site/api/auth/callback/...`).
   Apenas garanta que `SITE_URL --prod` aponte para o domínio final do app.

> **Nota sobre "API no Cloudflare"**: nesta versão 1 a API é o Convex
> (endpoints `/api/auth/*` já inclusos). Se mais tarde você quiser mover a API
> para Workers da Cloudflare, os endpoints de auth do Convex podem permanecer
> como estão — o frontend só fala com a `VITE_CONVEX_URL`.

---

## 6. Estrutura de autenticação

| Arquivo | Papel |
| --- | --- |
| `src/convex/auth.ts` | Providers: Google, GitHub, e-mail OTP e anônimo |
| `src/convex/auth.config.ts` | Validação de tokens JWT |
| `src/convex/users.ts` | `currentUser` (usuário autenticado) |
| `src/hooks/use-auth.ts` | Hook `useAuth()` do frontend |
| `src/pages/Auth.tsx` | Tela de login (`/auth`) |
| `src/pages/Dashboard.tsx` | Área autenticada (`/dashboard`) |
| `src/components/RequireAuth.tsx` | Protege rotas privadas |

Fluxo: clicar em **Continuar com Google/GitHub** → consentimento no provedor →
callback em `/api/auth/callback/{provider}` → sessão criada → redirect para
`/dashboard` (ou para a página de origem via `?returnTo=`).
