# Contributing to Mini Social Media Platform

First, thank you for contributing to this project. This document provides guidelines and a workflow for our four-person development team to collaborate effectively, maintain code quality, and prevent merge conflicts.

## Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
* Node.js (v18 or higher recommended)
* npm or yarn
* MongoDB (running locally or a connection string to MongoDB Atlas)
* Git

### Local Setup
1. Clone the repository:
   `git clone <repository-url>`
2. Install server dependencies:
   `cd server`
   `npm install`
3. Install client dependencies:
   `cd ../client`
   `npm install`
4. Create `.env` files in both the `server` and `client` directories using the provided `.env.example` templates.
5. Start the development servers:
   * Server: `npm run dev`
   * Client: `npm run dev`

## Development Workflow

### Branching Strategy
We use a feature-branching model. Never commit directly to the `main` or `master` branch.

* **Main Branch:** `main` (Production-ready code)
* **Development Branch:** `dev` (Integration branch for ongoing work)
* **Feature Branches:** `feature/short-description` (e.g., `feature/user-authentication`)
* **Bugfix Branches:** `bugfix/short-description` (e.g., `bugfix/login-crash`)

To create a new branch:
`git checkout -b feature/your-feature-name dev`

### Task Assignment
Before starting work on a feature or bug, ensure it is assigned to you on our project board to avoid duplicated efforts. If you need to change your assigned task, communicate with the team.

## Coding Standards

### General Guidelines
* **Language:** JavaScript (ES6+).
* **Indentation:** 2 spaces.
* **Linting:** Run ESLint before committing your code to ensure it matches our style guide. Fix any warnings or errors.
* **Component Structure:** For React, use functional components and hooks. Keep components modular and reusable.
* **API Endpoints:** Follow RESTful conventions for Express routes.

### UI and Design
* **Icons and Visuals:** Use clear text labels (such as [Edit], [Delete], [Submit]) instead of visual icons or emojis within the UI components and code comments.

## Commit Message Conventions

Write clear and descriptive commit messages. We follow the Conventional Commits specification.

Format:
`[type]: [short description]`

Types:
* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation changes
* `style`: Changes that do not affect the meaning of the code (formatting, missing semi-colons, etc.)
* `refactor`: Code changes that neither fix a bug nor add a feature
* `test`: Adding missing tests or correcting existing tests

Example:
`feat: implement email verification before user creation`
`fix: correct validation logic in login controller`

## Pull Request Process

1. **Keep it small:** Submit pull requests for single, focused features or fixes.
2. **Push your branch:** `git push origin feature/your-feature-name`
3. **Open a Pull Request (PR):** Target the `dev` branch, not `main`.
4. **Description:** Clearly describe what the PR does, why the approach was chosen, and link to the relevant task on the project board.
5. **Code Review:** At least one other team member must review and approve the PR before it can be merged.
6. **Merge Conflicts:** If there are conflicts with the target branch, pull the target branch into your feature branch and resolve the conflicts locally before requesting a review.
7. **Merge:** Once approved, squash and merge the PR.

## Reporting Bugs

If you find a bug while testing, please create an issue on the repository tracking board with the following information:
* A clear description of the bug.
* Steps to reproduce the behavior.
* Expected behavior.
* Screenshots or error logs if applicable.
