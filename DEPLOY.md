# Deploy no Vercel - Take Note App

## Configurações Necessárias

### 1. Arquivo vercel.json

O arquivo `vercel.json` na raiz do projeto configura o roteamento para SPA:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Variáveis de Ambiente no Vercel

Configure as seguintes variáveis no painel do Vercel:

- `VITE_API_BASE_URL` - URL da sua API backend
- `VITE_NODE_ENV` - `production`
- `VITE_DEBUG_MODE` - `false`
- `VITE_API_TIMEOUT` - `10000`

### 3. Build Settings

- **Framework Preset:** Vite
- **Build Command:** `npm run build` ou `pnpm build`
- **Output Directory:** `dist`
- **Install Command:** `npm install` ou `pnpm install`

### 4. Comandos de Deploy

```bash
# Instalar Vercel CLI (se necessário)
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

## Troubleshooting

### Problema: 404 em rotas internas

- **Causa:** Vercel não encontra arquivos físicos para rotas SPA
- **Solução:** `vercel.json` com rewrites (já configurado)

### Problema: Variáveis de ambiente não funcionam

- **Causa:** Variáveis não começam com `VITE_`
- **Solução:** Todas as variáveis devem ter prefixo `VITE_`

### Problema: API não funciona em produção

- **Causa:** `VITE_API_BASE_URL` apontando para localhost
- **Solução:** Configurar URL correta da API em produção
