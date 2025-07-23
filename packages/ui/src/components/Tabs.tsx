import { useArrowKeysNavigation, useChat } from '../hooks'
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode
} from 'react'

type ChatTabItem = {
  id: string
  label: string
  prompt?: string
  chatStatus?: 'idle' | 'active' | 'processing'
  icon?: React.ReactNode
  content?: React.ReactNode
  closable?: boolean
}

interface TabsContextType {
  activeTab: string
  setActiveTab: (tabId: string) => void
  registerTab: (tabId: string) => void
  unregisterTab: (tabId: string) => void
  tabs: string[]
  prompt?: string
  setPrompt?: (prompt: string | undefined) => void
  chatTabs?: ChatTabItem[]
  setChatTabs?: (chatTabs: ChatTabItem[]) => void
}

interface TabsWrapperProps {
  children: ReactNode
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
  chatTab?: ChatTabItem
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export interface TabsDynamicListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: (item: ChatTabItem) => ReactNode
  orientation?: 'horizontal' | 'vertical'
}

interface TabsButtonProps {
  tabId: string
  children: ReactNode
  className?: string
  disabled?: boolean
}

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tabId: string
  children: React.ReactNode
  className?: string
  prompt?: string
}

interface TabsPanelProps {
  tabId: string
  children: ReactNode
  className?: string
  askOptions?: Omit<AnswerConfig, 'query'>
}

interface TabsCounterProps {
  children: (count: number) => ReactNode
}
interface TabCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tabId: string
  children?: ReactNode
}

const TabsContext = createContext<TabsContextType | null>(null)

export const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs.Wrapper')
  }
  return context
}

const TabsWrapper: React.FC<TabsWrapperProps> = ({
  children,
  defaultTab,
  onTabChange,
  chatTab,
  className = ''
}) => {
  const [tabs, setTabs] = useState<string[]>([])
  const [activeTab, setActiveTabState] = useState<string>('')
  const [prompt, setPrompt] = useState<string | undefined>(undefined)
  const [chatTabs, setChatTabs] = useState<ChatTabItem[]>([])

  const registerTab = (tabId: string) => {
    setTabs((prev) => {
      if (!prev.includes(tabId)) {
        const newTabs = [...prev, tabId]
        if (!activeTab && newTabs.length === 1) {
          setActiveTabState(tabId)
        }
        return newTabs
      }
      return prev
    })
  }

  const unregisterTab = (tabId: string) => {
    setTabs((prev) => prev.filter((id) => id !== tabId))
  }

  const setActiveTab = (tabId: string) => {
    setActiveTabState(tabId)
    onTabChange?.(tabId)
  }

  const contextValue: TabsContextType = {
    activeTab,
    setActiveTab,
    registerTab,
    unregisterTab,
    setPrompt,
    prompt,
    chatTabs,
    setChatTabs,
    tabs
  }

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab])

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className} role='tabpanel'>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsCounter: React.FC<TabsCounterProps> = ({ children }) => {
  const { chatTabs } = useTabsContext()
  return <React.Fragment>{children(chatTabs?.length ?? 0)}</React.Fragment>
}

const TabsList: React.FC<TabsListProps> = ({
  children,
  orientation = 'vertical',
  ...rest
}) => {
  const { ref, onKeyDown, onArrowLeftRight } = useArrowKeysNavigation()
  const { setActiveTab } = useTabsContext()

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (orientation === 'vertical') {
      onKeyDown(event.nativeEvent)
    } else {
      onArrowLeftRight(event.nativeEvent)
    }

    const focusedTabID = event.currentTarget
      .querySelector(':focus')
      ?.getAttribute('id')
    if (focusedTabID) {
      setActiveTab(focusedTabID)
    }
  }

  return (
    <section ref={ref} onKeyDown={handleKeyDown} {...rest}>
      {children}
    </section>
  )
}

const TabsDynamicList: React.FC<TabsDynamicListProps> = ({
  children,
  orientation = 'vertical',
  ...rest
}) => {
  const { chatTabs } = useTabsContext()
  const { ref, onKeyDown, onArrowLeftRight } = useArrowKeysNavigation()
  const { setActiveTab } = useTabsContext()

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (orientation === 'vertical') {
      onKeyDown(event.nativeEvent)
    } else {
      onArrowLeftRight(event.nativeEvent)
    }

    const focusedTabID = event.currentTarget
      .querySelector(':focus')
      ?.getAttribute('id')
    if (focusedTabID) {
      setActiveTab(focusedTabID)
    }
  }

  if (!chatTabs) return null

  return (
    <section ref={ref} onKeyDown={handleKeyDown} {...rest}>
      {chatTabs.map((item) => (
        <React.Fragment key={item.id}>{children(item)}</React.Fragment>
      ))}
    </section>
  )
}

