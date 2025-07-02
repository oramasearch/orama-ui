# `PromptTextArea` Component

The `PromptTextArea` is a compound React component designed for chat or prompt-based UIs. It provides a textarea input, a submit/abort button, and a wrapper for easy focus management. It integrates with Orama's chat context and hooks for state and actions.

---

## Usage

```tsx
import { PromptTextArea } from "@orama/ui";

<PromptTextArea.Wrapper>
  <PromptTextArea.Field
    placeholder="Type your message..."
    maxLength={500}
    rows={4}
    disabled={false}
  />
  <PromptTextArea.Button>Send</PromptTextArea.Button>
</PromptTextArea.Wrapper>;
```

---

## Components

### 1. `<PromptTextArea.Wrapper>`

- **Props:**
  - `children`: React nodes to render inside the wrapper.
  - `className`: Optional CSS class.
- **Behavior:** Focuses the textarea when the wrapper is clicked.

---

### 2. `<PromptTextArea.Field>`

- **Props:**
  - `onChange`: Callback for textarea change.
  - `placeholder`: Placeholder text (default: "Enter your prompt...").
  - `disabled`: Disable input.
  - `maxLength`: Max character length.
  - `rows`: Number of rows (default: 4).
  - `className`: Optional CSS class.
  - `askOptions`: Additional options for the ask action.
  - `aria-label`, `aria-describedby`: Accessibility attributes.
  - ...other standard textarea props.
- **Behavior:**
  - Submits on Enter (without Shift), clears input, and dispatches prompt to context.
  - Updates context on change.
  - Controlled via context for clearing/resetting.

---

### 3. `<PromptTextArea.Button>`

- **Props:**
  - `onAsk`: Callback after ask action.
  - `disabled`: Disable button.
  - `isLoading`: Show loading state.
  - `buttonText`: Button label.
  - `abortContent`: Content to show when aborting.
  - `askOptions`: Additional options for the ask action.
  - `aria-label`: Accessibility label.
  - ...other standard button props.
- **Behavior:**
  - Calls ask action with current prompt.
  - If streaming/loading, acts as an abort button.
  - Disabled if no prompt or explicitly disabled.

---

## Accessibility

- Proper `aria-label` and `aria-describedby` support.
- Button uses `aria-live` when streaming.

---

## Integration

- Requires Orama chat context and hooks (`useChatContext`, `useChatDispatch`, `useChat`).
- Handles prompt state and submission logic internally.

---

## Example

```tsx
<PromptTextArea.Wrapper>
  <PromptTextArea.Field aria-label="Chat prompt" />
  <PromptTextArea.Button>Send</PromptTextArea.Button>
</PromptTextArea.Wrapper>
```

---

## Notes

- The textarea is cleared after submission.
- The button switches to abort mode during streaming/loading.
- Designed for extensibility and accessibility.
