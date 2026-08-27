---
name: Coffee & Code
description: A light, paper-based student console where coffee culture meets code craft
colors:
  primary: "#ab4c05"
  primary-strong: "#d9801f"
  secondary: "#0f766e"
  background: "#f6f1e8"
  foreground: "#241c14"
  foreground-muted: "#6b5c4b"
  surface: "#fffdf8"
  surface-card: "#ffffff"
  surface-border: "rgba(36, 28, 20, 0.1)"
  success: "#3a7d4f"
  warning: "#c8891a"
  error: "#c73e32"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontWeight: 500
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Instrument Sans, Inter, sans-serif"
    fontWeight: 400
    fontSize: "0.95rem"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontWeight: 600
    fontSize: "0.72rem"
    letterSpacing: "0.1em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
  xl: "18px"
  full: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  "2xl": "2.5rem"
  greeting: "clamp(2.4rem, 6vw, 3.3rem)"
components:
  button-primary:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.4rem"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.4rem"
  button-danger:
    backgroundColor: "color-mix(srgb, var(--error) 13%, transparent)"
    textColor: "{colors.error}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.4rem"
---

# Design System: Coffee & Code — "Manhã de Café"

## Overview

**Creative North Star: "The Paper Console"**

Coffee & Code agora é um console de aluno que parece uma comanda de café rabiscada em papel claro: fundo creme quente, cartões cor de papel com hairline, serifa de cardápio nos títulos e mono do terminal nos dados, tudo ainda governado pela metáfora de console (`// section`, status bar, rail, tab bar). O vidro pesado saiu; entrou material de papel — superfícies planas, sombras mínimas, divisórias finas. A mesma alma (café + código), agora leve e arejado.

- **Claro é a identidade.** O tema claro (`:root`) é o padrão e a cara do app. O toggle continua e o tema escuro ("Noite") é a mesma voz em carbonizado quente e plano — sem vidro.
- **Papel, não vidro.** Semi-transparência, blur e dot-grid saíram. `backdrop-filter` só existe em overlays (modal, paleta).
- **A comanda é a assinatura.** O card "agora" é o elemento único memorável; tudo ao redor fica quieto.
- **Serifa nos títulos, mono nos dados.** Fraunces dá personalidade de cardápio; Instrument Sans trabalha a UI; JetBrains Mono organiza horários, labels e números.

## Colors

Paleta clara ancorada em caramelo (café) e teal-petróleo (código). Neutros são quentes — nunca branco puro nem preto puro.

### Light identity (`:root`)

- **Papel** `#f6f1e8` — fundo da página.
- **Tinta** `#241c14` — texto principal (espresso).
- **Tinta suave** `#6b5c4b` — texto secundário, labels (≥6:1 sobre o papel).
- **Caramelo** `#ab4c05` — acentos, `//`, horários.
- **Caramelo forte** `#d9801f` — botões primários (tinta `#20180f` sobre ele).
- **Teal** `#0f766e` — `ao vivo`, indicadores de status.
- **Cartão** `#fffdf8` — superfícies com hairline `rgba(36,28,20,0.1)`.
- Status: success `#3a7d4f` · warning `#c8891a` (ink `#7a4f08`) · error `#c73e32`.

### Noite (`data-theme='dark'`)

Mesma estrutura em carbonizado quente: fundo `#1a1610`, tinta `#f2ead9`, tinta suave `#a5937c`, caramelo `#f0a644`, teal `#34cfc0`, cartão `#241e15`. Ainda flat — sem blur, sem vidro.

### Named Rules

**The Warmth Rule.** Nenhum neutro é acromático. Papel, tinta e hairlines carregam calor; nunca branco puro nem preto puro como superfície de texto.

**The Two-Accent Ceiling.** Caramelo e teal são os únicos acentos decorativos. Verde, âmbar e vermelho aparecem só em contexto semântico.

## Typography

- **Display:** Fraunces (serifa, peso ~500) — títulos de página e nome da matéria. É a voz de cardápio que diferencia o app.
- **Body:** Instrument Sans — UI e parágrafos.
- **Mono:** JetBrains Mono — labels `//`, horários, dados, badges.

