'use client'
import { useState } from 'react'
import {
  ChatInteractions,
  ChatRoot,
  PromptTextArea,
  Tabs
} from '@orama/ui/components'
import { ArrowDown, Pen, PenBoxIcon } from 'lucide-react'
import { oramaDocsCollection } from '@/data'
import { useScrollableContainer } from '@orama/ui/hooks/useScrollableContainer'
import { Interaction } from '@orama/core'

type ChatTabItem = {
  id: string
  label: string
  prompt?: string
  chatStatus?: 'idle' | 'active' | 'processing'
  icon?: React.ReactNode
  content?: React.ReactNode
  closable?: boolean
}

export const TabsChatbox: React.FC = () => {
  const [chatTabs, setChatTabs] = useState(0)
  const [itemsWithChat, setItemsWithChat] = useState<ChatTabItem[]>([
    {
      id: 'tab-0',
      label: 'Untitled',
      prompt: undefined,
      closable: true,
      content: undefined,
      chatStatus: 'idle'
    }
  ])
  const [activeTab, setActiveTab] = useState<string | undefined>('tab-0')
  const {
    containerRef,
    showGoToBottomButton,
    scrollToBottom,
    recalculateGoToBottomButton
  } = useScrollableContainer()

  const addNewChat = () => {
    const newId = `tab-${chatTabs + 1}`
    const newChat: ChatTabItem = {
      id: newId,
      label: 'Untitled',
      prompt: undefined,
      closable: true,
      chatStatus: 'idle'
    }
    setItemsWithChat((prev) => [...prev, newChat])
    setChatTabs(chatTabs + 1)
    setActiveTab(newId)
  }

  const removeChat = (chatId: string) => {
    setItemsWithChat((prev) => {
      const filtered = prev.filter((chat) => chat.id !== chatId)
      if (chatId === activeTab && filtered.length > 0) {
        setActiveTab(filtered[0]?.id)
      }
      return filtered
    })
  }

  return (
    <div className='max-w-full mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Chat Tabs Demo</h1>
      <Tabs.Wrapper
        defaultTab={activeTab}
        onTabChange={setActiveTab}
        className='border border-gray-200 rounded-lg overflow-hidden flex h-[500px] bg-white'
      >
        {/* Vertical Tab List */}
        <div
          role='tablist'
          className='flex flex-col w-52 bg-gray-50 border-r border-gray-200 overflow-y-auto'
          aria-label='Chat conversations'
        >
          <div className='flex items-center justify-between px-4 py-2 border-b border-gray-200'>
            <span className='flex-1 text-sm text-gray-500'>
              {itemsWithChat.length} Chats
            </span>
            {/* style as a button with  */}
            <button
              onClick={addNewChat}
              className='inline-flex items-center gap-1 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100'
              aria-label='Add new chat'
            >
              <PenBoxIcon className='w-4 h-4' />
              New Chat
            </button>
          </div>
          <div className='space-y-1 flex flex-col-reverse'>
            {itemsWithChat.map((chat) => (
              <div key={chat.id} className='flex items-center'>
                <Tabs.Button
                  tabId={chat.id}
                  className={`w-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors text-left focus:outline-none ${
                    activeTab === chat.id
                      ? 'bg-white text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {chat.prompt || chat.label}
                </Tabs.Button>
                {itemsWithChat.length > 1 && (
                  <button
                    onClick={() => removeChat(chat.id)}
                    className='ml-1 p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded'
                    aria-label={`Close ${chat.prompt}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className='flex-1 min-h-96 overflow-y-auto'>
          {itemsWithChat.map((chat) => (
            <ChatRoot client={oramaDocsCollection} key={chat.id}>
              <Tabs.Content tabId={chat.id} className='h-full'>
                <div className='flex flex-col h-full'>
                  {/* SCROLLABLE BLOCK */}
                  <div ref={containerRef} className='flex-1 overflow-y-auto'>
                    <ChatInteractions.Wrapper
                      onScroll={recalculateGoToBottomButton}
                      onStreaming={recalculateGoToBottomButton}
                      onNewInteraction={(interaction: Interaction) => {
                        scrollToBottom({ animated: true })
                        if (
                          !itemsWithChat.find((item) => item.id === chat.id)
                            ?.prompt
                        ) {
                          setItemsWithChat((prev) =>
                            prev.map((item) =>
                              item.id === chat.id
                                ? { ...item, prompt: interaction.query }
                                : item
                            )
                          )
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
                    {/* {showGoToBottomButton && (
                      <button
                        className='ml-2 px-3 py-1 bg-gray-800/70 text-white rounded text-sm absolute -top-10 right-4'
                        onClick={() => scrollToBottom()}
                      >
                        <ArrowDown className='w-4 h-4' />
                      </button>
                    )} */}
                    <PromptTextArea.Wrapper className='flex items-center gap-2 w-full p-3 border-t border-gray-200'>
                      <PromptTextArea.Field
                        rows={1}
                        placeholder='Ask something...'
                        className='flex-1 py-2 px-2 border border-gray-600 rounded-md'
                      />
                      <PromptTextArea.Button className='bg-black text-white py-2 px-4 rounded-md'>
                        Send
                      </PromptTextArea.Button>
                    </PromptTextArea.Wrapper>
                  </div>
                </div>
              </Tabs.Content>
            </ChatRoot>
          ))}
        </div>
      </Tabs.Wrapper>
    </div>
  )
}
