'use client'
import React, { useState } from 'react'
import { Star, ArrowLeft, ArrowUp, ArrowDown, Pause } from 'lucide-react'
import { oramaDocsCollection } from '@/data'
import {
  FacetTabs,
  SearchInput,
  SearchRoot,
  ChatRoot,
  ChatInteractions,
  SearchResults,
  Suggestions,
  PromptTextArea
} from '@orama/ui/components'
import { useSearchContext } from '@orama/ui/contexts'
import { cn } from '@/lib/utils'

export const InnerSearchBox = () => {
  const { selectedFacet } = useSearchContext()
  const [displayChat, setDisplayChat] = useState(false)

  return (
    <>
      <div className='w-full lg:max-w-xl mx-auto border-gray-200 border-1 rounded-lg p-4 bg-white flex flex-col'>
        {!displayChat && (
          <div className='flex flex-col justify-between h-140 gap-2'>
            <SearchInput.Wrapper className='relative mb-1 flex-shrink-0'>
              <SearchInput.Input
                inputId='product-search'
                ariaLabel='Search for products'
                placeholder='Find your next favorite thing...'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400 transition-colors'
                searchParams={{
                  groupBy: 'category'
                }}
              />
            </SearchInput.Wrapper>

            <button
              className='mt-3 w-full cursor-pointer flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-200 hover:from-pink-100 hover:to-purple-300 text-slate-800 dark:text-slate-200 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-pink-200'
              onClick={() => {
                setDisplayChat(true)
              }}
            >
              {/* add ai start icon with some animation */}
              <Star className='inline-block mr-2 w-4 h-4 animate-pulse' />
              Ask AI for summary
            </button>

            <FacetTabs.Wrapper>
              <FacetTabs.List className='space-x-2 mt-4 flex gap-1'>
                {(
                  group,
                  index // TODO: consider to pass isSelected as second boolean argument
                ) => (
                  <FacetTabs.Item
                    isSelected={group.name === selectedFacet}
                    group={group}
                    filterBy={'category'}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                      group.name === selectedFacet
                        ? 'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    {group.name} ({group.count})
                  </FacetTabs.Item>
                )}
              </FacetTabs.List>
            </FacetTabs.Wrapper>

            <SearchResults.NoResults className='mt-4'>
              {(searchTerm) => (
                <>
                  {searchTerm ? (
                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                      {`No results found for "${searchTerm}". Please try a different search term.`}
                    </p>
                  ) : (
                    <Suggestions.Wrapper className='flex flex-col justify-center'>
                      <p className='text-sm text-slate-800 dark:text-slate-400 font-semibold mb-2'>
                        Suggestions
                      </p>
                      <ul className='mt-1 space-y-1'>
                        <li className='text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200'>
                          <Suggestions.Item
                            onClick={() => setDisplayChat(true)}
                            className='cursor-pointer'
                          >
                            What is Orama?
                          </Suggestions.Item>
                        </li>
                        <li className='text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200'>
                          <Suggestions.Item
                            onClick={() => setDisplayChat(true)}
                            className='cursor-pointer'
                          >
                            How to use Orama?
                          </Suggestions.Item>
                        </li>
                        <li className='text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200'>
                          <Suggestions.Item
                            onClick={() => setDisplayChat(true)}
                            className='cursor-pointer'
                          >
                            What are the features of Orama?
                          </Suggestions.Item>
                        </li>
                      </ul>
                    </Suggestions.Wrapper>
                  )}
                </>
              )}
            </SearchResults.NoResults>
            <div className='flex-1 min-h-0 flex flex-col overflow-y-auto'>
              <SearchResults.GroupsWrapper
                className='mt-4 overflow-y-auto'
                groupBy='category'
              >
                {(group) => (
                  <div key={group.name} className='mb-4'>
                    <h2 className='text-md uppercase font-semibold text-gray-400 dark:text-slate-200 mt-3 mb-3'>
                      {group.name}
                    </h2>
                    <SearchResults.GroupList group={group}>
                      {(hit) => (
                        <SearchResults.Item
                          onClick={() =>
                            console.log(`Clicked on ${hit.document?.title}`)
                          }
                        >
                          {/* CUSTOM ITEM CONTENT */}
                          {typeof hit.document?.title === 'string' && (
                            <h3 className='text-lg font-semibold text-slate-800 dark:text-slate-200'>
                              {hit.document?.title}
                            </h3>
                          )}
                          {typeof hit.document?.content === 'string' && (
                            <p className='text-sm text-slate-600 dark:text-slate-400 text-ellipsis overflow-hidden'>
                              {hit.document?.content.substring(0, 100)}
                              ...
                            </p>
                          )}
                        </SearchResults.Item>
                      )}
                    </SearchResults.GroupList>
                  </div>
                )}
              </SearchResults.GroupsWrapper>
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
                    <ChatInteractions.Sources
                      sources={
                        Array.isArray(interaction.sources)
                          ? interaction.sources
                          : []
                      }
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
                            Copy message
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
                    onAsk={(prompt) => {
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

export const SearchBox = () => {
  return (
    <SearchRoot client={oramaDocsCollection}>
      <ChatRoot client={oramaDocsCollection}>
        <InnerSearchBox />
      </ChatRoot>
    </SearchRoot>
  )
}
