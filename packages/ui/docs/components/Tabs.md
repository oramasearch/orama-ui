# `Tabs` Component

The `Tabs` component provides a flexible, accessible tabbed interface for React applications. It supports both static and dynamic tab lists, keyboard navigation, and chat-like workflows.

---

## Usage

```tsx
import { Tabs } from "@orama/ui";

<Tabs.Wrapper defaultTab="tab1" orientation="horizontal">
  <Tabs.List>
    <Tabs.Button tabId="tab1">Tab 1</Tabs.Button>
    <Tabs.Button tabId="tab2">Tab 2</Tabs.Button>
  </Tabs.List>
  <Tabs.Panel tabId="tab1">Content for Tab 1</Tabs.Panel>
  <Tabs.Panel tabId="tab2">Content for Tab 2</Tabs.Panel>
</Tabs.Wrapper>;
```

---

## API Reference

### `Tabs.Wrapper`

Wraps the entire tab interface and provides context.

**Props:**

- `children: ReactNode` – Tab buttons and panels.
- `defaultTab?: string` – ID of the tab to activate by default.
- `onTabChange?: (tabId: string) => void` – Callback when the active tab changes.
- `className?: string` – Custom class for styling.
- `orientation?: 'horizontal' | 'vertical'` – Keyboard navigation orientation (default: 'vertical').

---

### `Tabs.List`

Container for tab buttons.

**Props:**

- `children: ReactNode` – One or more `Tabs.Button` components.

---

### `Tabs.Button`

A clickable tab button.

**Props:**

- `tabId: string` – Unique ID for the tab.
- `children: ReactNode` – Tab label or content.
- `className?: string` – Custom class.
- `disabled?: boolean` – Disable the tab.

---

### `Tabs.Panel`

Panel for tab content, shown only when active.

**Props:**

- `tabId: string` – ID of the tab this panel belongs to.
- `children: ReactNode` – Panel content.
- `className?: string` – Custom class.
- `askOptions?: Omit<AnswerConfig, 'query'>` – Options for chat integration (optional).

---

### `Tabs.Trigger`

Creates and activates a new tab, useful for dynamic tabs.

**Props:**

- `tabId: string` – Unique ID for the new tab.
- `children: ReactNode` – Button content.
- `prompt?: string` – Optional prompt for chat tabs.
- `className?: string` – Custom class.
- `disabled?: boolean` – Disable the trigger.

#### Example: Trigger and dynamic chat tabs

```tsx
import { Tabs } from "@orama/ui";
import { ChatInteractions } from "@orama/ui";

const MyTabComponent = () => {
  const [activeTab, setActiveTab] = useState<string | undefined>();

  return (
    <Tabs.Wrapper defaultTab={activeTab} setActiveTab={setActiveTab}>
      <Tabs.Trigger tabId="chat-1" prompt="What is orama?">
        What is orama?
      </Tabs.Trigger>
      <Tabs.DynamicList>
        {(tab) => (
          <Tabs.Button tabId={tab.id}>
            {tab.label}
            <Tabs.Close tabId={tab.id} />
          </Tabs.Button>
        )}
      </Tabs.DynamicList>
      <Tabs.DynamicPanels>
        {(tab) => (
          <Tabs.DynamicPanel tabId={tab.id}>
            <PromptTextArea tabId={tab.id} />
            <ChatInteractions.Wrapper>
              {(interaction) => (
                <>
                  <ChatInteraction.UserPrompt>
                    {interaction.query}
                  </ChatInteraction.UserPrompt>
                  <ChatInteraction.UserPrompt>
                    {interaction.response}
                  </ChatInteraction.UserPrompt>
                </>
              )}
            </ChatInteractions.Wrapper>
          </Tabs.DynamicPanel>
        )}
      </Tabs.DynamicPanels>
    </Tabs.Wrapper>
  );
};
```

---

### `Tabs.Close`

Button to close a dynamic tab.

**Props:**

- `tabId: string` – ID of the tab to close.
- `children?: ReactNode` – Custom close icon or text.

---

### `Tabs.DynamicList`

Renders a list of dynamic tabs.

**Props:**

- `children: (item: ChatTabItem) => ReactNode` – Render function for each tab.

---

### `Tabs.DynamicPanels`

Renders panels for each dynamic/chat tab.

**Props:**

- `children: (item: ChatTabItem, chatTabs?: ChatTabItem[], setChatTabs?: (tabs: ChatTabItem[]) => void) => ReactNode` – Render function for each panel.

---

### `Tabs.DynamicPanel`

Panel for a dynamic/chat tab, with prompt handling.

**Props:**

- `tabId: string` – Tab ID.
- `children: ReactNode` – Panel content.
- `askOptions?: Omit<AnswerConfig, 'query'>` – Options for chat integration.
- `className?: string` – Custom class.

---

### `Tabs.Counter`

Renders the count of dynamic/chat tabs.

**Props:**

- `children: (count: number) => ReactNode` – Render function for the count.

---

## Keyboard Navigation

- Arrow keys move focus between tabs.
- Orientation can be set to `'horizontal'` or `'vertical'`.

---

## Notes

- All tab components must be used within `Tabs.Wrapper`.
- Dynamic tabs are useful for chat/messaging UIs.
- The component is accessible and supports keyboard navigation.
