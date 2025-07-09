# Deploy na Vercel

Este guia explica como fazer o deploy do projeto PJ Manager na Vercel.

## Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Banco de dados PostgreSQL (recomendado: [Neon](https://neon.tech) ou [Supabase](https://supabase.com))
3. Repositório no GitHub

## Configuração do Banco de Dados

### Opção 1: Neon (Recomendado)
1. Acesse [Neon](https://neon.tech) e crie uma conta
2. Crie um novo projeto
3. Copie a connection string fornecida

### Opção 2: Supabase
1. Acesse [Supabase](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a connection string (modo Pooling)

## Deploy na Vercel

### 1. Conectar Repositório
1. Acesse [Vercel](https://vercel.com/dashboard)
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Selecione o repositório do projeto

### 2. Configurar Variáveis de Ambiente
Na seção "Environment Variables", adicione:

```
DATABASE_URL=postgresql://username:password@host:5432/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

**Importante:**
- `DATABASE_URL`: Use a connection string do seu banco PostgreSQL
- `NEXTAUTH_URL`: Substitua pela URL do seu app na Vercel
- `NEXTAUTH_SECRET`: Gere uma chave secura com: `openssl rand -base64 32`

### 3. Configurações de Build
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Install Command**: `npm install && npx prisma generate`

### 4. Deploy
1. Clique em "Deploy"
2. Aguarde o build completar

## Após o Deploy

### 1. Executar Migrações
Após o primeiro deploy, execute as migrações do banco:

```bash
# Clone o repositório localmente se ainda não tiver
git clone <seu-repositorio>
cd pj-manager

# Configure a variável de ambiente
export DATABASE_URL="sua-connection-string-aqui"

# Execute as migrações
npx prisma migrate deploy
```

### 2. Verificar Funcionamento
1. Acesse sua aplicação na URL fornecida pela Vercel
2. Teste o registro/login de usuários
3. Teste a criação de projetos

## Troubleshooting

### Erro de Prisma
Se houver erros relacionados ao Prisma:
1. Verifique se `DATABASE_URL` está correta
2. Execute `npx prisma generate` localmente
3. Faça um novo deploy

### Erro de NextAuth
Se houver erros de autenticação:
1. Verifique se `NEXTAUTH_SECRET` está definida
2. Verifique se `NEXTAUTH_URL` aponta para o domínio correto

### Timeout nas APIs
Se as APIs estão dando timeout:
1. Verifique a configuração `maxDuration` no `vercel.json`
2. Otimize as queries do Prisma se necessário

## Estrutura de Arquivos Importantes

```
pj-manager/
├── vercel.json          # Configuração da Vercel
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── migrations/      # Migrações
├── app/
│   ├── api/            # APIs do Next.js
│   └── ...
└── lib/
    ├── auth.ts         # Configuração NextAuth
    └── db.ts           # Cliente Prisma
```

## Comandos Úteis

```bash
# Gerar novo secret para NextAuth
openssl rand -base64 32

# Reset do banco (desenvolvimento)
npx prisma migrate reset

# Deploy de migrações (produção)
npx prisma migrate deploy

# Visualizar banco
npx prisma studio
``` 