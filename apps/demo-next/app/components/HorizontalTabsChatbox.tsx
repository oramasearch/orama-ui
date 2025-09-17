'use client'
import { useState } from 'react'
import {
  ChatInteractions,
  ChatRoot,
  PromptTextArea,
  Tabs
} from '@orama/ui/components'
import { ArrowDown, PenBoxIcon, X } from 'lucide-react'
import { oramaDocsCollection } from '@/data'
import { useScrollableContainer } from '@orama/ui/hooks'
import { Interaction } from '@orama/core'
import { getThemeClasses } from '@/lib/utils'

export const HorizontalTabsChatbox: React.FC = () => {
  const [tabID, setTabID] = useState(0)
  const [activeTab, setActiveTab] = useState<string | undefined>('chat-0')
  const [theme, setTheme] = useState('modern')
  const themeClasses = getThemeClasses(theme)
  const {
    containerRef,
    showGoToBottomButton,
    scrollToBottom,
    recalculateGoToBottomButton
  } = useScrollableContainer()

  const suggestedPrompts = [
    'What is Orama?',
    'How do I use the search API?',
    'Show me an example of a chat integration.',
    'What are the main features?',
    'How do I customize the UI?'
  ]

  return (
    <div className={`max-w-full mx-auto p-6 ${themeClasses.wrapper}`}>
      <div className='flex items-center justify-between mb-6'>
        <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
          Horizontal Tabs
        </h1>
        <div className={themeClasses.text}>
          <label htmlFor='theme-select' className='mr-2 text-sm font-medium'>
            Theme:
          </label>
          <select
            id='theme-select'
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`border rounded px-2 py-1 text-sm ${themeClasses.input}`}
          >
            <option value='modern'>Modern</option>
            <option value='dark'>Dark</option>
            <option value='playful'>Playful</option>
          </select>
        </div>
      </div>
      <Tabs.Wrapper
        defaultTab={activeTab}
        onTabChange={setActiveTab}
        orientation='horizontal'
        className={themeClasses.wrapper}
      >
        <div className='mb-4 flex flex-wrap gap-2'>
          {suggestedPrompts.map((prompt, idx) => (
            <Tabs.Trigger
              key={idx}
              type='button'
              onClick={() => setTabID(tabID + 1 + idx)}
              className={`px-3 py-1 rounded-full text-sm transition ${themeClasses.promptButton}`}
              prompt={prompt}
              tabId={`chat-${tabID + 1 + idx}`}
            >
              {prompt}
            </Tabs.Trigger>
          ))}
        </div>
        <div
          className={`overflow-hidden flex flex-col h-[500px] max-w-full ${themeClasses.container}`}
        >
          <div className='flex items-center justify-between w-full border-b border-gray-500'>
            <Tabs.List className='w-full'>
              <div className='flex items-center justify-between px-4 py-2 w-full'>
                <Tabs.Counter>
                  {(count) => (
                    <span className={`text-sm ${themeClasses.text}`}>
                      {count} {count === 1 ? 'Chat' : 'Chats'}
                    </span>
                  )}
                </Tabs.Counter>
                <Tabs.Trigger
                  className={`ml-4 inline-flex items-center gap-1 p-2 text-sm rounded ${themeClasses.promptButton}`}
                  aria-label='Add new chat'
                  tabId={`chat-${tabID + 1}`}
                  onClick={() => setTabID(tabID + 1)}
                  data-focus-on-arrow-nav
                  data-focus-on-arrow-nav-left-right
                >
                  <PenBoxIcon className='w-4 h-4' />
                  New Chat
                </Tabs.Trigger>
              </div>
            </Tabs.List>
          </div>
          <div className='flex items-center space-x-1 w-full'>
            <Tabs.DynamicList className='inline-flex overflow-x-auto w-full border-b border-gray-500 empty:hidden'>
              {(item) => (
                <div className='flex items-center relative'>
                  <Tabs.Button
                    tabId={item.id}
                    className={`px-4 py-2 pr-8 text-sm font-medium whitespace-nowrap text-left focus:border-b-4 ${
                      activeTab === item.id
                        ? `${themeClasses.categorySelected} border-b-4`
                        : `${themeClasses.category}`
                    }`}
                  >
                    <span className='truncate max-w-[120px] block'>
                      {item.prompt
                        ? item.prompt.length > 20
                          ? `${item.prompt.slice(0, 20)}...`
                          : item.prompt
                        : item.label}
                    </span>
                  </Tabs.Button>
                  <Tabs.Close
                    tabId={item.id}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${themeClasses.closeButton}`}
                  >
                    <X className='w-3 h-3' />
                  </Tabs.Close>
                </div>
              )}
            </Tabs.DynamicList>
          </div>

          {/* Tab Contents */}
          <div
            className={`flex-1 min-h-96 overflow-y-auto ${themeClasses.resultsContainer}`}
          >
            <Tabs.DynamicPanels>
              {(item, chatTabs, setChatTabs) => (
                <ChatRoot client={oramaDocsCollection}>
                  <Tabs.DynamicPanel tabId={item.id} className='h-full'>
                    <div className='flex flex-col h-full'>
                      {/* SCROLLABLE BLOCK */}
                      <div
                        ref={containerRef}
                        className='flex-1 overflow-y-auto'
                      >
                        <ChatInteractions.Wrapper
                          onScroll={recalculateGoToBottomButton}
                          onStreaming={recalculateGoToBottomButton}
                          onNewInteraction={(interaction: Interaction) => {
                            scrollToBottom({ animated: true })
                            if (
                              !chatTabs?.find((chat) => chat.id === item.id)
                                ?.prompt
                            ) {
                              if (typeof setChatTabs === 'function') {
                                setChatTabs([
                                  ...(chatTabs ?? []).map((chat) =>
                                    chat.id === item.id
                                      ? { ...item, prompt: interaction.query }
                                      : chat
                                  )
                                ])
                              }
                            }
                          }}
                        >
                          {(interaction) => (
                            <div
                              key={interaction.id}
                              className='p-4 flex flex-col gap-2'
                            >
                              <ChatInteractions.UserPrompt
                                className={themeClasses.userPrompt}
                              >
                                {interaction.query}
                              </ChatInteractions.UserPrompt>
                              <ChatInteractions.Loading
                                className={themeClasses.resultContent}
                                interaction={interaction}
                              >
                                <div className='animate-pulse h-4 w-3/4 rounded' />
                              </ChatInteractions.Loading>
                              <ChatInteractions.AssistantMessage
                                markdownClassnames={{
                                  p: 'my-2',
                                  pre: 'rounded-md [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:my-3 [&_pre]:text-xs [&_pre]:whitespace-break-spaces wrap-break-word',
                                  code: 'p-1 rounded'
                                }}
                                className={themeClasses.assistantMessage}
                              >
                                {interaction.response}
                              </ChatInteractions.AssistantMessage>
                            </div>
                          )}
                        </ChatInteractions.Wrapper>
                      </div>

                      {/* BOTTOM BLOCK */}
                      <div
                        className={`rounded-b-md flex flex-col items-center justify-between relative`}
                      >
                        {showGoToBottomButton && (
                          <button
                            className={`ml-2 px-2 py-1 rounded text-sm absolute -top-8 right-4 [&_svg]:text-current ${themeClasses.closeButton}`}
                            onClick={() => scrollToBottom()}
                          >
                            <ArrowDown className='w-5 h-5' />
                          </button>
                        )}
                        <PromptTextArea.Wrapper
                          className={`flex items-center gap-2 w-full p-3`}
                        >
                          <PromptTextArea.Field
                            rows={1}
                            id='prompt-input-2'
                            name='prompt-input-2'
                            placeholder='Ask something...'
                            className={`flex-1 py-2 px-2 border focus:outline-none ${themeClasses.input}`}
                            autoFocus
                          />
                          <PromptTextArea.Button
                            className={`py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.promptButton}`}
                          >
                            Send
                          </PromptTextArea.Button>
                        </PromptTextArea.Wrapper>
                      </div>
                    </div>
                  </Tabs.DynamicPanel>
                </ChatRoot>
              )}
            </Tabs.DynamicPanels>
          </div>
        </div>
      </Tabs.Wrapper>
    </div>
  )
}