### Hierarchy

- **Greeting** (Fraunces 500, `clamp(2.4rem, 6vw, 3.3rem)`, 1.04, tight): saudação na home.
- **Display** (500, `clamp(1.9rem, 4vw, 2.5rem)`): título da página.
- **Headline** (500, 2rem): matéria em destaque, seções.
- **Body** (400, 0.95rem, 1.5): corpo.
- **Label/Mono** (600, 0.72rem, 0.1em, uppercase): `// LABEL`, horários, badges, dados. Sempre mono, sempre com espaçamento.

### Named Rules

**The Comment Prefix Rule.** Todo header de seção usa `// LABEL` com `//` em caramelo. É a assinatura do console — nunca remover.

**The Tabular Numerals Rule.** Horários, contagens e números usam `.mono` (tabular-nums) para alinhar colunas.

## Layout

Shell de console de papel: status bar (56px) + rail desktop (64px) ou tab bar mobile, main centrado a 760–920px.

- **Spacing:** seções a cada 2.5rem; mais espaço acima do heading do que abaixo.
- **Listas = menu:** listas de aulas, prazos e próximos usam o motivo "menu/comanda" — cartão único com divisórias em hairline, sem lacunas entre itens.
- **A comanda** é o card "agora": cabeçalho com horário + `ao vivo` (dot teal pulsante à direita), nome da matéria em Fraunces grande, chips de metadados, uma régua tracejada (como um slip de pedido) e uma linha de progresso com contagem `restante · Xmin`.

## Elevation & Depth

Papel plano. Sombras mínimas (1px sutil de repouso) e hover leve (+1px). Overlays (modal, paleta) usam backdrop blur 3px sobre um véu `rgba(36,28,20,0.45)` — a única exceção ao flat.

## Shapes

- Interativos (botões, inputs): 12px.
- Contêineres/cartões: 18px.
- Chips: 12px.
- Badges: pill (999px).
- O card "agora": 18px.

## Components

### Comanda (CurrentClass) — signature

- Painel de papel com hairline e sombra sutil.
- Linha de topo: `13:10 – 14:50` (mono, muted) + dot teal pulsante + `AO VIVO` (mono uppercase).
- Nome da matéria em Fraunces 2.5rem.
- Chips: `sala`, `professor`, `período` (teal).
- Régua tracejada (dashed hairline).
- Progresso (gradiente teal→caramelo) + `restante · 42min` em caramelo.
- Vazio: ícone café em success-glow + "Livre agora" em success.

### Menus (listas de grade, próximos, prazos)

Painel único com itens separados por `.hairline-row` (1px hairline na base, sem borda no último). Horário à esquerda em mono caramelo; título com peso 600; metadados em tinta suave.

### Buttons / Badges / Inputs / Modal

- **Primary:** caramelo forte `#d9801f`, tinta `#20180f`.
- **Ghost:** papel com hairline.
- **Danger:** error-glow com texto error.
- **Badge:** pill, mono uppercase, fundo glow da própria cor; warning-ink legível no pill.
- **Inputs:** papel, hairline, foco com borda caramelo.
- **Modal/Paleta:** véu escuro + blur 3px, painel `--surface`.

## Do's and Don'ts

### Do:
- **Do** usar o `//` em todo header de seção (assinatura).
- **Do** tratar listas como menu: um painel com hairlines, não pilhas de garrafas.
- **Do** usar Fraunces para títulos e JetBrains para dados.
- **Do** manter o caramelo-teal como únicos acentos.
- **Do** deixar a comanda ser a única peça memorável; o resto quieto.

### Don't:
- **Don't** usar glassmorphism em superfícies (só overlays de focus).
- **Don't** usar branco puro ou preto puro como neutro.
- **Don't** usar Fraunces em parágrafos longos nem Inter/Sans em labels mono.
- **Don't** adicionar terceiro acento.
- **Don't** usar cabeçalhos numerados 01/02/03 — não é uma sequência.
