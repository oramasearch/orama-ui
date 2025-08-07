# Orama UI

Orama UI is a composable, unstyled React component library designed to provide flexible building blocks for search and chat interfaces powered by [Orama](https://orama.com/). All components are unopinionated about styling, allowing you to fully control the look and feel of your application.

---

## Getting Started

1. **Install the package:**

   ```bash
   npm install @orama/ui
   # or
   pnpm install @orama/ui
   # or
   yarn add @orama/ui
   ```

2. **Import and use the components:**

   ```tsx
   import { SearchRoot } from "@orama/ui/components";

   <SearchRoot client={orama}>
     {/* Add Orama UI components and your own components here to compose your custom interface */}
   </SearchRoot>;
   ```

3. **Style as you wish:**  
   All components are unstyled by default. Use your own CSS, Tailwind, or any styling solution.

---

## Philosophy

- **Composable:** Components are designed to be combined and nested as needed.
- **Unstyled:** No default styles, giving you full control.
- **Flexible:** Use only what you need, extend or replace components easily.

---

## Components

- [`SearchRoot`](./docs/components/SearchRoot.md)
- [`ChatRoot`](./docs/components/ChatRoot.md)
- [`SearchInput`](./docs/components/SearchInput.md)
- [`ChatInteractions`](./docs/components/ChatInteractions.md)
- [`FacetTabs`](./docs/components/FacetTabs.md)
- [`PromptTextArea`](./docs/components/PromptTextArea.md)
- [`SearchResults`](./docs/components/SearchResults.md)
- [`Suggestions`](./docs/components/Suggestions.md)
- [`Modal`](./docs/components/Modal.md)
- [`SlidingPanel`](./docs/components/SlidingPanel.md)
- [`Tabs`](./docs/components/Tabs.md)

---

## Hooks

- [`useChat`](./docs/hooks/useChat.md)
- [`useSearch`](./docs/hooks/useSearch.md)
- [`useArrowKeyNavigation`](./docs/hooks/useArrowKeyNavigation.md)
- [`useClipboard`](./docs/hooks/useClipboard.md)
- [`useScrollableContainer`](./docs/hooks/useScrollableContainer.md)
- [`useLastInteractionMinHeight`](./docs/hooks/useLastInteractionMinHeight.md)

---

## Context

- [`ChatContext`](./docs/context/ChatContext.md)
- [`SearchContext`](./docs/context/SearchContext.md)

---

## Types

- [`types`](./docs/types.md)

---

## Customization

- **Override or extend components** as needed.
- **Compose layouts** using provided building blocks.
- **Integrate with your own state or context** if desired.
