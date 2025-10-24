# `SearchInput` Component

The `SearchInput` component is a collection of composable React components for building flexible, accessible search input interfaces. It supports both regular search and NLP search modes, form submission handling, and provides comprehensive customization options.

---

## Exports

```tsx
export const SearchInput = {
  Provider: SearchInputProvider,
  Wrapper: SearchInputWrapper,
  Form: SearchInputForm,
  Input: SearchInputField,
  Label: SearchInputLabel,
  Submit: SearchInputSubmit
};
```

---

## Components

### 1. `<SearchInput.Provider>`

Provides search mode context and manages local input state for child components.

**Props:**

- `children: React.ReactNode` – Child components.
- `mode?: 'search' | 'nlp'` – Search mode (default: `'search'`).

**Usage:**

```tsx
<SearchInput.Provider mode="nlp">
  <SearchInput.Form onNlpSearch={(term) => console.log('NLP:', term)}>
    <SearchInput.Input searchOnType={false} />
    <SearchInput.Submit>Search</SearchInput.Submit>
  </SearchInput.Form>
</SearchInput.Provider>
```

**Note:** The Provider is **optional** for backward compatibility. Components work without it but with reduced functionality for `searchOnType={false}` scenarios.

---

### 2. `<SearchInput.Wrapper>`

A polymorphic wrapper component for grouping search input elements with proper semantic structure.

**Props:**

- `children: React.ReactNode` – Content to wrap (input, label, etc.).
- `className?: string` – Optional custom class name.
- `as?: ElementType` – HTML element type to render as (default: `"div"`).
- `...props` – Other props for the rendered element.

**Usage:**

```tsx
<!-- Basic wrapper -->
<SearchInput.Wrapper className="search-container">
  <SearchInput.Label htmlFor="search">Search</SearchInput.Label>
  <SearchInput.Input inputId="search" />
</SearchInput.Wrapper>

<!-- As a section element -->
<SearchInput.Wrapper as="section" className="search-section">
  {/* search components */}
</SearchInput.Wrapper>
```

**Behavior:**

- Automatically adds `role="search"` for accessibility
- Polymorphic - can render as any HTML element

---

### 3. `<SearchInput.Form>`

A form component that handles search submission and integrates with both search modes.

**Props:**

- `children: React.ReactNode` – Form content (input, submit button, etc.).
- `className?: string` – Optional custom class name.
- `searchParams?: Omit<SearchParams, 'term'> & { groupedBy?: string; filterBy?: Record<string, string>[] }` – Search parameters for Orama.
- `onNlpSearch?: (term: string, params?: any) => void` – Callback for NLP search submissions.
- `onSearch?: (searchTerm: string, event: React.FormEvent<HTMLFormElement>) => void` – Callback for regular search submissions.
- `onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void` – Standard form submit handler.
- `...props` – Other form props.

**Usage:**

```tsx
<!-- Basic form with search on submit -->
<SearchInput.Form
  onSearch={(term, event) => console.log('Searching for:', term)}
>
  <SearchInput.Input searchOnType={false} />
  <SearchInput.Submit>Search</SearchInput.Submit>
</SearchInput.Form>

<!-- NLP search form -->
<SearchInput.Provider mode="nlp">
  <SearchInput.Form
    onNlpSearch={(term, params) => console.log('NLP search:', term)}
    searchParams={{ limit: 20, boost: { title: 2 } }}
  >
    <SearchInput.Input searchOnType={false} />
    <SearchInput.Submit>Ask AI</SearchInput.Submit>
  </SearchInput.Form>
</SearchInput.Provider>
```

**Behavior:**

- Prevents default form submission
- Manages search state updates
- Handles both regular and NLP search based on mode
- Works with or without SearchInput.Provider

---

### 4. `<SearchInput.Input>`

The main search input field with integrated Orama search functionality.

**Props:**

- `inputId?: string` – Input ID (auto-generated if not provided).
- `placeholder?: string` – Placeholder text (default: `"Search..."`).
- `onValueChange?: (value: string) => void` – Callback when input value changes.
- `ariaLabel?: string` – Accessibility label.
- `className?: string` – Optional custom class name.
- `searchParams?: Omit<SearchParams, 'term'> & { groupedBy?: string; filterBy?: Record<string, string>[] }` – Search parameters for Orama.
- `searchOnType?: boolean` – Whether to trigger search on each keystroke (default: `true`).
- `ref?: React.Ref<HTMLInputElement>` – Input ref.
- `onChange?: (event: ChangeEvent<HTMLInputElement>) => void` – Standard change handler.
- `...rest` – Other input props.

