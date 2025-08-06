import { useState, useCallback } from "react";

/**
 * Custom React hook for copying text to the clipboard.
 *
 * @returns {UseClipboardReturn} An object containing:
 * - `copyToClipboard`: Function to copy a string to the clipboard.
 * - `copied`: The last successfully copied string.
 * - `error`: Error object if copying failed, otherwise `null`.
 *
 * @example
 * const { copyToClipboard, copied, error } = useClipboard();
 * copyToClipboard('Hello world!');
 */

export interface UseClipboardReturn {
  copyToClipboard: (message: string) => void;
  copied: string;
  error: Error | null;
}

export function useClipboard(): UseClipboardReturn {
  const [copied, setCopied] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = useCallback((message: string) => {
    setError(null);
    setCopied("");
    if (!navigator.clipboard) {
      setError(new Error("Clipboard API not supported"));
      return;
    }
    navigator.clipboard
      .writeText(message)
      .then(() => setCopied(message))
      .catch(() => setError(new Error("Failed to copy message to clipboard")));
  }, []);

  return { copyToClipboard, copied, error };
}
