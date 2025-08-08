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
   import {
     SearchRoot,
     SearchInput,
     SearchResults,
   } from "@orama/ui/components";
   ```

   Create your Orama client instance and wrap your application with the SearchRoot provider and compose your search interface:

   ```tsx
   <SearchRoot client={orama}>
     <div className="search-container">
       <SearchInput.Input placeholder="Search for anything..." />
       <SearchResults.Wrapper>
         <SearchResults.List>
           {(result) => (
             <SearchResults.Item>
               <h3>{result.title}</h3>
               <p>{result.description}</p>
             </SearchResults.Item>
           )}
         </SearchResults.List>
       </SearchResults.Wrapper>
     </div>
   </SearchRoot>
   ```

3. **Style as you wish:**  
   All components are unstyled by default. Use your own CSS, Tailwind, styled-components, or any styling solution.

---

## Philosophy

Orama UI follows these core principles:

- **🧩 Composable:** Components are designed to be combined and nested as building blocks. Mix and match to create your perfect interface.
- **🎨 Unstyled:** Zero default styles mean you have complete control over the visual design. No CSS conflicts or overrides needed.
- **⚡ Flexible:** Use only what you need. Each component works independently or as part of a larger system.
- **♿ Accessible:** Built with accessibility in mind, following ARIA best practices and keyboard navigation standards.
- **🔧 Developer-friendly:** TypeScript support, comprehensive documentation, and intuitive APIs.

---

## Components

### Core Components

- **[`SearchRoot`](./docs/components/SearchRoot.md)** - Root provider for search functionality and state management
- **[`ChatRoot`](./docs/components/ChatRoot.md)** - Root provider for chat/conversation interfaces
- **[`SearchResults`](./docs/components/SearchResults.md)** - Displays search results with customizable rendering
- **[`ChatInteractions`](./docs/components/ChatInteractions.md)** - Renders chat messages and user actions
- **[`Suggestions`](./docs/components/Suggestions.md)** - Displays prompt suggestions

### Input Components

- **[`PromptTextArea`](./docs/components/PromptTextArea.md)** - Textarea for chat prompts
- **[`SearchInput`](./docs/components/SearchInput.md)** - Input field for search queries with built-in search logic


### Navigation & Filtering

- **[`FacetTabs`](./docs/components/FacetTabs.md)** - Tab-based filtering for search facets
- **[`Tabs`](./docs/components/Tabs.md)** - Generic tab navigation component

### Layout Components

- **[`Modal`](./docs/components/Modal.md)** - Accessible modal dialog with focus management
- **[`SlidingPanel`](./docs/components/SlidingPanel.md)** - Slide-in panel for sidebars and overlays

---

## Hooks

### Primary Hooks

- **[`useSearch`](./docs/hooks/useSearch.md)** - Access search state, query, results, and search functions
- **[`useChat`](./docs/hooks/useChat.md)** - Manage chat conversations, messages, and AI interactions

### Utility Hooks

- **[`useArrowKeyNavigation`](./docs/hooks/useArrowKeyNavigation.md)** - Keyboard navigation for lists and results
- **[`useClipboard`](./docs/hooks/useClipboard.md)** - Copy text to clipboard with feedback
- **[`useScrollableContainer`](./docs/hooks/useScrollableContainer.md)** - Manage scrollable content areas
- **[`useLastInteractionMinHeight`](./docs/hooks/useLastInteractionMinHeight.md)** - Dynamic height management for chat interactions

---

## Context

- **[`SearchContext`](./docs/context/SearchContext.md)** - Provides search state and functionality to child components
- **[`ChatContext`](./docs/context/ChatContext.md)** - Manages chat state, conversation history, and AI responses

---

## TypeScript Support

All components and hooks are fully typed with TypeScript. Import types for better development experience.

---

### Extending Components

```tsx
// Create your own component using Orama UI hooks
function CustomSearchBox() {
  const [ query, setQuery ] = useState();
  const { search } = useSearch();

  const handleSearch = (event) => {
    search({
      term: query,
      limit: 10,
    });

    // other code here...
  };


  return (
    <div className="custom-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
```

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

