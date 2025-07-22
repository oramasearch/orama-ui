import { useArrowKeysNavigation } from '../hooks'
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode
} from 'react'

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

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
}

interface TabsTriggerProps {
  tabId: string
  children: ReactNode
  className?: string
  disabled?: boolean
}

interface TabsPanelProps {
  tabId: string
  children: ReactNode
  className?: string
}

const TabsContext = createContext<TabsContextType | null>(null)

const useTabsContext = () => {
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

const TabsTrigger: React.FC<TabsTriggerProps> = ({
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

export const Tabs = {
  Wrapper: TabsWrapper,
  Trigger: TabsTrigger,
  List: TabsList,
  Panel: TabsPanel
}
