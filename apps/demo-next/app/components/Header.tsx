'use client'
import React from 'react'
import { CollectionManager } from '@orama/core'
import { InnerSearchBox } from './SearchBoxModal'
import { Modal, SearchRoot, ChatRoot } from '@orama/ui/components'

const collectionManager = new CollectionManager({
  collectionID: '224433cb-cd19-4b80-a1df-a019413a0b66',
  apiKey: 'c1_zDbVdyyKg1j__mnEb8_dgr4ETQHSYGfCbVaS7dEaPzORmsuPRTN70Qepv94'
})

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <header className='flex items-center justify-between p-4 bg-gray-800 text-white'>
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
            <SearchRoot client={collectionManager}>
              <ChatRoot client={collectionManager}>
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
