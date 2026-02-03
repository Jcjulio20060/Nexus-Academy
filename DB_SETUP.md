# Guia de Configuração do Banco de Dados (PostgreSQL)

Como mudamos para Postgres, seu banco local antigo (SQLite) não será mais usado. Você precisa de uma URL de conexão Postgres (`postgres://...`).

## Opção 1: Vercel Postgres (Na Nuvem - Grátis)
Se for fazer deploy na Vercel:
1.  Vá em [vercel.com](https://vercel.com) -> Storage -> Create Database -> Postgres.
2.  Dê um nome (ex: `nexus-db`).
3.  Após criar, vá em `.env.local` na aba do banco na Vercel.
4.  Copie o valor de `POSTGRES_PRISMA_URL` ou `POSTGRES_URL_NON_POOLING`.
5.  Atualize seu arquivo `.env` local com:
    ```env
    DATABASE_URL="sua_url_longa_aqui"
    ```

## Opção 2: Neon (Alternativa)
1.  Crie conta em [neon.tech](https://neon.tech).
2.  Crie um projeto.
3.  Copie a Connection String.

---

## Após Configurar o .env
Rode os comandos abaixo no terminal para criar as tabelas no novo banco:

1.  **Criar Tabelas**:
    ```bash
    npx prisma db push
    ```

2.  **Popular Dados Iniciais** (Opcional - Senha admin):
    ```bash
    npx prisma db seed
    ```

> [!IMPORTANT]
> **O comando `npm run dev` vai falhar até você colocar uma URL VÁLIDA no `.env`.**
