import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
  KeyboardEvent
} from 'react'

// Types
interface TabsContextType {
  activeTab: string
  setActiveTab: (tabId: string) => void
  registerTab: (tabId: string) => void
  unregisterTab: (tabId: string) => void
  tabs: string[]
}

interface TabsWrapperProps {
  children: ReactNode
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

interface TabsButtonProps {
  tabId: string
  children: ReactNode
  className?: string
  disabled?: boolean
}

interface TabsContentProps {
  tabId: string
  children: ReactNode
  className?: string
}

// Context
const TabsContext = createContext<TabsContextType | null>(null)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs.Wrapper')
  }
  return context
}

// Wrapper Component
const TabsWrapper: React.FC<TabsWrapperProps> = ({
  children,
  defaultTab,
  onTabChange,
  className = ''
}) => {
  const [tabs, setTabs] = useState<string[]>([])
  const [activeTab, setActiveTabState] = useState<string>(defaultTab || '')

  const registerTab = (tabId: string) => {
    setTabs((prev) => {
      if (!prev.includes(tabId)) {
        const newTabs = [...prev, tabId]
        // Set first tab as active if no active tab is set
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
    tabs
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className} role='tabpanel'>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// Button Component
const TabsButton: React.FC<TabsButtonProps> = ({
  tabId,
  children,
  className = '',
  disabled = false
}) => {
  const { activeTab, setActiveTab, registerTab, unregisterTab, tabs } =
    useTabsContext()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    registerTab(tabId)
    return () => unregisterTab(tabId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId])

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = tabs.indexOf(tabId)
    let nextIndex: number

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
        setActiveTab(tabs[nextIndex]!)
        break
      case 'ArrowRight':
        e.preventDefault()
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
        setActiveTab(tabs[nextIndex]!)
        break
      case 'Home':
        e.preventDefault()
        setActiveTab(tabs[0]!)
        break
      case 'End':
        e.preventDefault()
        setActiveTab(tabs[tabs.length - 1]!)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!disabled) {
          setActiveTab(tabId)
        }
        break
    }
  }

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(tabId)
    }
  }

  const isActive = activeTab === tabId

  return (
    <button
      ref={buttonRef}
      role='tab'
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      aria-controls={`tabpanel-${tabId}`}
      id={`tab-${tabId}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={className}
      type='button'
    >
      {children}
    </button>
  )
}

// Content Component
const TabsContent: React.FC<TabsContentProps> = ({
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
      tabIndex={0}
    >
      {children}
    </div>
  )
}

export const Tabs = {
  Wrapper: TabsWrapper,
  Button: TabsButton,
  Content: TabsContent
}
