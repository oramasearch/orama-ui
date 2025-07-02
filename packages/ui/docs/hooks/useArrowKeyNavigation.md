# `useArrowKeysNavigation` hook

A custom React hook that enables keyboard navigation using arrow keys within a container element. This hook is useful for building accessible UIs where users can navigate between focusable elements using the keyboard.

---

## Usage

```tsx
import { useArrowKeysNavigation } from "@orama/ui/hooks";

const { ref, onArrowLeftRight } = useArrowKeysNavigation();

return (
  <div ref={ref} onKeyDown={onArrowLeftRight}>
    <button data-focus-on-arrow-nav-left-right>Tab 1</button>
    <button data-focus-on-arrow-nav-left-right>Tab 2</button>
    <button data-focus-on-arrow-nav-left-right>Tab 3</button>
  </div>
);
```

```tsx
import { useArrowKeysNavigation } from "@orama/ui/hooks";

const { ref, useArrowKeysNavigation } = useArrowKeysNavigation();

return (
  <ul ref={ref} onKeyDown={useArrowKeysNavigation}>
    <button data-focus-on-arrow-nav>Tab 1</button>
    <button data-focus-on-arrow-nav>Tab 2</button>
    <button data-focus-on-arrow-nav>Tab 3</button>
  </ul>
);
```

---

## API

### `useArrowKeysNavigation(options)`

#### Parameters

- **options** (optional):  
  An object with the following properties:
  - `selector` (string):  
    CSS selector for vertically navigable elements.  
    **Default:** `"[data-focus-on-arrow-nav]"`
  - `selectorLeftRight` (string):  
    CSS selector for horizontally navigable elements.  
    **Default:** `"[data-focus-on-arrow-nav-left-right]"`
  - `disabled` (boolean):  
    If `true`, disables all keyboard navigation.  
    **Default:** `false`

#### Returns

An object containing:

- `ref`:  
  React ref to attach to the container element.
- `onKeyDown`:  
  Keyboard event handler for ArrowUp/ArrowDown navigation.
- `onArrowLeftRight`:  
  Keyboard event handler for ArrowLeft/ArrowRight navigation.

---

## How It Works

- **Vertical Navigation:**  
  Attach `onKeyDown` to your container. Elements matching the `selector` will be focusable with ArrowUp/ArrowDown keys.
- **Horizontal Navigation:**  
  Attach `onArrowLeftRight` to your container or elements. Elements matching the `selectorLeftRight` will be focusable with ArrowLeft/ArrowRight keys.
- **Focus Looping:**  
  Navigation wraps around when reaching the first or last element.

---

## Accessibility

- Ensures keyboard users can navigate between interactive elements.
- Only elements with `tabIndex !== -1` are considered focusable.

---

## Note

Some components already come with arrow key navigation implemented out of the box.  
For example:

- **FacetTabs**: supports left/right arrow navigation.
- **Modal**: supports top/down arrow navigation.

You do not need to use `useArrowKeysNavigation` with these components unless you want to override or extend their default behavior.

---
