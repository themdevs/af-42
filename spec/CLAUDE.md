# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spec Kit is a Spec-Driven Development framework that helps build high-quality software by flipping the traditional development process. Instead of starting with code, it starts with executable specifications that directly generate working implementations.

## Architecture

This is a Python-based CLI tool (`specify`) with a template-driven approach:

- **CLI Tool**: Built with Python 3.11+, Typer, and Rich for user interaction
- **Templates**: Structured templates in `templates/` for specifications, plans, and tasks
- **Scripts**: Bash automation scripts in `scripts/` for workflow management
- **Memory**: Constitutional guidelines and principles in `memory/`
- **Specs**: Generated project specifications in `specs/` directory

## Key Commands

### Installation & Setup

```bash
# Install the CLI tool
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>

# Initialize in current directory
specify init --here

# With specific AI agent
specify init <PROJECT_NAME> --ai claude|gemini|copilot
```

### Core Development Commands

The framework provides three main slash commands for AI agents:

- `/specify` - Create functional specifications (focus on WHAT and WHY)
- `/plan` - Generate technical implementation plans (define tech stack and HOW)
- `/tasks` - Break down work into actionable task lists

### Script Utilities

```bash
# Common workflow scripts (all in scripts/)
./scripts/create-new-feature.sh        # Create new feature branch and spec
./scripts/setup-plan.sh               # Setup implementation planning
./scripts/check-task-prerequisites.sh # Validate task readiness
./scripts/get-feature-paths.sh        # Get all feature-related paths
```

## Development Workflow

### 1. Specification Phase

- Use `/specify` command with detailed requirements
- Focus on user stories, functional requirements, acceptance criteria
- Avoid mentioning tech stack - describe WHAT you want to build and WHY

### 2. Planning Phase

- Use `/plan` command to define technical approach
- Specify tech stack, architecture, implementation details
- Research rapidly-changing technologies if needed

### 3. Task Breakdown

- Use `/tasks` to create actionable implementation steps
- Break complex features into manageable tasks
- Include testing and validation steps

### 4. Implementation

- Follow generated plan.md in specs/[feature-name]/ directory
- Use generated quickstart.md for setup instructions
- Reference data-model.md and contracts/ for API specifications

## Feature Branch Structure

Feature branches follow pattern: `[0-9]{3}-feature-name`
Each feature creates a specs directory: `specs/[branch-name]/`

### Standard Feature Files

- `spec.md` - Functional specification
- `plan.md` - Technical implementation plan
- `tasks.md` - Actionable task breakdown
- `research.md` - Technology research notes
- `data-model.md` - Data structure definitions
- `quickstart.md` - Setup and run instructions
- `contracts/` - API specifications and contracts

## Constitutional Principles

The project follows constitutional principles defined in `memory/constitution.md`. Key principles include library-first development, CLI interfaces, test-driven development, and integration testing requirements.

## File Structure Patterns

```bash
project/
├── memory/                    # Constitutional guidelines
├── scripts/                   # Automation utilities
├── specs/                     # Generated specifications
│   └── [feature-branch]/     # Per-feature specifications
├── templates/                 # Template files
└── src/                      # Source code (if applicable)
```

## Prerequisites for Users

- Linux/macOS (or WSL2 on Windows)
- AI coding agent (Claude Code, GitHub Copilot, or Gemini CLI)
- uv package manager
- Python 3.11+
- Git

## Important Notes

- Always validate specifications against acceptance criteria
- Ask for clarification rather than making assumptions
- Focus on user scenarios over technical implementation in initial specs
- Use the review checklist to ensure completeness
- Create pull requests for specification reviews before implementation
