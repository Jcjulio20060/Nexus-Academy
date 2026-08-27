# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Students** (primary): University/college CS students. Identify by name + registration. Check the portal on phone (PWA) or laptop between classes. Short, distracted sessions — need quick answers about schedule, deadlines, and tickets.
- **Admins** (secondary): Department staff managing subjects, professors, schedules, events, notices, FAQ, representatives. Password-protected dashboard.
- **Representatives** (secondary): Class reps and vice-reps who reply to student support tickets. Own credentials.

## Product Purpose

A unified student console replacing scattered WhatsApp groups, PDFs, and spreadsheets with a single installable web app. Students see schedule, materials, deadlines, notices in one place; justify absences and open support tickets without leaving the portal. Admins manage all content through a protected dashboard. Exists to reduce friction in daily academic workflows.

## Positioning

Reusable across classes and departments — any school or cohort can deploy their own instance. Not a monolithic LMS; a lightweight, opinionated console for the specific workflows a small academic class actually needs.

## Operating Context

- Students check multiple times/day, primarily on mobile (PWA), secondarily desktop.
- Console designed for glance-and-go: current class, upcoming, deadlines visible without scrolling.
- Admins in longer desktop sessions managing content via CRUD forms.
- Representatives reply to tickets on mobile and desktop.
- Vercel (serverless) + PostgreSQL; local dev uses SQLite.
- Push notifications and Telegram integration for out-of-app updates.
- Portuguese (pt-BR) only.

## Capabilities and Constraints

- **Student Console**: SPA-like interface — home, schedule grid, materials, deadlines, tickets, absences, FAQ.
- **Schedule Engine**: Real-time class tracking with progress bar and countdown.
- **Student Identity**: Client-side (localStorage), no full auth.
- **Admin Dashboard**: JWT-protected CRUD for all entities.
- **Representative Access**: Login to reply to tickets.
- **Ticket System**: Category, message, optional attachment; threaded replies.
- **Absence Justification**: Subject, date, reason, attachment; admin approve/reject.
- **Push Notifications**: Browser push (web-push) + Telegram webhook.
- **PWA**: Installable, service worker, offline shell.
- **Theme**: Dark (default) + light, manual toggle, system fallback. Coffee/caramel/terminal palette, glassmorphism.
- **File Uploads**: Vercel Blob for attachments.
- **Undecided**: Multi-language, student auth beyond client-side, grading integration.

## Brand Commitments

- **Name**: "Coffee & Code" is the brand; "Nexus Academy" is codename.
- **Aesthetic**: Café + code on paper — light paper palette (caramel/teal, warm neutrals), flat surfaces with hairlines, the "comanda" card as the signature. Binding.
- **Typography**: Instrument Sans (body), Fraunces (display), JetBrains Mono (mono). Binding.
- **Voice**: Warm, casual, peer-to-peer. pt-BR.
- **Personality**: Premium but approachable. Console metaphor (terminal, status bar, rail) is part of identity.

## Evidence on Hand

- Working codebase: Next.js 16, Prisma, PostgreSQL.
- Visual system in `globals.css` with CSS custom properties, glassmorphism, responsive layout.
- Components: ConsoleShell, TabBar, Card, Button, Badge, Modal, SectionHeader, PageTitle, Icon, BrandLogo.
- Seed data with sample content.
- Deployment guide (Vercel + Postgres).
- No DESIGN.md — visual system lives only in code.

## Product Principles

1. **Glance-first**: Most important info visible within 2 seconds.
2. **One task per screen**: Each section does one thing well.
3. **Mobile is primary**: Design for phone between lectures.
4. **Zero onboarding**: Interface teaches itself.
5. **Reusable by default**: No hardcoded assumptions — works for any class.

## Accessibility & Inclusion

WCAG 2.1 AA minimum: contrast ratios, keyboard navigation, heading hierarchy, focus management, screen reader support for dynamic content.
