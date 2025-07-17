# `ChatInteractions` Component

`ChatInteractions` is a compound UI component for building chat UIs, including user prompts, assistant messages, actions, sources, and utility buttons. Designed for use with Orama-based chat applications.

---

## Exports

### `ChatInteractions.Empty`

**Props:**

- `children`: `ReactNode` (optional)  
  Content to display when there are no interactions.
- `className`: `string` (optional)

**Description:**  
Displays custom content when there are no chat interactions. Useful for showing an empty state or onboarding message.

### `ChatInteractions.Wrapper`

**Props:**

- `children`: `(interaction: Interaction, index?: number, totalInteractions?: number) => ReactNode`  
  Render prop for each interaction.
- `className`: `string` (optional)  
  Additional CSS classes.
- `aria-label`: `string` (optional)  
  Accessibility label.
- `onNewInteraction`: `(index: number) => void` (optional)  
  Callback when a new interaction is added.
- `onStreaming`: `(interaction: Interaction) => void` (optional)  
  Callback when an interaction is streaming.
- `beforeInteractions`: `ReactNode` (optional)  
  Custom content to render before the list of interactions.
- ...other `div` props

**Description:**  
Wraps and renders a list of chat interactions, handling scroll and minimum height for the last interaction. Notifies when new interactions are added or streaming. You can use `beforeInteractions` to inject custom content (e.g. a header, actions, or info) before the interactions list.

---

### `ChatInteractions.UserPrompt`

**Props:**

- `children`: `ReactNode`  
  The user's message.
- `className`: `string` (optional)
- `aria-label`: `string` (optional, default: "User message")

**Description:**  
Displays a user prompt/message in the chat.

---

### `ChatInteractions.AssistantMessage`

**Props:**

- `children`: `ReactNode`  
  The assistant's message (supports Markdown).
- `className`: `string` (optional)
- `markdownClassnames`: `Partial<Record<keyof JSX.IntrinsicElements, string>>` (optional)  
  Custom class names for Markdown elements.
- `theme`: `PrismTheme` (optional)  
  Custom syntax highlighting theme.

**Description:**
Renders the assistant's message with [react-markdown](https://github.com/remarkjs/react-markdown) and [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) out of the box.  
Supports GitHub-flavored Markdown, including code blocks with syntax highlighting.
By default, code blocks use the `vsDark` theme from `prism-react-renderer`.

**Customization:**

- To change the appearance of Markdown elements (e.g., headings, code, lists), use the `markdownClassnames` prop to provide custom class names for specific Markdown tags.
- To customize code block syntax highlighting, pass a custom `theme` (see [prism-react-renderer themes](https://github.com/FormidableLabs/prism-react-renderer#theming)).

**Example:**

```tsx
import { ChatInteractions } from '@orama/ui/components'

const markdownClassnames = {
  h1: 'text-3xl font-bold text-primary mb-4',
  h2: 'text-2xl font-semibold text-secondary mb-3',
  p: 'mb-2 leading-relaxed text-base',
  ul: 'list-disc pl-6 mb-2',
  li: 'mb-1',
  code: 'bg-gray-100 text-red-600 px-1 rounded',
  pre: 'bg-black text-white p-3 rounded-lg overflow-x-auto'
  strong: 'font-bold',
}

function Example() {
  return (
    <ChatInteractions.AssistantMessage
      className="assistant-message"
      markdownClassnames={markdownClassnames}
      theme={myCustomPrismTheme}
    >
      {`
# Welcome to Orama UI

This is a **demo** of the \`AssistantMessage\` component.

## Features

- Custom Markdown styling
- Syntax highlighted code blocks

> Try editing the styles via \`markdownClassnames\`!

\`\`\`js
function hello() {
  console.log("Hello, world!");
}
\`\`\`

      `}
    </ChatInteractions.AssistantMessage>
  )
}
```

---

### `ChatInteractions.UserActions`

**Props:**

- `children`: `ReactNode`  
  Action buttons or elements.
- `className`: `string` (optional)
- `aria-label`: `string` (optional)

**Description:**  
Container for user action buttons (e.g., copy, reset).

---

### `ChatInteractions.Sources`

**Props:**

- `sources`: `Array<Interaction["sources"]>`  
  List of source objects.
- `children`: `(document: AnyObject, index: number) => ReactNode`  
  Render prop for each document.
- `className`: `string` (optional)
- `itemClassName`: `string` (optional)

**Description:**  
Renders a list of source documents referenced in an interaction.

---

### `ChatInteractions.ScrollToBottomButton`

**Props:**

- All standard `button` props.
- `className`: `string` (optional)

**Description:**  
Button that scrolls the chat to the latest interaction when clicked.

---

### `ChatInteractions.Reset`

**Props:**

- All standard `button` props.
- `children`: `ReactNode` (optional)

**Description:**  
Button to reset the chat conversation.

---

### `ChatInteractions.RegenerateLatest`

**Props:**

- All standard `button` props.
- `children`: `ReactNode` (optional)

**Description:**  
Button to regenerate the latest assistant response.

---

### `ChatInteractions.CopyMessage`

**Props:**

- All standard `button` props.
- `interaction`: `Interaction`  
  The interaction whose message to copy.
- `copiedContent`: `ReactNode` (optional)  
  Content to show when copied.
- `children`: `ReactNode` (optional)

**Description:**  
Button to copy an assistant message to the clipboard, with feedback when copied.

---

## Usage Example

```tsx
import { ChatInteractions } from "./ChatInteractions";

<ChatInteractions.Wrapper>
  {(interaction) => (
    <>
      <ChatInteractions.UserPrompt>
        {interaction.query}
      </ChatInteractions.UserPrompt>
      <ChatInteractions.AssistantMessage>
        {interaction.response}
      </ChatInteractions.AssistantMessage>
      <ChatInteractions.UserActions>
        <ChatInteractions.CopyMessage interaction={interaction} />
      </ChatInteractions.UserActions>
    </>
  )}
</ChatInteractions.Wrapper>;
```
