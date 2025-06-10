import React, {
  useRef,
  ChangeEvent,
  ElementType,
  useReducer,
} from 'react'
import { PolymorphicComponentProps } from '@/types'
import { SearchContext, SearchDispatchContext, searchReducer, useSearchContext } from '../context/SearchContext'
import useSearch from '../hooks/useSearch'
import { CollectionManager, SearchParams } from '@orama/core'

export interface SearchRootProps extends React.PropsWithChildren {
  /**
   * The Orama client instance to be used for search operations.
   * If not provided, it will use the client from the SearchContext.
   */
  client?: CollectionManager
}

export const SearchRoot = ({ client, children }: SearchRootProps) => {
  const searchState = useSearchContext()
  const [state, dispatch] = useReducer(searchReducer, {
    ...searchState,
    client: client || searchState.client,
  })

  return (
    <SearchContext value={state}>
      <SearchDispatchContext value={dispatch}>
        {children}
      </SearchDispatchContext>
    </SearchContext>
  )
}

interface SearchInputWrapperOwnProps {
  className?: string
}

export type SearchInputWrapperProps<T extends ElementType = 'div'> =
  PolymorphicComponentProps<T, SearchInputWrapperOwnProps>

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
export const SearchInputWrapper = <T extends ElementType = 'div'>({
  client,
  children,
  className = '',
  as,
  ...props
}: SearchInputWrapperProps<T>) => {

  const Component = as || 'div'
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * The `id` attribute for the input field.
   * If not provided, a unique ID will be generated.
   */
  inputId?: string
  /**
   * Placeholder text for the input field.
   * @default 'Search...'
   */
  placeholder?: string
  /**
   * Callback function that is called when the input value changes.
   * It receives the new value as an argument.
   */
  onValueChange?: (value: string) => void
  /**
   * Aria label for accessibility purposes.
   */
  ariaLabel?: string
  /**
   * Optional class name for custom styling of the input field.
   */
  className?: string
  /**
   * Search parameters to be used for the search operation.
   * This can include filters, grouping, etc.
   * Get them from Orama
   */
  searchParams?: SearchParams
} 


export const SearchInputField: React.FC<SearchInputProps> = ({
  inputId,
  placeholder = 'Search...',
  ariaLabel,
  className,
  searchParams,
  ...rest
}) => {
  const { onSearch } = useSearch()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const generatedId = useRef<string>(
    `search-input-${Math.random().toString(36).substring(2, 9)}`
  )
  const currentInputId = inputId || generatedId.current

  /**
   * Handles the change event of the input field.
   * Updates the internal state and calls the onValueChange callback.
   * @param event The input change event.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value

    onSearch({
      term: newValue,
      limit: 10, // You can adjust the limit as needed
      groupBy: 'category' // Adjust the grouping as needed
      // TODO: pass searchParams to customize the search further
    })

    rest.onChange?.(event)

    // const valueChangeEvent = new CustomEvent('search:user-prompt-changed', {
    //   detail: {
    //     value: newValue,
    //     timestamp: new Date().toISOString()
    //   }
    // })
    // document.dispatchEvent(valueChangeEvent)
  }

  return (
    <input
      type='search'
      id={currentInputId}
      ref={inputRef}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={className}
      {...rest}
    />
  )
}

export type SearchInputLabelProps = {
  /**
   * The `htmlFor` attribute associates the label with the input element.
   * If not provided, it defaults to an empty string.
   */
  htmlFor?: string
  /**
   * The content of the label.
   * This is the text that will be displayed alongside the input field.
   */
  children?: React.ReactNode
  /**
   * Optional class name for the label element.
   * This allows for custom styling of the label.
   * @default ''
   * */
  className?: string
  /**
   * The HTML element type to render the label as.
   * Defaults to 'label', but can be overridden to any valid React element type.
   */
  as?: React.ElementType
}

export const SearchInputLabel: React.FC<SearchInputLabelProps> = ({
  htmlFor = '',
  children,
  className,
  as = 'label'
}) => {
  const Component = as
  return (
    <Component htmlFor={htmlFor} className={className}>
      {children}
    </Component>
  )
}

const SearchInput = {
  Input: SearchInputField,
  Label: SearchInputLabel,
  Wrapper: SearchInputWrapper
}

export default SearchInput