**Usage:**

```tsx
<!-- Search on type (default behavior) -->
<SearchInput.Input
  placeholder="Type to search..."
  onValueChange={(value) => console.log('Typed:', value)}
/>

<!-- Search on submit only -->
<SearchInput.Input
  searchOnType={false}
  placeholder="Enter search term..."
  ariaLabel="Search products"
/>

<!-- With search parameters -->
<SearchInput.Input
  searchParams={{
    limit: 20,
    boost: { title: 2, content: 1 },
    filterBy: [{ category: 'electronics' }]
  }}
/>
```

**Behavior:**

- `searchOnType={true}`: Triggers search immediately on each keystroke
- `searchOnType={false}`: Stores input value locally, only searches on form submission
- Automatically resets search when input is cleared
- Uses `type="search"` for proper mobile keyboard
- Includes `data-focus-on-arrow-nav` for keyboard navigation support

---

### 5. `<SearchInput.Label>`

A polymorphic label component for the search input.

**Props:**

- `children: React.ReactNode` – Label content.
- `className?: string` – Optional custom class name.
- `as?: ElementType` – HTML element type to render as (default: `"label"`).
- `htmlFor?: string` – Associates label with input by ID.
- `...props` – Other props for the rendered element.

**Usage:**

```tsx
<!-- Basic label -->
<SearchInput.Label htmlFor="search-input">
  Search Products
</SearchInput.Label>

<!-- As a heading -->
<SearchInput.Label as="h2" className="search-heading">
  Find What You Need
</SearchInput.Label>

<!-- With custom styling -->
<SearchInput.Label 
  htmlFor="search" 
  className="visually-hidden"
>
  Search
</SearchInput.Label>
```

---

### 6. `<SearchInput.Submit>`

A submit button component for search forms.

**Props:**

- `children: React.ReactNode` – Button content.
- `className?: string` – Optional custom class name.
- `...props` – Other button props.

**Usage:**

```tsx
<!-- Basic submit button -->
<SearchInput.Submit className="search-button">
  Search
</SearchInput.Submit>

<!-- With icon -->
<SearchInput.Submit>
  <SearchIcon />
  Search
</SearchInput.Submit>

<!-- Custom styling -->
<SearchInput.Submit 
  className="btn btn-primary"
  disabled={!hasQuery}
>
  Find Results
</SearchInput.Submit>
```

**Behavior:**

- Always renders with `type="submit"`
- Triggers form submission when clicked
- Should be used within `SearchInput.Form`

---

## Search Modes

The SearchInput components support two search modes:

- **`'search'`** (default): Uses regular Orama search
- **`'nlp'`**: Uses NLP search functionality

Set the mode using the `SearchInput.Provider`:

```tsx
<!-- Regular search mode -->
<SearchInput.Provider mode="search">
  <SearchInput.Form onSearch={(term) => console.log('Search:', term)}>
    <SearchInput.Input />
    <SearchInput.Submit>Search</SearchInput.Submit>
  </SearchInput.Form>
</SearchInput.Provider>

<!-- NLP search mode -->
<SearchInput.Provider mode="nlp">
  <SearchInput.Form onNlpSearch={(term) => console.log('NLP:', term)}>
    <SearchInput.Input placeholder="Ask a question..." />
    <SearchInput.Submit>Ask AI</SearchInput.Submit>
  </SearchInput.Form>
</SearchInput.Provider>
```

---

## Usage Patterns

### 1. Search on Type (Real-time Search)

```tsx
<SearchInput.Wrapper className="realtime-search">
  <SearchInput.Label htmlFor="realtime">Quick Search</SearchInput.Label>
  <SearchInput.Input 
    inputId="realtime"
    searchOnType={true}
    placeholder="Results appear as you type..."
  />
</SearchInput.Wrapper>
```

### 2. Search on Submit (Form-based Search)

