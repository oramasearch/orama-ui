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
- ...other `div` props

**Description:**  
Wraps and renders a list of chat interactions, handling scroll and minimum height for the last interaction. Notifies when new interactions are added or streaming.

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
- `markdownClassnames`: `{ [key: string]: string }` (optional)  
  Custom class names for Markdown elements.
- `theme`: `PrismTheme` (optional)  
  Custom syntax highlighting theme.

**Description:**  
Renders the assistant's message with Markdown and syntax-highlighted code blocks.

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

````tsx
import { ChatInteractions } from "./ChatInteractions";

<ChatInteractions.Wrapper>
  {(interaction) => (
    <>
      <ChatInteractions.UserPrompt>
        {interaction.prompt}
      </ChatInteractions.UserPrompt>
      <ChatInteractions.AssistantMessage>
        {interaction.response}
      </ChatInteractions.AssistantMessage>
      <ChatInteractions.UserActions>
        <ChatInteractions.CopyMessage interaction={interaction} />
      </ChatInteractions.UserActions>
    </>
  )}
</ChatInteractions.Wrapper>
````