import React, { useState, useRef, ChangeEvent } from "react";

/**
 * Props for the SearchInput component.
 */
interface SearchInputProps {
  /**
   * Optional unique identifier for the input element.
   * If not provided, a random ID will be generated.
   * Useful for associating the label explicitly.
   */
  inputId?: string;
  /**
   * Optional visible label text for the search input.
   * It's recommended to provide either a `label` or an `ariaLabel` for accessibility.
   */
  label?: string;
  /**
   * Placeholder text for the search input.
   * @default 'Search...'
   */
  placeholder?: string;
  /**
   * Optional icon to display before the input field.
   * Can be any renderable React node (e.g., an SVG component, an image).
   */
  icon?: React.ReactNode;
  /**
   * Callback function that is invoked when the search input's value changes.
   * Receives the new input value as its only argument.
   * @param value The current value of the search input.
   */
  onValueChange?: (value: string) => void;
  /**
   * Optional ARIA label for the search input.
   * Crucial for accessibility, especially if a visible `label` is not provided.
   * If not provided, and `label` is present, `label` will be used as `aria-label`.
   */
  ariaLabel?: string;
  /**
   * Optional class name for the main container div.
   */
  containerClassName?: string;
  /**
   * Optional class name for the label element.
   */
  labelClassName?: string;
  /**
   * Optional class name for the div wrapping the icon, input, and reset button.
   */
  wrapperClassName?: string;
  /**
   * Optional class name for the icon span.
   */
  iconClassName?: string;
  /**
   * Optional class name for the input element.
   */
  inputClassName?: string;
  /**
   * Optional class name for the reset button.
   */
  resetButtonClassName?: string;
  /**
   * Text or ReactNode for the reset button.
   * @default '&times;' (a multiplication X)
   */
  resetButtonContent?: React.ReactNode;
}

/**
 * A flexible and accessible unstyled search input component.
 *
 * It allows for a leading icon, a clear/reset button, and emits an event
 * when its value changes. Styling is left to the consumer via CSS classes.
 *
 * @example
 * ```tsx
 * <SearchInput
 * label="Search articles"
 * placeholder="Enter keywords..."
 * onValueChange={(term) => console.log(term)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * import { FaSearch } from 'react-icons/fa'; // Example icon
 *
 * <SearchInput
 * icon={<FaSearch />}
 * ariaLabel="Search products" // Important if no visible label
 * onValueChange={(term) => performSearch(term)}
 * />
 * ```
 */
const SearchInput: React.FC<SearchInputProps> = ({
  inputId,
  label,
  placeholder = "Search...",
  icon,
  onValueChange,
  ariaLabel,
  containerClassName,
  labelClassName,
  wrapperClassName,
  iconClassName,
  inputClassName,
  resetButtonClassName,
  resetButtonContent = <>&times;</>, // Default to HTML entity for 'X'
}) => {
  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const generatedId = useRef<string>(
    `search-input-${Math.random().toString(36).substring(2, 9)}`,
  );
  const currentInputId = inputId || generatedId.current;

  /**
   * Handles the change event of the input field.
   * Updates the internal state and calls the onValueChange callback.
   * @param event The input change event.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    setValue(newValue);

    const valueChangeEvent = new CustomEvent("search:user-prompt-changed", {
      detail: {
        value: newValue,
        timestamp: new Date().toISOString(),
      },
    });
    document.dispatchEvent(valueChangeEvent);

    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  /**
   * Handles the click event of the reset button.
   * Clears the input field, calls the onValueChange callback with an empty string,
   * and focuses the input field.
   */
  const handleReset = (): void => {
    setValue("");
    if (onValueChange) {
      onValueChange("");
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const effectiveAriaLabel = ariaLabel || label;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={currentInputId} className={labelClassName}>
          {label}
        </label>
      )}
      <div className={wrapperClassName}>
        {icon && (
          <span className={iconClassName} aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          type="search"
          id={currentInputId}
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={effectiveAriaLabel}
          className={inputClassName}
        />
        {value && (
          <button
            type="button"
            onClick={handleReset}
            aria-label="Clear search input"
            className={resetButtonClassName}
          >
            {resetButtonContent}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
