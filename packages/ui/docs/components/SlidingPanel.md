# `SlidingPanel` component

The `SlidingPanel` is a composable, accessible sliding panel component, which provides focus trapping, keyboard accessibility, and smooth open/close animations.

---

## Usage

```tsx
import { SlidingPanel } from '@orama/ui/components';

function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Panel</button>
      <SlidingPanel.Wrapper open={open} onClose={() => setOpen(false)}>
        <SlidingPanel.Backdrop />
        <SlidingPanel.Content>
          <header className="flex justify-between items-center">
            <h2>Panel Title</h2>
            <SlidingPanel.Close />
          </header>
          <div>
            <p>Your panel content goes here.</p>
          </div>
        </SlidingPanel.Content>
      </SlidingPanel.Wrapper>
    </>
  );
}
```

---

## API

### `<SlidingPanel.Wrapper>`

**Props:**

| Name        | Type                    | Required | Description                                 |
|-------------|-------------------------|----------|---------------------------------------------|
| `open`      | `boolean`               | Yes      | Whether the panel is open                   |
| `onClose`   | `() => void`            | Yes      | Called when the panel should close          |
| `backdrop`  | `boolean`               | No       | (Unused, see `<Backdrop />` below)          |
| `children`  | `ReactNode`             | Yes      | Panel content (should include Content/Backdrop/Close) |
| ...         | `HTMLDivElement` props  | No       | Any other div props                         |

---

### `<SlidingPanel.Content>`

Wraps the main content of the panel and handles animation.

**Props:**

| Name        | Type                    | Required | Description                                 |
|-------------|-------------------------|----------|---------------------------------------------|
| `children`  | `ReactNode`             | Yes      | Content inside the panel                    |
| ...         | `HTMLDivElement` props  | No       | Any other div props                         |

---

### `<SlidingPanel.Backdrop>`

An overlay that closes the panel when clicked.

**Props:**

| Name        | Type                    | Required | Description                                 |
|-------------|-------------------------|----------|---------------------------------------------|
| ...         | `HTMLDivElement` props  | No       | Any other div props                         |

---

### `<SlidingPanel.Close>`

A button to close the panel.  
You can provide custom children (e.g., an icon), or it defaults to `×`.

**Props:**

| Name        | Type                    | Required | Description                                 |
|-------------|-------------------------|----------|---------------------------------------------|
| `children`  | `ReactNode`             | No       | Custom close content                        |
| ...         | `HTMLButtonElement` props| No      | Any other button props                      |

---

## Accessibility

- Focus is trapped within the panel when open.
- ESC closes the panel.
- Backdrop click closes the panel.
- ARIA roles and attributes are set for dialogs.

