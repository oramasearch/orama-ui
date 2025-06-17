'use client'
import React from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { CollectionManager } from '@orama/core'
import ChatRoot from '@orama/ui/components/ChatRoot'
import ChatInteractions from '@orama/ui/components/ChatInteractions'
import PromptTextArea from '@orama/ui/components/PromptTextArea'

const collectionManager = new CollectionManager({
  url: 'https://collections.orama.com',
  collectionID: 'q126p2tuxl69ylzhx2twjobw',
  readAPIKey: 'uXAoFvHnNZfvbR4GmXdRjTHSvfMPb45y'
})

export const InnerChat = () => {

  return (
    <>
    <ChatInteractions.Wrapper>
      {(interaction) => (
        <>
          <ChatInteractions.UserPrompt
            aria-label='User message'
          >
            {interaction.query}
          </ChatInteractions.UserPrompt>
          <ChatInteractions.Sources
            sources={Array.isArray(interaction.sources) ? interaction.sources : []}
          >
            {(document, index: number) => (
              <div key={index}>
                <span>
                  {document?.title as string}
                </span>
              </div>
            )}
          </ChatInteractions.Sources>
          {interaction.loading && !interaction.response && ( // use your custom skeleton loader here
            <p>Loader...</p>
          )}
          {interaction.error && ( // use your custom error message component here
            <p>Error...</p>
          )}
          <ChatInteractions.AssistantMessage>
            {interaction.response}
          </ChatInteractions.AssistantMessage>
        </>
      )}
    </ChatInteractions.Wrapper>
    <ChatInteractions.ScrollToBottomButton
      aria-label='Scroll to bottom'
    >
      <ArrowDown />
    </ChatInteractions.ScrollToBottomButton>
    <PromptTextArea.Wrapper>
      <PromptTextArea.Field
        placeholder='Type your question here...'
        rows={1}
        maxLength={500}
        autoFocus
      />
      <div>
        <PromptTextArea.Button
          aria-label='Ask AI'
        >
          <ArrowUp className='w-4 h-4' />
        </PromptTextArea.Button>
      </div>
    </PromptTextArea.Wrapper>
    </>
  )}

export const MyChat = () => {
  return (
    <ChatRoot client={collectionManager}>
      <InnerChat />
    </ChatRoot>
  )
}
