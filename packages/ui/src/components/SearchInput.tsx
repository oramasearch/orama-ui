import React, {
  useRef,
  ChangeEvent,
  ElementType,
  createContext,
  useContext
} from 'react'
import { PolymorphicComponentProps } from '@/types'
import { useSearch } from '../hooks'
import { SearchParams } from '@orama/core'

type SearchMode = 'search' | 'nlp'

const SearchInputContext = createContext<SearchMode | null>(null)

const useSearchInputContext = () => {
  const context = useContext(SearchInputContext)
  if (!context) {
    throw new Error(
      'SearchInput components must be used within a SearchInput.Provider'
    )
  }
  return context
}

interface SearchInputProviderProps {
  children: React.ReactNode
  mode?: SearchMode
}

export const SearchInputProvider = ({
  children,
  mode = 'search'
}: SearchInputProviderProps) => {
  return (
    <SearchInputContext.Provider value={mode}>
      {children}
    </SearchInputContext.Provider>
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
  children,
  className = '',
  as,
  ...props
}: SearchInputWrapperProps<T>) => {
  const Component = as || 'div'
  return (
    <Component className={className} {...props} role='search'>
      {children}
    </Component>
  )
}

interface SearchInputFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  /**
   * Optional class name for custom styling of the form.
   */
  className?: string
  /**
   * Search parameters to be used for the search operation when form is submitted.
   */
  searchParams?: Omit<SearchParams, 'term'> & {
    groupedBy?: string
    filterBy?: Record<string, string>[]
  }
  /**
   * Callback function for NLP search. Required when mode is 'nlp'.
   * Receives the search term and optional search parameters.
   */
  onNlpSearch?: (term: string, params?: any) => void
  /**
   * Custom callback function called when the form is submitted.
   * Receives the search term and the form event.
   */
  onSearch?: (
    searchTerm: string,
    event: React.FormEvent<HTMLFormElement>
  ) => void
}

/**
 * A form component for the search input field.
 * Handles form submission and triggers search or NLP search based on the current mode.
 * Must be used within a SearchInput.Provider to access the mode context.
 * @example
 * ```tsx
 * <SearchInput.Provider mode="nlp">
 *   <SearchInput.Form onNlpSearch={(term) => console.log('NLP:', term)}>
 *     <SearchInput.Input searchOnType={false} />
 *     <SearchInput.Submit>Search</SearchInput.Submit>
 *   </SearchInput.Form>
 * </SearchInput.Provider>
 * ```
 */
export const SearchInputForm = ({
  children,
  className = '',
  searchParams,
  onNlpSearch,
  onSearch,
  onSubmit,
  ...props
}: SearchInputFormProps) => {
  const mode = useSearchInputContext()
  const { search, NLPSearch, context, dispatch } = useSearch()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    dispatch({
      type: 'SET_RESULTS',
      payload: { results: [] }
    })
    dispatch({
      type: 'SET_NLP_RESULTS',
      payload: { results: [] }
    })
    dispatch({ type: 'SET_LOADING', payload: { loading: true } })
    dispatch({ type: 'SET_ERROR', payload: { error: null } })
    dispatch({ type: 'SET_NLP_LOADING', payload: { loading: true } })
    dispatch({ type: 'SET_NLP_ERROR', payload: { error: null } })

    const searchTerm =
      mode === 'nlp' ? context.nlpSearchTerm : context.searchTerm

    onSubmit?.(event)

    if (!searchTerm) {
      return
    }

    if (mode === 'nlp') {
      NLPSearch({ query: searchTerm, ...searchParams })

      if (onNlpSearch) {
        onNlpSearch(searchTerm, searchParams)
      }
    } else {
      search({
        term: searchTerm,
        limit: 10,
        ...searchParams,
        boost: searchParams?.boost ?? {}
      })

      if (onSearch) {
        onSearch(searchTerm, event)
      }
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  )
}

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>
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
  searchParams?: Omit<SearchParams, 'term'> & {
    groupedBy?: string
    filterBy?: Record<string, string>[]
  }
  /**
   * If true, the search will be triggered on each keystroke.
   * If false, the search will only be triggered on form submission.
   * @default true
   */
  searchOnType?: boolean
}

export const SearchInputField = ({
  inputId,
  placeholder = 'Search...',
  ariaLabel,
  className,
  searchOnType = true,
  searchParams,
  ref,
  onChange,
  ...rest
}: SearchInputProps) => {
  const { search, reset, dispatch } = useSearch()
  const internalRef = useRef<HTMLInputElement | null>(null)
  const inputRef = ref || internalRef

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
    onChange?.(event)

    const newValue = event.target.value.trim()

    if (!searchOnType || event.defaultPrevented) {
      dispatch({
        type: 'SET_SEARCH_TERM',
        payload: { searchTerm: newValue }
      })
      dispatch({
        type: 'SET_NLP_SEARCH_TERM',
        payload: { searchTerm: newValue }
      })
      return
    }

    if (newValue === '') {
      reset()
      return
    }

    search({
      term: newValue,
      limit: 10,
      ...searchParams,
      boost: searchParams?.boost ?? {}
    })
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
      data-focus-on-arrow-nav
      {...rest}
    />
  )
}

interface SearchInputLabelOwnProps {
  className?: string
}

export type SearchInputLabelProps<T extends ElementType = 'label'> =
  PolymorphicComponentProps<T, SearchInputLabelOwnProps>

export const SearchInputLabel = <T extends ElementType = 'label'>({
  children,
  className,
  as,
  ...props
}: SearchInputLabelProps<T>) => {
  const Component = as || 'label'

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

export interface SearchInputSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Optional class name for custom styling of the button.
   */
  className?: string
}

/**
 * A submit button component for the search form.
 * Triggers the form submission when clicked.
 * Should be used within a SearchInput.Form component.
 * @example
 * ```tsx
 * <SearchInput.Form>
 *   <SearchInput.Input searchOnType={false} />
 *   <SearchInput.Submit className="search-btn">
 *     Search
 *   </SearchInput.Submit>
 * </SearchInput.Form>
 * ```
 */
export const SearchInputSubmit = ({
  children,
  className = '',
  ...props
}: SearchInputSubmitProps) => {
  return (
    <button className={className} type='submit' {...props}>
      {children}
    </button>
  )
}

export const SearchInput = {
  Provider: SearchInputProvider,
  Wrapper: SearchInputWrapper,
  Form: SearchInputForm,
  Input: SearchInputField,
  Label: SearchInputLabel,
  Submit: SearchInputSubmit
}
