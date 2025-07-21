import { useArrowKeysNavigation } from '../hooks'
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode
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

export interface TabsButtonsListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
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
  const [activeTab, setActiveTabState] = useState<string>('')

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

const TabsButtonsList: React.FC<TabsButtonsListProps> = ({ children }) => {
  const { ref, onKeyDown } = useArrowKeysNavigation()

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    onKeyDown(event.nativeEvent)
  }
  return (
    <section ref={ref} onKeyDown={handleKeyDown}>
      {children}
    </section>
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
      // tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      aria-controls={`tabpanel-${tabId}`}
      id={`tab-${tabId}`}
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
    >
      {children}
    </div>
  )
}

export const Tabs = {
  Wrapper: TabsWrapper,
  Button: TabsButton,
  ButtonsList: TabsButtonsList,
  Content: TabsContent
}
