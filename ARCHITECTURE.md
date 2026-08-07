# Arquitetura Técnica - Nexus Academy

Este documento detalha as decisões de design e a estrutura técnica do projeto Nexus Academy.

## 🏛️ Estrutura do Projeto (App Router)

O projeto utiliza a estrutura `src/app` do Next.js 14:

- `/app/page.tsx`: Servidor (RSC) que busca dados iniciais.
- `/app/HomeClient.tsx`: O "Cérebro" do Console do Aluno, gerenciando abas e estado de UI.
- `/app/admin/*`: Rotas protegidas para gerenciamento de dados.
- `/components/*`: Componentes reutilizáveis (Modais, Listas, Cards).
- `/api/*`: Endpoints REST para operações CRUD.

## 🛢️ Modelo de Dados (Prisma)

Utilizamos um esquema relacional para garantir consistência:

- **Subject**: Matérias (Código e Nome).
- **Professor**: Dados dos docentes.
- **ClassSession**: Relaciona Matéria, Professor, Dia, Horário e Sala.
- **Resource**: Materiais ligados a Matérias.
- **AcademicEvent**: Datas de provas, trabalhos e projetos.
- **Notice**: Avisos rápidos com data de criação.

> [!NOTE]
> O projeto foi migrado de um sistema baseado em JSON para um banco de dados relacional (SQLite/Prisma), garantindo maior robustez e performance.

## 🎨 Sistema de Temas (Dynamic UI)

A aplicação utiliza um sistema de variáveis CSS em `globals.css`:
- **Light Mode @media (prefers-color-scheme: light)**: Contraste otimizado para dias claros.
- **Dark Mode (Default)**: Visual premium dark com tons de Indigo e Rose.
- **Glassmorphism**: Uso extensivo de filtros de desfoque (`backdrop-filter`) e camadas semitransparentes.

## 🛡️ Segurança e Middleware

O arquivo `middleware.ts` intercepta requisições para `/admin/*`:
- Verifica a existência do cookie `admin_session`.
- Redireciona usuários não autenticados para `/admin/login`.
- Impede acesso à tela de login caso o usuário já esteja autenticado.

## ⚡ Performance

- **ISR (Incremental Static Regeneration)**: Configurado na Home para atualização frequente dos dados de horário.
- **Client-side Filtering**: Filtro de materiais processado no cliente para resposta instantânea.
