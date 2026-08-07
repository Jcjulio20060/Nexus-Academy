# Guia de Deploy - Nexus Academy 🚀

Para colocar o seu projeto no ar da forma mais profissional e eficiente, recomendo utilizar o ecossistema da **Vercel** e o **GitHub**.

## 🛠️ Ferramentas Recomendadas

1.  **Hospedagem (Frontend + API)**: [Vercel](https://vercel.com/)
    *   **Por que?** É a "casa" do Next.js. Oferece deploy automático, SSL grátis, excelente performance e integração com o GitHub.
2.  **Banco de Dados (Produção)**: [Vercel Postgres](https://vercel.com/storage/postgres) ou [Neon](https://neon.tech/)
    *   **Por que?** Como o Next.js na Vercel é *Serverless*, você não pode usar o arquivo `dev.db` (SQLite) no servidor pois ele seria "apagado" a cada atualização. Você precisa de um banco gerenciado.
3.  **Controle de Versão**: [GitHub](https://github.com/)
    *   **Por que?** Para manter o código seguro e permitir que a Vercel atualize o site toda vez que você der um `git push`.

---

## 📋 Passo a Passo para o Deploy

### 1. Preparar o GitHub
- Inicie um repositório git: `git init`
- Adicione os arquivos: `git add .`
- Faça o commit: `git commit -m "feat: nexus academy final version"`
- Crie um repositório no GitHub e siga as instruções para subir: `git push -u origin main`

### 2. Configurar o Banco de Dados (Postgres)
No arquivo `prisma/schema.prisma`, você precisará alterar o provider de `sqlite` para `postgresql` quando for para produção:

```prisma
// Local (SQLite)
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Produção (Postgres)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Conectar na Vercel
1.  Acesse o dashboard da Vercel e importe o seu repositório do GitHub.
2.  **Variáveis de Ambiente**: Adicione as chaves que estão no seu `.env`:
    *   `DATABASE_URL`: (A URL que você pegará no Vercel Postgres ou Neon).
    *   `ADMIN_PASSWORD`: (Sua senha de administrador).
3.  **Deploy**: Clique em "Deploy".

### 4. Rodar Migrações
Após o deploy, você precisará sincronizar as tabelas com o banco de produção. No dashboard da Vercel (ou localmente apontando para a URL de produção), rode:
```bash
npx prisma db push
```

---

##  alternativas (All-in-One)

Se você preferir algo mais "tradicional" onde o SQLite funcione:
- **[Railway.app](https://railway.app/)**: Permite rodar o Next.js com um volume persistente, mas o custo inicial pode ser maior que o plano grátis da Vercel.

**Minha Recomendação Final**: Vá de **Vercel + Vercel Postgres**. É a stack mais moderna, escalável e (na maioria dos casos) totalmente gratuita para projetos iniciantes.
