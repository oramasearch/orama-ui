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
  - `onChange`: Custom callback for textarea change events.
  - `onKeyDown`: Custom callback for key down events.
  - `placeholder`: Placeholder text (default: "Enter your prompt...").
  - `disabled`: Disable input.
  - `maxLength`: Max character length.
  - `rows`: Number of rows (default: 4).
  - `className`: Optional CSS class.
  - `aria-label`, `aria-describedby`: Accessibility attributes.
  - `ref`: Ref to the textarea element.
  - ...other standard textarea props.
- **Behavior:**
  - Submits on Enter (without Shift), clears input, and dispatches prompt to context.
  - Updates context on change.
  - Controlled via context for clearing/resetting.
  - Custom callbacks are called before internal handlers and can prevent default behavior.

---

### 3. `<PromptTextArea.Button>`

- **Props:**
  - `ask`: Custom callback fired after the ask action completes.
  - `onClick`: Custom callback for button click events.
  - `disabled`: Disable button.
  - `isLoading`: Show loading state.
  - `buttonText`: Button label.
  - `abortContent`: Content to show when aborting.
  - `aria-label`: Accessibility label.
  - ...other standard button props.
- **Behavior:**
  - Calls ask action with current prompt.
  - If streaming/loading, acts as an abort button.
  - Disabled if no prompt or explicitly disabled.
  - Custom callbacks are called after internal handlers complete.

---

## Custom Callbacks

The `PromptTextArea` components support custom callbacks that allow you to extend or customize the default behavior.

### Field Callbacks

#### `onChange`
Called whenever the textarea value changes, before the internal state update.

```tsx
<PromptTextArea.Field
  onChange={(e) => {
    console.log('Value changed:', e.target.value);
    // To prevent internal state update, call e.preventDefault()
  }}
/>
```

#### `onKeyDown`
Called on key press events, before the internal key handling (Enter to submit).

```tsx
<PromptTextArea.Field
  onKeyDown={(e) => {
    if (e.key === 'Escape') {
      e.target.blur();
    }
    // To prevent Enter submission, call e.preventDefault()
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      // Custom submit logic
    }
  }}
/>
```

### Button Callbacks

#### `onClick`
Called after the internal click handler (ask/abort action).

```tsx
<PromptTextArea.Button
  onClick={(e) => {
    console.log('Button clicked');
    // Additional logic after ask/abort
  }}
>
  Send
</PromptTextArea.Button>
```

#### `ask`
Called after a successful ask action with the submitted prompt.

```tsx
<PromptTextArea.Button
  ask={(prompt) => {
    console.log('Prompt submitted:', prompt);
    // Track analytics, etc.
  }}
>
  Send
</PromptTextArea.Button>
```

### Preventing Default Behavior

You can prevent the default internal behavior by calling `preventDefault()` in your custom callbacks:

```tsx
<PromptTextArea.Field
  onChange={(e) => {
    // Custom validation
    if (e.target.value.length > 100) {
      e.preventDefault(); // Prevents internal state update
      return;
    }
  }}
  onKeyDown={(e) => {
    // Custom submission logic
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents default Enter submission
      // Your custom submission logic here
    }
  }}
/>
```

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

### Advanced Example with Custom Callbacks

```tsx
<PromptTextArea.Wrapper>
  <PromptTextArea.Field
    aria-label="Chat prompt"
    placeholder="Type your message... (Ctrl+Enter for new line)"
    onChange={(e) => {
      // Character counter logic
      const remaining = 500 - e.target.value.length;
      setCharacterCount(remaining);
    }}
    onKeyDown={(e) => {
      // Allow Ctrl+Enter for new lines
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '\n' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
      // Custom validation on Enter
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        const value = e.target.value.trim();
        if (value.length < 10) {
          e.preventDefault();
          setError('Message must be at least 10 characters');
        }
      }
    }}
    maxLength={500}
  />
  <PromptTextArea.Button
    ask={(prompt) => {
      // Analytics tracking
      analytics.track('prompt_submitted', { length: prompt.length });
    }}
    onClick={() => {
      // Clear any validation errors
      setError(null);
    }}
  >
    Send
  </PromptTextArea.Button>
</PromptTextArea.Wrapper>
```

---

## Notes

- The textarea is cleared after submission.
- The button switches to abort mode during streaming/loading.
- Designed for extensibility and accessibility.
