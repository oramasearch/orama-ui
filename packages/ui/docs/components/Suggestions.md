# `Suggestions` Component

The `Suggestions` component provides a set of composable UI primitives for rendering suggestion lists, typically used in chat or search interfaces. It consists of two main subcomponents: `Wrapper` and `Item`.

---

## Usage Example

```tsx
<Suggestions.Wrapper className="suggestions-wrapper">
  {suggestions.map((suggestion) => (
    <Suggestions.Item
      key={suggestion.id}
      onClick={() => handleSuggestionClick(suggestion)}
      className="suggestion-button"
      askOptions={{ someOption: true }}
    >
      <span>{suggestion.title}</span>
    </Suggestions.Item>
  ))}
</Suggestions.Wrapper>
```

---

## API Reference

### `<Suggestions.Wrapper>`

**Props:**

| Name      | Type        | Default | Description                        |
| --------- | ----------- | ------- | ---------------------------------- |
| className | `string`    | `""`    | Optional CSS class for the wrapper |
| children  | `ReactNode` |         | Content to render inside           |

---

### `<Suggestions.Item>`

**Props:**

| Name        | Type                                                   | Default | Description                                                               |
| ----------- | ------------------------------------------------------ | ------- | ------------------------------------------------------------------------- |
| onClick     | `(event: React.MouseEvent<HTMLButtonElement>) => void` |         | Optional click handler for the suggestion button                          |
| children    | `ReactNode`                                            |         | Content to display inside the suggestion button                           |
| className   | `string`                                               | `""`    | Optional CSS class for the `<button>` element                             |
| askOptions  | `Omit<AnswerConfig, "query">`                          | `{}`    | Additional options passed to the `onAsk` function from the `useChat` hook |

**Behavior:**

- Renders a `<button>` for each suggestion.
- When the button is clicked:
  - Calls the optional `onClick` handler.
  - Calls `onAsk` from the `useChat` hook with the button's text content as the `query` and any additional `askOptions`.

---

## Accessibility

- Suggestions can be rendered inside a semantic list (e.g., `<ul>`), with each suggestion as a `<button>`.
- Supports keyboard navigation via `data-focus-on-arrow-nav` (if used in your implementation).

---

## Customization

- Use the `className` prop to style the wrapper and each suggestion button as needed.
- The `children` prop of `Suggestions.Item` can be any React node, allowing for icons or custom content.

---

## Dependencies

- Relies on the `useChat` hook from your project for handling suggestion selection.

---