# Orama UI Monorepo

Welcome to the **Orama UI Monorepo**, a unified codebase for building, sharing, and maintaining UI components and utilities, powered by [Turborepo](https://turbo.build/repo).

## 🚀 Get Started

To set up the project locally, clone this repository and then:

1. **Install dependencies:**

   ```sh
   pnpm install
   ```

2. **Run the development servers:**
   ```sh
   pnpm dev
   ```
   This will start all apps in the [`apps/`](apps/) directory.

## 🗂️ Monorepo Structure

- [`apps/web`](apps/web): Main Next.js web application with component showcases.
- [`apps/demo-next`](apps/demo-next): Example Next.js app using Orama UI.
- [`packages/ui`](packages/ui): Shared React component library.
- [`packages/eslint-config`](packages/eslint-config): Shared ESLint configuration.
- [`packages/typescript-config`](packages/typescript-config): Shared TypeScript configuration.
- [`packages/tailwind-config`](packages/tailwind-config): Shared Tailwind CSS configuration.

All packages and apps use [TypeScript](https://www.typescriptlang.org/) for type safety.

## 🛠️ Building the UI Package

The [`ui`](packages/ui) package compiles React components and utilities into the `dist` directory. Next.js apps in this monorepo consume these components to showcase use cases and custom themes.

To build the UI package:

```sh
cd packages/ui
pnpm build
```

## 🤝 Contributing

We welcome contributions! To get started:

1. **Fork the repository** and create a new branch:

   ```sh
   git checkout -b feature/your-feature
   ```

2. **Make your changes** and ensure code quality:
   - Run `pnpm lint` to check for lint errors.
   - Run `pnpm format` to auto-format code.
   - Add or update tests as needed.

3. **Commit and push your changes:**

   ```sh
   git commit -m "feat: add your feature"
   git push origin feature/your-feature
   ```

4. **Open a Pull Request** on GitHub and describe your changes.

## 🧰 Utilities

- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) — Static type checking
- [ESLint](https://eslint.org/) — Code linting
- [Prettier](https://prettier.io) — Code formatting
- [Turborepo](https://turbo.build/repo) — Monorepo tooling

---

Feel free to open issues or discussions for questions, suggestions, or feedback!
