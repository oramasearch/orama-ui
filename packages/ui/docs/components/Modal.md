# `Modal` component

The `Modal` component is a composable, accessible modal dialog for React. It provides keyboard navigation, focus trapping, and flexible composition via subcomponents.

---

## Usage

```tsx
import { Modal } from "@orama/ui/components";

function ExampleModal({ open, onClose }) {
  return (
    <Modal.Wrapper open={open} onModalClosed={onClose}>
      <Modal.Inner>
        <Modal.Close className="absolute top-4 right-4" />
        <Modal.Content>
          <h2>Modal Title</h2>
          <p>This is the modal content.</p>
        </Modal.Content>
      </Modal.Inner>
    </Modal.Wrapper>
  );
}
```

---

## API

### Modal.Wrapper

Wraps the modal and manages open/close state, focus, and accessibility.

**Props:**

| Name                  | Type         | Default | Description                       |
| --------------------- | ------------ | ------- | --------------------------------- |
| `open`                | `boolean`    | `false` | Whether the modal is open         |
| `onModalClosed`       | `() => void` |         | Callback when modal closes        |
| `closeOnEscape`       | `boolean`    | `true`  | Close modal on Escape key         |
| `closeOnOutsideClick` | `boolean`    | `true`  | Close modal on outside click      |
| `children`            | `ReactNode`  |         | Modal content                     |
| `className`           | `string`     |         | Additional classes for the dialog |

---

### Modal.Inner

Container for modal content. Handles arrow key navigation.

**Props:**

| Name        | Type        | Default | Description        |
| ----------- | ----------- | ------- | ------------------ |
| `className` | `string`    |         | Additional classes |
| `children`  | `ReactNode` |         | Content            |

---

### Modal.Content

Content area of the modal.

**Props:**

| Name        | Type        | Default | Description        |
| ----------- | ----------- | ------- | ------------------ |
| `className` | `string`    |         | Additional classes |
| `children`  | `ReactNode` |         | Content            |

---

### Modal.Close

Button to close the modal.

**Props:**

| Name        | Type        | Default | Description               |
| ----------- | ----------- | ------- | ------------------------- |
| `className` | `string`    |         | Additional classes        |
| `children`  | `ReactNode` | `"×"`   | Custom close icon or text |
| `asChild`   | `boolean`   |         | Render as child           |

---

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the modal
- Escape key and outside click can close the modal
- Focus returns to the previously active element on close

---
