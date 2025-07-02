# `Suggestions` Component

The `Suggestions` component provides a set of composable UI primitives for rendering suggestion lists, typically used in chat or search interfaces. It consists of three main subcomponents: `Wrapper`, `List`, and `Item`.

---

## Usage Example

```tsx
<Suggestions.Wrapper className="suggestions-wrapper">
  <Suggestions.List className="suggestions-list" aria-label="Suggestions">
    {suggestions.map(suggestion => (
      <Suggestions.Item
        key={suggestion.id}
        onClick={() => handleSuggestionClick(suggestion)}
        itemClassName="suggestion-button"
      >
        {suggestion.title}
      </Suggestions.Item>
    ))}
  </Suggestions.List>
</Suggestions.Wrapper>
```

---

## API Reference

### `<Suggestions.Wrapper>`

**Props:**

| Name      | Type           | Default | Description                        |
|-----------|----------------|---------|------------------------------------|
| className | `string`       | `""`    | Optional CSS class for the wrapper |
| children  | `ReactNode`    |         | Content to render inside           |

---

### `<Suggestions.List>`

**Props:**

| Name        | Type           | Default | Description                        |
|-------------|----------------|---------|------------------------------------|
| className   | `string`       | `""`    | Optional CSS class for the list    |
| aria-label  | `string`       |         | Optional ARIA label for accessibility |
| children    | `ReactNode`    |         | List items to render               |

---

### `<Suggestions.Item>`

**Props:**

| Name         | Type                                             | Default | Description                                                                                  |
|--------------|--------------------------------------------------|---------|----------------------------------------------------------------------------------------------|
| onClick      | `(event: React.MouseEvent<HTMLButtonElement>) => void` |         | Optional click handler for the suggestion button                                              |
| children     | `ReactNode`                                      |         | Content to display inside the suggestion button                                               |
| className    | `string`                                         | `""`    | Optional CSS class for the `<li>` element                                                     |
| itemClassName| `string`                                         | `""`    | Optional CSS class for the `<button>` element                                                 |
| askOptions   | `Omit<AnswerConfig, "query">`                    | `{}`    | Additional options passed to the `onAsk` function from the `useChat` hook                     |

**Behavior:**

- Renders a `<li>` containing a `<button>`.
- When the button is clicked:
  - Calls the optional `onClick` handler.
  - Calls `onAsk` from the `useChat` hook with the button's text content as the `query` and any additional `askOptions`.

---

## Accessibility

- The list uses a `<ul>` element.
- Each suggestion is rendered as a `<button>` inside a `<li>`.
- Supports keyboard navigation via `data-focus-on-arrow-nav`.

---

## Customization

- Use `className` and `itemClassName` props to style the wrapper, list, and items as needed.

---

## Dependencies

- Relies on the `useChat` hook from your project for handling suggestion selection.
