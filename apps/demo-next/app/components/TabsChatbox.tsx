'use client'
import { useState } from 'react'
import { Tabs } from '@orama/ui/components'

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
  const [itemsWithChat, setItemsWithChat] = useState<ChatTabItem[]>([])
  const [activeTab, setActiveTab] = useState<string | undefined>()

  const addNewChat = () => {
    const newId = `tab-${chatTabs + 1}`
    const newChat: ChatTabItem = {
      id: newId,
      label: 'Untitled',
      prompt: undefined,
      closable: true,
      chatStatus: 'idle'
    }
    setItemsWithChat((prev) => {
      return [...prev, newChat]
    })
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
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Chat Tabs Demo</h1>

      <Tabs.Wrapper
        defaultTab={activeTab}
        onTabChange={setActiveTab}
        className='border border-gray-200 rounded-lg overflow-hidden'
      >
        {/* Tab List */}
        <div
          role='tablist'
          className='flex bg-gray-50 border-b border-gray-200 overflow-x-auto'
          aria-label='Chat conversations'
        >
          {itemsWithChat.map((chat) => (
            <div key={chat.id} className='flex items-center'>
              <Tabs.Button
                tabId={chat.id}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                  activeTab === chat.id
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {chat.prompt && chat?.prompt?.length > 30
                  ? `${chat.prompt.substring(0, 30)}...`
                  : chat.prompt}
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
          <button
            onClick={addNewChat}
            className='px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
            aria-label='Add new chat'
          >
            + New Chat
          </button>
        </div>

        {/* Tab Contents */}
        <div className='min-h-96'>
          {itemsWithChat.map((chat) => (
            <Tabs.Content key={chat.id} tabId={chat.id} className='p-6'>
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  {chat.prompt}
                </h2>
                <div className='space-y-3'>
                  {/* {chat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        index % 2 === 0
                          ? 'bg-blue-50 text-blue-900 ml-auto max-w-xs'
                          : 'bg-gray-100 text-gray-900 mr-auto max-w-xs'
                      }`}
                    >
                      {message}
                    </div>
                  ))} */}
                </div>
                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <input
                    type='text'
                    placeholder='Type your message...'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Wrapper>
    </div>
  )
}
