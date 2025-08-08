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
       <SearchInput placeholder="Search for anything..." />
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
   All components are unstyled by default. Use your own CSS, Tailwind, styled-components, or any styling solution:

   ```tsx
   // With Tailwind CSS
   <SearchInput className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500" />

   // With CSS Modules
   <SearchInput className={styles.searchInput} />

   // With styled-components
   const StyledSearchInput = styled(SearchInput)`
     padding: 12px;
     border: 2px solid #e2e8f0;
     border-radius: 8px;
   `;
   ```

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
- **[`SearchInput`](./docs/components/SearchInput.md)** - Input field for search queries with built-in search logic
- **[`SearchResults`](./docs/components/SearchResults.md)** - Displays search results with customizable rendering
- **[`ChatInteractions`](./docs/components/ChatInteractions.md)** - Renders chat messages and user actions

### Input Components

- **[`PromptTextArea`](./docs/components/PromptTextArea.md)** - Textarea for chat prompts
- **[`Suggestions`](./docs/components/Suggestions.md)** - Displays prompt suggestions

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

All components and hooks are fully typed with TypeScript. Import types for better development experience:

```tsx
import type { SearchResult, ChatMessage, FacetFilter } from "@orama/ui";

// Use with your own interfaces
interface MyDocument {
  id: string;
  title: string;
  content: string;
  category: string;
}

// Type your search results
const results: SearchResult<MyDocument>[] = useSearch().results;
```

---

## Customization

### Custom Result Rendering

```tsx
<SearchResults
  renderItem={({ item, index }) => (
    <article className="result-card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <span className="result-index">#{index + 1}</span>
    </article>
  )}
/>
```

### Custom Chat Messages

```tsx
<ChatInteractions
  renderMessage={({ message, isUser }) => (
    <div className={`message ${isUser ? "user" : "assistant"}`}>
      <div className="message-content">{message.content}</div>
      <time className="message-time">{message.timestamp}</time>
    </div>
  )}
/>
```

### Extending Components

```tsx
// Create your own component using Orama UI hooks
function CustomSearchBox() {
  const { query, setQuery, search } = useSearch();

  return (
    <div className="custom-search">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && search()}
      />
      <button onClick={search}>Search</button>
    </div>
  );
}
```

### Integration with State Management

```tsx
// Use with Redux, Zustand, or other state management
function SearchWithExternalState() {
  const { results } = useSearch();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSearchResults(results));
  }, [results, dispatch]);

  return <SearchInput />;
}
```

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

---

## License

MIT © [Orama](https://orama.com/)
