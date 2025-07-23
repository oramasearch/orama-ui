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

export const HorizontalTabsChatbox: React.FC = () => {
  const [chatTabs, setChatTabs] = useState(0)
  const [activeTab, setActiveTab] = useState<string | undefined>('chat-0')
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
    <div className='max-w-full mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Horizontal Tabs</h1>
      <Tabs.Wrapper defaultTab={activeTab} onTabChange={setActiveTab}>
        <div className='mb-4 flex flex-wrap gap-2'>
          {suggestedPrompts.map((prompt, idx) => (
            <Tabs.Trigger
              key={idx}
              type='button'
              onClick={() => setChatTabs(chatTabs + 1)}
              className='px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 border border-blue-200 transition'
              prompt={prompt}
              tabId={`chat-${chatTabs + 1}`}
            >
              {prompt}
            </Tabs.Trigger>
          ))}
        </div>
        <div className='border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[500px] bg-white max-w-full'>
          <div className='flex items-center justify-between w-full border-b border-gray-200'>
            <Tabs.List orientation='horizontal' className='w-full'>
              <div className='flex items-center justify-between px-4 py-2 w-full'>
                <Tabs.Counter>
                  {(count) => (
                    <span className='text-sm text-gray-500'>
                      {count} {count === 1 ? 'Chat' : 'Chats'}
                    </span>
                  )}
                </Tabs.Counter>
                <Tabs.Trigger
                  className='ml-4 inline-flex items-center gap-1 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded'
                  aria-label='Add new chat'
                  tabId={`chat-${chatTabs + 1}`}
                  onClick={() => setChatTabs(chatTabs + 1)}
                  data-focus-on-arrow-nav
                  data-focus-on-arrow-nav-left-right
                >
                  <PenBoxIcon className='w-4 h-4' />
                  New Chat
                </Tabs.Trigger>
              </div>
            </Tabs.List>
          </div>
          <div className='flex items-center space-x-1 w-full border-b border-gray-200'>
            <Tabs.DynamicList>
              {(item) => (
                <div className='flex items-center relative'>
                  <Tabs.Button
                    tabId={item.id}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap text-left focus:border-blue-600 focus:border-b-4 ${
                      activeTab === item.id
                        ? 'bg-white text-blue-600 border-b-4 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
                  <Tabs.Close tabId={item.id} />
                </div>
              )}
            </Tabs.DynamicList>
          </div>

          {/* Tab Contents */}
          <div className='flex-1 min-h-96 overflow-y-auto'>
            <Tabs.DynamicPanels>
              {(item, chatTabs, setChatTabs) => (
                <ChatRoot client={oramaDocsCollection}>
                  <Tabs.Panel tabId={item.id} className='h-full'>
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
                              <ChatInteractions.UserPrompt className='bg-gray-100 my-1 py-2 px-4 font-semibold rounded-lg'>
                                {interaction.query}
                              </ChatInteractions.UserPrompt>
                              <ChatInteractions.Loading
                                className='text-gray-500 text-sm'
                                interaction={interaction}
                              >
                                <div className='animate-pulse bg-gray-200 h-4 w-3/4 rounded' />
                              </ChatInteractions.Loading>
                              <ChatInteractions.AssistantMessage
                                markdownClassnames={{
                                  p: 'my-2',
                                  pre: 'rounded-md [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:my-3 [&_pre]:text-xs [&_pre]:whitespace-break-spaces wrap-break-word',
                                  code: 'bg-gray-200 p-1 rounded'
                                }}
                                className='py-1 px-4 bg-gray-200 rounded-lg'
                              >
                                {interaction.response}
                              </ChatInteractions.AssistantMessage>
                            </div>
                          )}
                        </ChatInteractions.Wrapper>
                      </div>

                      {/* BOTTOM BLOCK */}
                      <div className='bg-white rounded-b-md flex flex-col items-center justify-between relative'>
                        {showGoToBottomButton && (
                          <button
                            className='ml-2 px-2 py-1 bg-gray-800/60 text-white rounded text-sm absolute -top-8 right-4'
                            onClick={() => scrollToBottom()}
                          >
                            <ArrowDown className='w-4 h-4' />
                          </button>
                        )}
                        <PromptTextArea.Wrapper className='flex items-center gap-2 w-full p-3 border-t border-gray-200'>
                          <PromptTextArea.Field
                            rows={1}
                            id='prompt-input-2'
                            name='prompt-input-2'
                            placeholder='Ask something...'
                            className='flex-1 py-2 px-2 border border-gray-600 rounded-md'
                          />
                          <PromptTextArea.Button className='bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'>
                            Send
                          </PromptTextArea.Button>
                        </PromptTextArea.Wrapper>
                      </div>
                    </div>
                  </Tabs.Panel>
                </ChatRoot>
              )}
            </Tabs.DynamicPanels>
          </div>
        </div>
      </Tabs.Wrapper>
    </div>
  )
}
