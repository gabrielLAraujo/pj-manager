#!/bin/bash

# Script para executar migrações do banco de dados em produção
# Execute este script após o primeiro deploy na Vercel

echo "🚀 Executando migrações do banco de dados..."

# Verifica se a variável DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Erro: Variável DATABASE_URL não está definida"
    echo "Configure a variável de ambiente DATABASE_URL com a connection string do seu banco PostgreSQL"
    exit 1
fi

echo "📊 Connection string detectada: ${DATABASE_URL:0:20}..."

# Executa as migrações
echo "🔄 Executando prisma migrate deploy..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrações executadas com sucesso!"
    echo "🎉 Banco de dados configurado e pronto para uso"
else
    echo "❌ Erro ao executar migrações"
    exit 1
fi

echo "📋 Para verificar o banco, execute: npx prisma studio" 