# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the Next.js application for production
- `npm start` - Start production server

### Mastra AI Framework
- `npm run mastra` - Start Mastra development server
- `npm run mastra:build` - Build Mastra configuration

### Database
- Uses Drizzle ORM with SQLite (Turso) database
- Schema located in `db/schema.ts`
- Migrations in `migrations/` directory
- Configuration in `drizzle.config.ts`

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15+ with App Router
- **UI**: React 19, Shadcn UI, Radix UI primitives
- **Styling**: Tailwind CSS v4+
- **Database**: SQLite (Turso) with Drizzle ORM
- **AI**: Mastra.ai framework with OpenAI integration
- **Animations**: GSAP
- **TypeScript**: Strict mode enabled

### Directory Structure
- `app/` - Next.js app router pages and API routes
  - `(auth)/` - Authentication-related pages
  - `(pages)/` - Main application pages
  - `api/` - API endpoints
- `components/` - Reusable React components
  - `ui/` - Shadcn UI components
- `mastra/` - AI agent configuration and workflows
  - `agents/` - AI agent definitions (e.g., Timmy)
  - `tools/` - Custom tools for agents
  - `workflows/` - Workflow definitions
- `db/` - Database schema and configuration
- `lib/` - Utility functions
- `shared/` - Shared types and constants

### Key Components
- **Timmy Agent**: Technical challenge generator AI agent using OpenAI GPT-4o-mini
- **File Processing**: PDF, DOCX, and text extraction utilities for document processing
- **Database Schema**: Users and posts tables with proper relationships
- **Theme System**: Dark/light mode support with next-themes

### Development Patterns
- Functional components with TypeScript interfaces (avoid classes)
- Server components by default, minimize 'use client'
- Mobile-first responsive design with Tailwind CSS
- Descriptive variable names with auxiliary verbs (isLoading, hasError)
- Named exports preferred for components
- Use lowercase with dashes for directory names

### Environment Configuration
- Database credentials in `.env` (Turso connection)
- Example configuration in `.env.example`
- Environment validation in `env.ts`

### Code Style (from .cursorrules)
- TypeScript for all code, prefer interfaces over types
- Avoid enums, use maps instead
- Functional and declarative programming patterns
- Minimize useEffect and useState, favor React Server Components
- Use Suspense with fallbacks for client components