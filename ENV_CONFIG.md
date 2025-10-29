# Configuração de Variáveis de Ambiente

Este projeto usa variáveis de ambiente para configurar os apontamentos da API e outras configurações.

## Como Configurar

1. **Copie o arquivo de exemplo:**

   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env` com suas configurações:**
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_API_TIMEOUT=10000
   VITE_NODE_ENV=development
   VITE_DEBUG_MODE=true
   ```

## Variáveis Disponíveis

### VITE_API_BASE_URL

- **Descrição:** URL base da API
- **Padrão:** `http://localhost:3000`
- **Exemplo:** `https://api.minhaapp.com`

### VITE_API_TIMEOUT

- **Descrição:** Timeout das requisições em milissegundos
- **Padrão:** `10000` (10 segundos)
- **Exemplo:** `5000`

### VITE_NODE_ENV

- **Descrição:** Ambiente de execução e controle do MSW
- **Valores:**
  - `development` - desenvolvimento com API real
  - `nodata` - desenvolvimento com dados mockados (MSW ativo)
  - `production` - produção
- **Padrão:** `development`
- **MSW:** Só funciona quando valor é `nodata`

### VITE_DEBUG_MODE

- **Descrição:** Habilita logs de debug no console
- **Valores:** `true`, `false`
- **Padrão:** `true`

## Como Usar no Código

```typescript
// Importar as configurações
import { API_CONFIG, API_ENDPOINTS, ENV_CONFIG } from "@/config/api";

// Usar a URL base
const response = await fetch(buildApiUrl(API_ENDPOINTS.notes));

// Verificar ambiente
if (ENV_CONFIG.isDevelopment) {
  console.log("Executando em desenvolvimento");
}
```

## Arquivos Importantes

- **`.env`** - Suas configurações locais (não versionado)
- **`.env.example`** - Exemplo de configuração (versionado)
- **`src/config/api.ts`** - Configurações centralizadas da API
- **`src/types/api.ts`** - Tipos TypeScript para as configurações

## Observações Importantes

⚠️ **IMPORTANTE:** No Vite, apenas variáveis que começam com `VITE_` são expostas ao frontend.

⚠️ **SEGURANÇA:** Nunca coloque informações sensíveis (senhas, tokens) em variáveis `VITE_*` pois elas ficam visíveis no bundle final.

## Diferentes Ambientes

Você pode criar arquivos específicos para cada ambiente:

- **`.env.development`** - Apenas para desenvolvimento
- **`.env.production`** - Apenas para produção
- **`.env.local`** - Configurações locais (sempre carregado)

A precedência é: `.env.local` > `.env.[NODE_ENV]` > `.env`
