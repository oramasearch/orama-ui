'use client'
import React, { useState } from 'react'
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Pause,
  X,
  Search,
  FileText,
  Users,
  Settings,
  File,
  ClipboardCheck,
  Copy
} from 'lucide-react'
import { oramaDocsCollection } from '@/data'
import {
  PromptTextArea,
  SearchInput,
  SearchRoot,
  ChatRoot,
  ChatInteractions,
  SearchResults,
  Suggestions,
  Modal
} from '@orama/ui/components'

const mockInitialContent = [
  {
    id: 1,
    title: 'Getting Started Guide',
    type: 'documentation',
    icon: FileText
  },
  { id: 2, title: 'User Management', type: 'feature', icon: Users },
  { id: 3, title: 'API Configuration', type: 'settings', icon: Settings }
]

export const InnerSearchBox = () => {
  const [displayChat, setDisplayChat] = useState(false)

  return (
    <>
      <div className='w-full h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden'>
        {!displayChat && (
          <div className='flex flex-col justify-between gap-2 h-full'>
            <SearchInput.Wrapper className='flex items-center border-b border-gray-200 px-4 py-3'>
              <Search className='w-4 h-4 text-gray-400 mr-3' />
              <SearchInput.Input
                inputId='product-search'
                ariaLabel='Search for products'
                autoFocus
                placeholder='Find your next favorite thing...'
                className='flex-1 outline-none text-sm'
                searchParams={{
                  groupBy: 'category'
                }}
              />
            </SearchInput.Wrapper>

            <SearchResults.NoResults className='p-4'>
              {(searchTerm) => (
                <>
                  {searchTerm ? (
                    <div className='p-8 text-center text-gray-500'>
                      <Search className='w-8 h-8 mx-auto mb-2 text-gray-300' />
                      <p>No results found for &quot;{searchTerm}&quot;</p>
                    </div>
                  ) : (
                    <Suggestions.Wrapper className='flex flex-col justify-center'>
                      <p className='text-sm text-slate-800 dark:text-slate-400 font-semibold mb-2'>
                        Highlighted content
                      </p>
                      <ul className='mt-1 space-y-1'>
                        {mockInitialContent.map((item) => (
                          <li key={item.id}>
                            <a className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer w-full'>
                              <div className='w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center'>
                                <item.icon className='w-4 h-4 text-purple-600' />
                              </div>
                              <div className='text-left'>
                                <div className='font-medium text-sm'>
                                  {item.title}
                                </div>
                                <div className='text-xs text-gray-500 capitalize'>
                                  {item.type}
                                </div>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </Suggestions.Wrapper>
                  )}
                </>
              )}
            </SearchResults.NoResults>

            <div className='flex-1 min-h-0 flex flex-col overflow-y-auto'>
              <SearchResults.Wrapper className='px-4 py-2'>
                <SearchResults.List
                  className='space-y-0'
                  itemClassName='border-b-neutral-200 border-b-1 last:border-b-0'
                >
                  {(result: Hit) => (
                    <SearchResults.Item
                      onClick={() =>
                        console.log(`Clicked on ${result.document?.title}`)
                      }
                      className='flex gap-4 items-center px-2 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer focus:outline-none focus:bg-gray-100 rounded-lg'
                    >
                      <div className='w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center'>
                        <File className='w-4 h-4 text-purple-600 flex-shrink-0' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        {(result.document?.title as string) && (
                          <h3 className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
                            {result.document?.title as string}
                          </h3>
                        )}
                        {(result.document?.content as string) && (
                          <p className='text-sm text-slate-500 dark:text-slate-00 text-ellipsis overflow-hidden'>
                            {(result.document?.content as string).substring(
                              0,
                              100
                            )}
                            ...
                          </p>
                        )}
                      </div>
                    </SearchResults.Item>
                  )}
                </SearchResults.List>
              </SearchResults.Wrapper>
            </div>
          </div>
        )}

        {displayChat && (
          <div className='flex flex-col justify-between h-140 gap-2'>
            <div className='flex-shrink-0'>
              <button
                className='flex items-center text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer'
                onClick={() => setDisplayChat(false)}
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to search
              </button>
            </div>
            <div className='flex-1 min-h-0 flex flex-col overflow-y-auto'>
              <ChatInteractions.Wrapper className='items-start relative overflow-y-auto'>
                {(interaction, index, totalInteractions) => (
                  <>
                    <ChatInteractions.UserPrompt
                      className='max-w-xs p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl rounded-br-md mb-2'
                      aria-label='User message'
                    >
                      {interaction.query}
                    </ChatInteractions.UserPrompt>
                    <ChatInteractions.Sources
                      interaction={interaction}
                      className='flex flex-row gap-2 mb-2 mt-3 overflow-auto overflow-x-scroll pb-2'
                      itemClassName='group inline-flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer'
                    >
                      {(document, index: number) => (
                        <div
                          className='flex items-center gap-2 max-w-xs'
                          key={index}
                        >
                          <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 group-hover:bg-blue-600 transition-colors'></div>
                          <div className='flex flex-col min-w-0'>
                            <span className='text-xs font-semibold text-gray-900 dark:text-gray-100 truncate'>
                              {document?.title as string}
                            </span>
                            <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                              {typeof document?.content === 'string'
                                ? document.content.substring(0, 40)
                                : ''}
                              ...
                            </span>
                          </div>
                        </div>
                      )}
                    </ChatInteractions.Sources>
                    {interaction.loading &&
                      !interaction.response && ( // use your custom skeleton loader here
                        <div className='animate-pulse mb-2'>
                          <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2'></div>
                          <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2'></div>
                        </div>
                      )}
                    {interaction.error && ( // use your custom error message component here
                      <div className='p-4 bg-red-100 dark:bg-red-700 rounded-lg max-w-80% mx-auto text-sm text-red-800 dark:text-red-200'>
                        <p>Error: {interaction.error}</p>
                      </div>
                    )}
                    <ChatInteractions.AssistantMessage className='mb-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-80% mx-auto text-sm'>
                      {interaction.response}
                    </ChatInteractions.AssistantMessage>
                    {interaction.response && !interaction.loading && (
                      <ul className='mb-2'>
                        {index === totalInteractions && (
                          <li>
                            <ChatInteractions.RegenerateLatest
                              className='text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                              onClick={() => {
                                console.log('Regenerate latest interaction')
                              }}
                              interaction={interaction}
                            >
                              Regenerate latest response
                            </ChatInteractions.RegenerateLatest>
                          </li>
                        )}
                        <li>
                          <ChatInteractions.CopyMessage
                            interaction={interaction}
                            className='text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                            onClick={() => {
                              console.log('Copy message clicked')
                            }}
                          >
                            {(copied) =>
                              copied ? (
                                <ClipboardCheck className='w-4 h-4' />
                              ) : (
                                <Copy className='w-4 h-4' />
                              )
                            }
                          </ChatInteractions.CopyMessage>
                        </li>
                        <li>
                          <ChatInteractions.Reset
                            className='text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                            onClick={() => {
                              console.log('Reset clicked')
                            }}
                          >
                            Reset
                          </ChatInteractions.Reset>
                        </li>
                      </ul>
                    )}
                  </>
                )}
              </ChatInteractions.Wrapper>
              <ChatInteractions.ScrollToBottomButton
                className='absolute bottom-2 right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-1 focus:ring-pink-200 cursor-pointer'
                aria-label='Scroll to bottom'
                onClick={() => {
                  console.log('Scroll to bottom clicked')
                }}
              >
                <ArrowDown className='w-4 h-4' />
              </ChatInteractions.ScrollToBottomButton>
            </div>
            <div className='flex-shrink-0'>
              <PromptTextArea.Wrapper className='flex flex-col gap-3.5 focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-200 p-2 border-1 border-gray-300 rounded-lg bg-white dark:bg-gray-800 cursor-text'>
                <PromptTextArea.Field
                  placeholder='Type your question here...'
                  rows={1}
                  maxLength={500}
                  onChange={(e) => {
                    // const userPrompt = e.target.value.trim();
                    // console.log("User prompt changed:", userPrompt);
                  }}
                  className='w-full border-0 focus:outline-none'
                />
                {/* on click focus on the text area */}
                <div className='flex justify-end items-center gap-2'>
                  <PromptTextArea.Button
                    ask={(prompt) => {
                      console.log('Asking with prompt:', prompt)
                    }}
                    className='inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-pink-100 to-purple-200 hover:from-pink-100 hover:to-purple-300 text-slate-800 dark:text-slate-200 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-pink-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                    aria-label='Ask AI'
                    abortContent={<Pause className='w-4 h-4' />}
                  >
                    <ArrowUp className='w-4 h-4' />
                  </PromptTextArea.Button>
                </div>
              </PromptTextArea.Wrapper>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export const SearchBoxModal = () => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <button
        className='w-full max-w-md mx-auto flex items-center justify-start gap-3 py-2 bg-white/50 hover:bg-white/80 border border-gray-200 px-2 rounded-lg'
        onClick={() => {
          setOpenModal(true)
        }}
        data-focus-on-arrow-nav
      >
        <Search className='w-4 h-4 text-gray-400' />
        <span className='text-gray-500'>Search everything...</span>
      </button>
      <Modal.Wrapper
        open={openModal}
        onModalClosed={() => setOpenModal(false)}
        closeOnOutsideClick={true}
        closeOnEscape={true}
        className='bg-gray-900/40'
      >
        <Modal.Inner className='flex max-w-lg h-120 m-auto bg-white'>
          <Modal.Content>
            <SearchRoot
              initialState={{
                client: oramaDocsCollection
              }}
            >
              <ChatRoot
                initialState={{
                  client: oramaDocsCollection
                }}
              >
                <InnerSearchBox />
              </ChatRoot>
            </SearchRoot>
          </Modal.Content>
          <Modal.Close className='absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer'>
            <X className='w-4 h-4' />
          </Modal.Close>
        </Modal.Inner>
      </Modal.Wrapper>
    </>
  )
}
