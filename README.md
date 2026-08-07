# Coffee & Code - Portal de Estudos ☕💻

Um portal acadêmico premium projetado para facilitar a vida do estudante modernizando a visualização de grades, materiais e prazos em um "Console Unificado" fluido e responsivo.

## ✨ Funcionalidades

- **Console do Aluno**: Interface de página única (SPA) para acesso rápido.
- **Grade Horária Inteligente**: Visualização em tempo real da aula atual e próximas sessões.
- **Central de Materiais**: Organização por matéria com filtros de busca instantâneos.
- **Painel de Prazos**: Calendário cronológico de provas, trabalhos e projetos.
- **Dashboard Administrativo**: Gestão completa de matérias, professores, aulas e avisos.
- **Foco em UI/UX**: Design premium com suporte total a Light e Dark Mode e Glassmorphism.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [SQLite](https://www.sqlite.org/) (Local) ou [Postgres](https://www.postgresql.org/) (Nuvem) via [Prisma](https://www.prisma.io/)
- **Linguagem**: TypeScript
- **Estilização**: Vanilla CSS com variáveis dinâmicas e Glassmorphism
- **PWA**: Instalável via `next-pwa`

## ⚙️ Configuração (.env)

O projeto depende de um arquivo `.env` na raiz. Use o `.env.example` como base:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="sua_senha_aqui"
```

> [!IMPORTANT]
> O arquivo `dev.db` na raiz contém todo o seu banco de dados SQLite local. **Nunca delete** se quiser manter seus dados.

## 🚀 Como Executar

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Prepare o Banco de Dados**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

3. **Inicie o Modo de Desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse o Portal**:
   - Aluno: `http://localhost:3000`
   - Admin: `http://localhost:3000/admin/login`

## 🔐 Acesso Administrativo

Para acessar o painel de administrador:
- **URL**: `/admin/login`
- **Senha**: Definida no seu arquivo `.env`

## 📁 Estrutura de Pastas Importante

- `/public`: Contém ícones, manifesto PWA e o **favicon oficial**. (Não remover!)
- `/prisma`: Esquema do banco de dados e arquivos de migração.
- `dev.db`: Seu banco de dados local (gerado automaticamente).

---
*Desenvolvido com foco na excelência acadêmica e experiência do usuário.*
