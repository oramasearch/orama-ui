'use client'
import React, { useState } from 'react'
import { ChatInteractions, SlidingPanel } from '@orama/ui/components'
import { Bot, Send, User } from 'lucide-react'
import { PromptTextArea, ChatRoot } from '@orama/ui/components'
import { oramaDocsCollection } from '@/data'

const positions = ['left', 'right', 'top', 'bottom'] as const

export const SlidingPanelChatbox = () => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<'left' | 'right' | 'top' | 'bottom'>(
    'right'
  )

  return (
    <ChatRoot client={oramaDocsCollection}>
      <div className='flex flex-col items-center gap-4'>
        <div className='flex gap-2'>
          {positions.map((pos) => (
            <button
              key={pos}
              className={`px-3 py-1 rounded border ${position === pos ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
              onClick={() => setPosition(pos)}
            >
              {pos.charAt(0).toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>
        <button
          className='mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow'
          onClick={() => setOpen(true)}
        >
          Open Chatbox
        </button>
        <SlidingPanel.Wrapper open={open} onClose={() => setOpen(false)}>
          <SlidingPanel.Backdrop className={'bg-black/50'} />
          <SlidingPanel.Content
            position={position}
            className={`bg-white w-full duration-400 ease-in-out ${position === 'left' || position === 'right' ? 'max-w-md h-full' : 'h-[80vh]'}`}
          >
            <div
              className={`flex flex-col h-full ${position === 'top' || position === 'bottom' ? 'max-w-6xl mx-auto' : ''}`}
            >
              <div className='flex justify-between items-center'>
                <div className='flex justify-between items-center p-4 border-b w-full border-gray-200'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center'>
                      <Bot className='w-4 h-4 text-white' />
                    </div>
                    <h2 className='text-lg font-semibold'>AI Answers</h2>
                  </div>
                  <button
                    className='text-gray-500 hover:text-gray-800 text-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-md px-2'
                    onClick={() => setOpen(false)}
                    aria-label='Close'
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className='flex-1 rounded p-4 overflow-y-auto'>
                {/* initial asssistant message */}
                <div className='flex gap-3'>
                  <div className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100'>
                    <Bot className='w-4 h-4 text-gray-600' />
                  </div>
                  <div className='flex-1 max-w-xs'>
                    <div className='inline-block p-3 rounded-2xl bg-gray-100 text-gray-900'>
                      <p className='text-sm'>
                        Hello! How can I help you today?
                      </p>
                    </div>
                  </div>
                </div>

                <ChatInteractions.Wrapper>
                  {(interaction) => (
                    <div className='flex flex-col gap-3 my-4'>
                      <ChatInteractions.UserPrompt className='flex gap-3 flex-row-reverse'>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500'>
                          <User className='w-4 h-4 text-white' />
                        </div>
                        <div className='flex-1 max-w-xs text-right'>
                          <div className='inline-block p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
                            <p className='text-sm'>{interaction.query}</p>
                          </div>
                        </div>
                      </ChatInteractions.UserPrompt>
                      <div className='flex gap-3'>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100'>
                          <Bot className='w-4 h-4 text-gray-600' />
                        </div>
                        <ChatInteractions.AssistantMessage className='inline-block p-3 rounded-2xl bg-gray-100 text-gray-900 text-sm max-w-full'>
                          {interaction.response}
                        </ChatInteractions.AssistantMessage>
                      </div>
                    </div>
                  )}
                </ChatInteractions.Wrapper>
              </div>
              <PromptTextArea.Wrapper className='p-4 border-t border-gray-200'>
                <div className='flex gap-2'>
                  <PromptTextArea.Field
                    placeholder='Type your message...'
                    rows={1}
                    name='chat-input'
                    id='chat-input'
                    className='flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    autoFocus
                  />
                  <PromptTextArea.Button className='inline-flex px-4 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-to-r text-white from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:to-pink-700'>
                    <Send className='w-4 h-4' />
                  </PromptTextArea.Button>
                </div>
              </PromptTextArea.Wrapper>
            </div>
          </SlidingPanel.Content>
        </SlidingPanel.Wrapper>
      </div>
    </ChatRoot>
  )
}
