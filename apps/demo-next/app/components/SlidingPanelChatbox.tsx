'use client'
import React, { useState } from 'react'
import { SlidingPanel } from '@orama/ui/components'

const positions = ['left', 'right', 'top', 'bottom'] as const

export const SlidingPanelChatbox = () => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<'left' | 'right' | 'top' | 'bottom'>(
    'right'
  )

  return (
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
          className={`bg-white p-4 w-full ${position === 'left' || position === 'right' ? 'max-w-md h-full' : 'h-[80vh]'}`}
        >
          <div
            className={`flex flex-col h-full ${position === 'top' || position === 'bottom' ? 'max-w-6xl mx-auto' : ''}`}
          >
            <div className='flex justify-between items-center mb-2'>
              <h2 className='text-lg font-semibold'>Chatbox</h2>
              <button
                className='text-gray-500 hover:text-gray-800 text-2xl'
                onClick={() => setOpen(false)}
                aria-label='Close'
              >
                ×
              </button>
            </div>
            <div className='flex-1 bg-gray-100 rounded p-4 overflow-y-auto'>
              <p className='text-gray-600'>
                This is a chatbox panel. Start chatting!
              </p>
            </div>
            <form className='mt-4 flex gap-2'>
              <input
                type='text'
                className='flex-1 border rounded px-2 py-1'
                placeholder='Type a message...'
              />
              <button
                type='submit'
                className='bg-blue-600 text-white px-4 py-1 rounded'
              >
                Send
              </button>
            </form>
          </div>
        </SlidingPanel.Content>
      </SlidingPanel.Wrapper>
    </div>
  )
}
