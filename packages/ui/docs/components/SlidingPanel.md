# `SlidingPanel` component

The `SlidingPanel` is a composable, accessible sliding panel component, which provides focus trapping, keyboard accessibility, and smooth open/close animations.

---

## Usage

```tsx
import { SlidingPanel } from "@orama/ui/components";
import React from "react";

function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Panel</button>
      <SlidingPanel.Wrapper open={open} onClose={() => setOpen(false)}>
        <SlidingPanel.Backdrop className="bg-black/40" />
        <SlidingPanel.Content position='right'>
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

| Name       | Type                   | Required | Description                                           |
| ---------- | ---------------------- | -------- | ----------------------------------------------------- |
| `open`     | `boolean`              | Yes      | Whether the panel is open                             |
| `onClose`  | `() => void`           | Yes      | Called when the panel should close                    |
| `backdrop` | `boolean`              | No       | (Unused, see `<Backdrop />` below)                    |
| `children` | `ReactNode`            | Yes      | Panel content (should include Content/Backdrop/Close) |
| ...        | `HTMLDivElement` props | No       | Any other div props                                   |

---

### `<SlidingPanel.Content>`

Wraps the main content of the panel and handles animation.

**Props:**

| Name       | Type                                         | Required | Description                                                                                 |
| ---------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `children` | `ReactNode`                                  | Yes      | Content inside the panel                                                                    |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'`     | No       | Direction from which the panel slides in. Default is `'bottom'`.                            |
| ...        | `HTMLDivElement` props                       | No       | Any other div props                                                                         |

#### `position` prop

- **left**: Panel slides in from the left edge of the screen.
- **right**: Panel slides in from the right edge of the screen.
- **top**: Panel slides in from the top edge of the screen.
- **bottom** (default): Panel slides in from the bottom edge of the screen.

---

### `<SlidingPanel.Backdrop>`

An overlay that closes the panel when clicked.

**Props:**

| Name | Type                   | Required | Description         |
| ---- | ---------------------- | -------- | ------------------- |
| ...  | `HTMLDivElement` props | No       | Any other div props |

---

### `<SlidingPanel.Close>`

A button to close the panel.  
You can provide custom children (e.g., an icon), or it defaults to `×`.

**Props:**

| Name       | Type                      | Required | Description            |
| ---------- | ------------------------- | -------- | ---------------------- |
| `children` | `ReactNode`               | No       | Custom close content   |
| ...        | `HTMLButtonElement` props | No       | Any other button props |

---

## Styling

The `SlidingPanel` component includes the **bare minimum styles** required for accessibility, focus management, positioning, and sliding animation. This includes:

- Fixed positioning and z-index for overlay and panel.
- Transition and transform utilities for sliding animation.
- Focus trapping and keyboard accessibility.

**What’s not covered:**

- Panel width, height, padding, border-radius, background color, and shadow are **not** included by default.
- You are expected to provide your own utility classes (e.g., Tailwind, CSS Modules, etc.) for visual customization.
- The backdrop does not include a default color; you should provide a class like `bg-black/40` for a dimmed effect.

**Example of minimal required classes:**

```tsx
<SlidingPanel.Content
  position="right"
  className="bg-white max-w-md h-full p-4 rounded-l-lg shadow-lg"
>
  {/* ... */}
</SlidingPanel.Content>
<SlidingPanel.Backdrop className="bg-black/40" />
```

---

## Accessibility

- Focus is trapped within the panel when open.
- ESC closes the panel.
- Backdrop click closes the panel.
- ARIA roles and attributes are set for dialogs.