```tsx
<SearchInput.Provider>
  <SearchInput.Form onSearch={(term) => handleSearch(term)}>
    <SearchInput.Wrapper as="fieldset">
      <SearchInput.Label as="legend">Search Our Catalog</SearchInput.Label>
      <div className="input-group">
        <SearchInput.Input 
          searchOnType={false}
          placeholder="Enter your search terms..."
        />
        <SearchInput.Submit>Find Products</SearchInput.Submit>
      </div>
    </SearchInput.Wrapper>
  </SearchInput.Form>
</SearchInput.Provider>
```

### 3. NLP Search Interface

```tsx
<SearchInput.Provider mode="nlp">
  <SearchInput.Form 
    onNlpSearch={(query) => handleNlpQuery(query)}
    searchParams={{ limit: 10 }}
  >
    <SearchInput.Wrapper className="ai-search">
      <SearchInput.Label>Ask our AI assistant</SearchInput.Label>
      <SearchInput.Input 
        searchOnType={false}
        placeholder="What would you like to know?"
        ariaLabel="AI search query"
      />
      <SearchInput.Submit>Ask AI</SearchInput.Submit>
    </SearchInput.Wrapper>
  </SearchInput.Form>
</SearchInput.Provider>
```

### 4. Advanced Search with Filters

```tsx
<SearchInput.Form 
  searchParams={{
    limit: 50,
    boost: { title: 3, description: 1 },
    filterBy: [
      { category: selectedCategory },
      { inStock: true }
    ]
  }}
  onSearch={(term) => handleAdvancedSearch(term)}
>
  <SearchInput.Input 
    placeholder="Search with filters applied..."
    searchOnType={false}
  />
  <SearchInput.Submit>Advanced Search</SearchInput.Submit>
</SearchInput.Form>
```

---

## Complete Example

```tsx
import { SearchInput } from '@orama/ui-react'

function SearchPage() {
  const [searchMode, setSearchMode] = useState<'search' | 'nlp'>('search')

  const handleSearch = (term: string) => {
    console.log('Regular search:', term)
  }

  const handleNlpSearch = (query: string) => {
    console.log('NLP search:', query)
  }

  return (
    <div className="search-page">
      {/* Mode toggle */}
      <div className="search-mode-toggle">
        <button 
          onClick={() => setSearchMode('search')}
          className={searchMode === 'search' ? 'active' : ''}
        >
          Keyword Search
        </button>
        <button 
          onClick={() => setSearchMode('nlp')}
          className={searchMode === 'nlp' ? 'active' : ''}
        >
          AI Search
        </button>
      </div>

      {/* Search interface */}
      <SearchInput.Provider mode={searchMode}>
        <SearchInput.Form
          onSearch={handleSearch}
          onNlpSearch={handleNlpSearch}
          searchParams={{
            limit: 20,
            boost: { title: 2, content: 1 }
          }}
        >
          <SearchInput.Wrapper className="search-container">
            <SearchInput.Label htmlFor="main-search">
              {searchMode === 'nlp' ? 'Ask a question' : 'Search our content'}
            </SearchInput.Label>
            
            <div className="search-input-group">
              <SearchInput.Input
                inputId="main-search"
                searchOnType={false}
                placeholder={
                  searchMode === 'nlp' 
                    ? "What would you like to know?" 
                    : "Enter search terms..."
                }
                className="search-input"
              />
              
              <SearchInput.Submit className="search-submit">
                {searchMode === 'nlp' ? 'Ask AI' : 'Search'}
              </SearchInput.Submit>
            </div>
          </SearchInput.Wrapper>
        </SearchInput.Form>
      </SearchInput.Provider>
    </div>
  )
}
```

---

## Accessibility Features

- **Semantic HTML**: Uses proper form, input, and label elements
- **ARIA support**: Supports `aria-label` and automatic label association
- **Keyboard navigation**: Full keyboard support with `data-focus-on-arrow-nav`
- **Search landmark**: Wrapper includes `role="search"` for screen readers
- **Form semantics**: Proper form submission handling
- **Input type**: Uses `type="search"` for appropriate mobile keyboards

---

## Backward Compatibility

All components work without the `SearchInput.Provider` for backward compatibility:

- When no Provider is used, components fall back to previous behavior
- `searchOnType={false}` functionality is enhanced when Provider is available
- Existing code continues to work without