const TabsButton: React.FC<TabsButtonProps> = ({
  tabId,
  children,
  className = '',
  disabled = false
}) => {
  const { activeTab, setActiveTab, registerTab, unregisterTab } =
    useTabsContext()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    registerTab(tabId)
    return () => unregisterTab(tabId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId])

  const handleClick = () => {
    console.log('Button clicked:', tabId)
    if (!disabled) {
      setActiveTab(tabId)
    }
  }

  const isActive = activeTab === tabId

  return (
    <button
      ref={buttonRef}
      role='tab'
      tabIndex={!isActive ? -1 : undefined}
      aria-selected={isActive}
      aria-controls={`tabpanel-${tabId}`}
      id={tabId}
      onClick={handleClick}
      data-focus-on-arrow-nav-left-right
      data-focus-on-arrow-nav
      disabled={disabled}
      className={className}
      type='button'
    >
      {children}
    </button>
  )
}

const TabsClose: React.FC<TabCloseProps> = ({ tabId, children, ...rest }) => {
  const { setChatTabs, chatTabs, unregisterTab, activeTab, setActiveTab } =
    useTabsContext()
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    unregisterTab(tabId)
    setChatTabs?.(chatTabs?.filter((tab) => tab.id !== tabId) ?? [])
    if (activeTab === tabId && chatTabs && chatTabs.length > 1) {
      const nextTab = chatTabs.find((tab) => tab.id !== tabId)
      if (nextTab) setActiveTab(nextTab.id)
    }
  }
  return (
    <button
      type='button'
      onClick={handleClose}
      aria-label='Close tab'
      data-focus-on-arrow-nav-left-right
      data-focus-on-arrow-nav
      tabIndex={activeTab === tabId ? 0 : -1}
      {...rest}
    >
      {children ?? '×'}
    </button>
  )
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  tabId,
  children,
  className = '',
  disabled = false,
  onClick,
  prompt,
  ...rest
}) => {
  const { registerTab, setPrompt, setActiveTab, setChatTabs, chatTabs } =
    useTabsContext()

  const handleNewChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!disabled) {
      registerTab(tabId)
      setActiveTab(tabId)
      setPrompt?.(prompt)

      if (setChatTabs) {
        const newChatTab: ChatTabItem = {
          id: tabId,
          label: prompt || 'Untitled',
          prompt,
          chatStatus: 'idle',
          closable: true
        }
        setChatTabs([...(chatTabs ?? []), newChatTab])
      }
    }
    onClick?.(e)
  }

  return (
    <button
      id={tabId}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        handleNewChat(e)
      }}
      data-focus-on-arrow-nav-left-right
      data-focus-on-arrow-nav
      disabled={disabled}
      className={className}
      type='button'
      {...rest}
    >
      {children}
    </button>
  )
}

const TabsPanel: React.FC<TabsPanelProps> = ({
  tabId,
  children,
  className = ''
}) => {
  const { activeTab } = useTabsContext()
  const isActive = activeTab === tabId

  if (!isActive) {
    return null
  }

  return (
    <div
      role='tabpanel'
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      className={className}
    >
      {children}
    </div>
  )
}

const TabsDynamicPanel: React.FC<TabsPanelProps> = ({
  tabId,
  children,
  askOptions = {},
  className = ''
}) => {
  const { activeTab, prompt, setPrompt } = useTabsContext()
  const { onAsk, dispatch } = useChat()
  const isActive = activeTab === tabId
  const processedPromptRef = React.useRef<string | undefined>(undefined)

  useEffect(() => {
    if (isActive && prompt && processedPromptRef.current !== prompt) {
      dispatch({ type: 'SET_USER_PROMPT', payload: { userPrompt: prompt } })
      if (onAsk) {
        onAsk({ query: prompt, ...askOptions })
      }
      setPrompt?.(undefined)
      dispatch({ type: 'CLEAR_USER_PROMPT' })
      processedPromptRef.current = prompt
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, isActive])

  if (!isActive) {
    return null
  }

  return (
    <div
      role='tabpanel'
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      className={className}
    >
      {children}
    </div>
  )
}

interface TabsDynamicPanelsProps {
  children: (
    item: ChatTabItem,
    chatTabs?: ChatTabItem[],
    setChatTabs?: (tabs: ChatTabItem[]) => void
  ) => React.ReactNode
}

const TabsDynamicPanels: React.FC<TabsDynamicPanelsProps> = ({ children }) => {
  const { chatTabs, setChatTabs } = useTabsContext()

  if (!chatTabs) return null
  return (
    <>
      {chatTabs.map((item) => (
        <React.Fragment key={item.id}>
          {children(item, chatTabs, setChatTabs)}
        </React.Fragment>
      ))}
    </>
  )
}

export const Tabs = {
  Wrapper: TabsWrapper,
  Button: TabsButton,
  Close: TabsClose,
  Trigger: TabsTrigger,
  List: TabsList,
  DynamicList: TabsDynamicList,
  DynamicPanels: TabsDynamicPanels,
  Panel: TabsPanel,
  DynamicPanel: TabsDynamicPanel,
  Counter: TabsCounter
}
