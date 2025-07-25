'use client'
import React from 'react'
import { oramaDocsCollection } from '@/data'
import { InnerSearchBox } from './SearchBoxModal'
import { Modal, SearchRoot, ChatRoot, OramaLogo } from '@orama/ui/components'
import Link from 'next/link'

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <header className='flex items-center justify-between p-4 bg-gray-800 text-white'>
      <Link href='/'>
        <OramaLogo theme='dark' size={24} className='mr-2' />
      </Link>
      <h1 className='text-xl font-bold'>Orama UI Demo</h1>
      {/* <div className="min-w-xs">
        <button
          onClick={handleOpen}
          className="orama-button orama-button--secondary orama-button--medium"
        >
          <span className="orama-button__label">
            <Search size="1em" />
            Start typing...
          </span>
          <span className="kyb-shortcut">⌘ K</span>
        </button>
      </div> */}
      <Modal.Wrapper
        open={isOpen}
        onModalClosed={handleClose}
        closeOnOutsideClick={true}
        closeOnEscape={true}
      >
        <Modal.Inner>
          <Modal.Content>
            <SearchRoot client={oramaDocsCollection}>
              <ChatRoot client={oramaDocsCollection}>
                <InnerSearchBox />
              </ChatRoot>
            </SearchRoot>
          </Modal.Content>
        </Modal.Inner>
      </Modal.Wrapper>
    </header>
  )
}

export default Header
