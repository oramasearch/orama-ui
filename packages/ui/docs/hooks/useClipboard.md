# `useClipboard` Hook

A custom React hook for copying text to the clipboard.

> **Note:** This hook is used by the `ChatInteractions.CopyMessage` component to copy the chat assistant message.

## Usage

```tsx
import { useClipboard } from '../hooks/useClipboard'

function ExampleComponent() {
  const { copyToClipboard, copied, error } = useClipboard()

  return (
    <div>
      <button onClick={() => copyToClipboard('Hello world!')}>
        Copy "Hello world!"
      </button>
      {copied && <span>Copied: {copied}</span>}
      {error && <span>Error: {error.message}</span>}
    </div>
  )
}
```

## API

### Return Object

| Property         | Type                                 | Description                                      |
|------------------|--------------------------------------|--------------------------------------------------|
| `copyToClipboard`| `(message: string) => void`          | Copies the provided string to the clipboard.      |
| `copied`         | `string`                             | The last successfully copied string.              |
| `error`          | `Error \| null`                      | Error object if copying failed, otherwise `null`. |

## Example

```tsx
const { copyToClipboard, copied, error } = useClipboard()
copyToClipboard('Hello world!')
```

## Notes

- Uses the [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).
- If the Clipboard API is not supported, `error` will be set.