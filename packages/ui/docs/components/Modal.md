# `Modal` component

The `Modal` component is a composable, accessible modal dialog for React. It provides keyboard navigation, focus trapping, and flexible composition via subcomponents.

---

## Usage

### With Modal.Root

```tsx
import { Modal } from "@orama/ui/components";

// Basic usage with Modal.Trigger
function ExampleModal() {
  return (
    <Modal.Root>
      <Modal.Trigger>Open Modal</Modal.Trigger>
      <Modal.Wrapper>
        <Modal.Inner>
          <Modal.Close className="absolute top-4 right-4" />
          <Modal.Content>
            <h2>Modal Title</h2>
            <p>This is the modal content.</p>
          </Modal.Content>
        </Modal.Inner>
      </Modal.Wrapper>
    </Modal.Root>
  );
}

// With custom trigger button
function CustomTriggerModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Custom Trigger</button>
      <Modal.Wrapper open={open} onModalClosed={() => setOpen(false)}>
        <Modal.Inner>
          <Modal.Close className="absolute top-4 right-4" />
          <Modal.Content>
            <h2>Modal Title</h2>
            <p>This is the modal content.</p>
          </Modal.Content>
        </Modal.Inner>
      </Modal.Wrapper>
    </>
  );
}
```

---

## API

### Modal.Root

Provider component that manages modal state and provides context for child components.

**Props:**

| Name          | Type        | Default | Description                       |
| ------------- | ----------- | ------- | --------------------------------- |
| `defaultOpen` | `boolean`   | `false` | Initial open state (uncontrolled) |
| `children`    | `ReactNode` |         | Modal components                  |

### Modal.Trigger

Button component that opens the modal. Must be used within `Modal.Root`.

**Props:**

| Name         | Type                                      | Default | Description                     |
| ------------ | ----------------------------------------- | ------- | ------------------------------- |
| `enableCmdK` | `boolean`                                 | `false` | Enable Cmd/Ctrl+K to open modal |
| `className`  | `string`                                  |         | Additional classes              |
| `children`   | `ReactNode`                               |         | Button content                  |
| `onClick`    | `(event: MouseEvent) => void`             |         | Additional click handler        |
| `onKeyDown`  | `(event: KeyboardEvent) => void`          |         | Additional keydown handler      |
| `...rest`    | `ButtonHTMLAttributes<HTMLButtonElement>` |         | All other button props          |

### Modal.Wrapper

Wraps the modal and manages open/close state, focus, and accessibility.

**Props:**

| Name                  | Type         | Default | Description                                   |
| --------------------- | ------------ | ------- | --------------------------------------------- |
| `open`                | `boolean`    | `false` | Whether the modal is open (legacy mode only)  |
| `onModalClosed`       | `() => void` |         | Callback when modal closes (legacy mode only) |
| `closeOnEscape`       | `boolean`    | `true`  | Close modal on Escape key                     |
| `closeOnOutsideClick` | `boolean`    | `true`  | Close modal on outside click                  |
| `children`            | `ReactNode`  |         | Modal content                                 |
| `className`           | `string`     |         | Additional classes for the dialog             |

**Note:** When used within `Modal.Root`, the `open` and `onModalClosed` props are ignored as the state is managed by the Root component.

### Modal.Inner

Container for modal content. Handles arrow key navigation.

**Props:**

| Name        | Type        | Default | Description        |
| ----------- | ----------- | ------- | ------------------ |
| `className` | `string`    |         | Additional classes |
| `children`  | `ReactNode` |         | Content            |

### Modal.Content

Content area of the modal.

**Props:**

| Name        | Type        | Default | Description        |
| ----------- | ----------- | ------- | ------------------ |
| `className` | `string`    |         | Additional classes |
| `children`  | `ReactNode` |         | Content            |

### Modal.Close

Button to close the modal.

**Props:**

| Name        | Type        | Default | Description               |
| ----------- | ----------- | ------- | ------------------------- |
| `className` | `string`    |         | Additional classes        |
| `children`  | `ReactNode` | `"×"`   | Custom close icon or text |

---

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the modal
- Escape key and outside click can close the modal
- Focus returns to the previously active element on close
- Supports keyboard navigation with Tab and arrow keys
- Cmd/Ctrl+K shortcut support via `enableCmdK` prop on `Modal.Trigger`

---
