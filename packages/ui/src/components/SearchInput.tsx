import React, { useRef, ChangeEvent, ElementType } from "react";
import { PolymorphicComponentProps } from "@/types";
import { useSearch } from "../hooks";
import { SearchParams } from "@orama/core";

interface SearchInputWrapperOwnProps {
  className?: string;
}

export type SearchInputWrapperProps<T extends ElementType = "div"> =
  PolymorphicComponentProps<T, SearchInputWrapperOwnProps>;

/**
 * A wrapper component for the search input field.
 * It allows for custom styling and structure around the search input.
 * This component can be used to group the search input with its label and any additional elements.
 * @example
 * ```tsx
 * <SearchInput.Wrapper className="search-input-wrapper">
 *   <SearchInput.Label htmlFor="search-input">Search</SearchInput.Label>
 *   <SearchInput.Field
 *     inputId="search-input"
 *     placeholder="Search..."
 *     onValueChange={(value) => console.log(value)}
 *   />
 * </SearchInput.Wrapper>
 * ```
 * @param className Optional class name for custom styling.
 * @param as The HTML element type to render the wrapper as. Defaults to 'div'.
 * @param children The content to be wrapped, typically including the label and input field.
 */
export const SearchInputWrapper = <T extends ElementType = "div">({
  children,
  className = "",
  as,
  ...props
}: SearchInputWrapperProps<T>) => {
  const Component = as || "div";
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
  /**
   * The `id` attribute for the input field.
   * If not provided, a unique ID will be generated.
   */
  inputId?: string;
  /**
   * Placeholder text for the input field.
   * @default 'Search...'
   */
  placeholder?: string;
  /**
   * Callback function that is called when the input value changes.
   * It receives the new value as an argument.
   */
  onValueChange?: (value: string) => void;
  /**
   * Aria label for accessibility purposes.
   */
  ariaLabel?: string;
  /**
   * Optional class name for custom styling of the input field.
   */
  className?: string;
  /**
   * Search parameters to be used for the search operation.
   * This can include filters, grouping, etc.
   * Get them from Orama
   */
  searchParams?: Omit<SearchParams, "term"> & {
    groupBy?: string;
    filterBy?: Record<string, string>[];
  };
}

export const SearchInputField: React.FC<SearchInputProps> = ({
  inputId,
  placeholder = "Search...",
  ariaLabel,
  className,
  searchParams,
  ref,
  ...rest
}) => {
  const { onSearch, onReset } = useSearch();
  const internalRef = useRef<HTMLInputElement | null>(null);
  const inputRef = ref || internalRef;

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
    const newValue = event.target.value.trim();

    if (newValue === "") {
      onReset();
      return;
    }

    onSearch({
      term: newValue,
      limit: 10,
      ...searchParams,
    });

    rest.onChange?.(event);
  };

  return (
    <input
      type="search"
      id={currentInputId}
      ref={inputRef}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={className}
      data-focus-on-arrow-nav
      {...rest}
    />
  );
};

export interface SearchInputLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Optional class name for the label element.
   * This allows for custom styling of the label.
   * @default ''
   * */
  className?: string;
  /**
   * The HTML element type to render the label as.
   * Defaults to 'label', but can be overridden to any valid React element type.
   */
  as?: React.ElementType;
}

export const SearchInputLabel: React.FC<SearchInputLabelProps> = ({
  children,
  className,
  as = "label",
  ...props
}) => {
  const Component = as;
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export const SearchInput = {
  Input: SearchInputField,
  Label: SearchInputLabel,
  Wrapper: SearchInputWrapper,
};
