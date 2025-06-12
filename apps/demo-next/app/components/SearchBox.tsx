'use client'
import React, { useState } from 'react'
import { Star, ArrowLeft, ArrowUp } from 'lucide-react'
import { CollectionManager } from '@orama/core'
import SearchInput from '@repo/ui/components/SearchInput'
import SearchRoot from '@repo/ui/components/SearchRoot'
import ChatRoot from '@repo/ui/components/ChatRoot'
import useChat from '@repo/ui/hooks/useChat'
import SearchResults from '@repo/ui/components/SearchResults'
import FacetTabs from '@repo/ui/components/FacetTabs'
import { useSearchContext } from '@repo/ui/context/SearchContext'
import { cn } from '@/lib/utils'
import { useChatContext } from '@repo/ui/context/ChatContext'
import PromptTextArea from '@repo/ui/components/PromptTextArea'

const collectionManager = new CollectionManager({
  url: 'https://collections.orama.com',
  collectionID: 'q126p2tuxl69ylzhx2twjobw',
  readAPIKey: 'uXAoFvHnNZfvbR4GmXdRjTHSvfMPb45y'
})

export const InnerSearchBox = () => {
  const { selectedFacet } = useSearchContext()
  const { interactions } = useChatContext()
  const [displayChat, setDisplayChat] = useState(false)
  const { onAsk } = useChat()

  return (
    <>
      <div className='w-full lg:max-w-xl mx-auto border-gray-200 border-1 rounded-lg p-4 bg-white h-140 flex flex-col'>
        {!displayChat && (
          <>
            <SearchInput.Wrapper className='relative mb-1'>
              {/* <SearchInput.Label
                htmlFor='product-search'
                className='text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 block'
              >
                Search Products
              </SearchInput.Label> */}
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
                {(group) => (
                  <FacetTabs.Item
                    isSelected={group.name === selectedFacet}
                    group={group}
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
                    <div className='flex flex-col justify-center'>
                      <p className='text-sm text-slate-800 dark:text-slate-400 font-semibold mb-2'>
                        Suggestions
                      </p>
                      <ul className='mt-1 space-y-1'>
                        <li className='text-sm text-slate-500 dark:text-slate-400'>
                          What is Orama?
                        </li>
                        <li className='text-sm text-slate-500 dark:text-slate-400'>
                          How to use Orama?
                        </li>
                        <li className='text-sm text-slate-500 dark:text-slate-400'>
                          What are the features of Orama?
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              )}
            </SearchResults.NoResults>

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

            {/* <SearchResults.Wrapper className='mt-4 overflow-y-auto'>
              <SearchResults.NoResults>
                {(searchTerm) => (
                  <>
                    {searchTerm ? (
                      <p className='text-sm text-slate-500 dark:text-slate-400'>
                        {`No results found for "${searchTerm}". Please try a different search term.`}
                      </p>
                    ) : (
                      <div className='flex flex-col justify-center'>
                        <p className='text-sm text-slate-800 dark:text-slate-400 font-semibold mb-2'>
                          Suggestions
                        </p>
                        <ul className='mt-1 space-y-1'>
                          <li className='text-sm text-slate-500 dark:text-slate-400'>What is Orama?</li>
                          <li className='text-sm text-slate-500 dark:text-slate-400'>How to use Orama?</li>
                          <li className='text-sm text-slate-500 dark:text-slate-400'>What are the features of Orama?</li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </SearchResults.NoResults>
              <SearchResults.List
                className="space-y-2"
                itemClassName="border-b-neutral-200 border-b-1 pb-4 last:border-b-0 cursor-pointer"
              >
                {(result: Hit) => (
                  <SearchResults.Item
                    result={result}
                    onClick={() => console.log(`Clicked on ${result.document?.title}`)}
                  >
                    {(result.document?.title as string) && (
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {result.document?.title as string}
                      </h3>
                    )}
                    {(result.document?.content as string) && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-ellipsis overflow-hidden">
                        {(result.document?.content as string).substring(0, 100)}
                        ...
                      </p>
                    )}
                  </SearchResults.Item>
                )}
              </SearchResults.List>
            </SearchResults.Wrapper> */}
          </>
        )}

        {displayChat && (
          // I want text area to be always aligned to the bottom of the container
          <div className='flex flex-col justify-between h-full'>
            {/* addd back to search button */}
            <button
              className='mb-4 flex items-center text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer'
              onClick={() => setDisplayChat(false)}
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to search
            </button>
            <div>
              <div>
                {interactions &&
                  interactions.length > 0 &&
                  interactions.map((interaction, index) => (
                    <React.Fragment key={index}>
                      {interaction && (
                        <div className='mb-4'>
                          {/* add query */}
                          <p className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 text-right'>
                            {interaction.query}
                          </p>
                          <p className='p-4 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-80% mx-auto text-sm'>
                            {interaction.response}
                          </p>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
              </div>
              <PromptTextArea.Wrapper className='flex flex-col gap-3.5 focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-200 p-2 border-1 border-gray-300 rounded-lg bg-white dark:bg-gray-800'>
                <PromptTextArea.Field
                  placeholder='Type your question here...'
                  rows={1}
                  maxLength={500}
                  onChange={(e) => {
                    const userPrompt = e.target.value.trim()
                    console.log('User prompt changed:', userPrompt)
                  }}
                  className='w-full border-0 focus:outline-none'
                  autoFocus
                />
                <div className='flex justify-end'>
                  <PromptTextArea.Button
                    onAsk={(prompt) => {
                      console.log('Asking with prompt:', prompt)
                    }}
                    className='inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-pink-100 to-purple-200 hover:from-pink-100 hover:to-purple-300 text-slate-800 dark:text-slate-200 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-pink-200 disabled:opacity-50 disabled:cursor-not-allowed'
                    aria-label='Ask AI'
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
    <SearchRoot client={collectionManager}>
      <ChatRoot client={collectionManager}>
        <InnerSearchBox />
      </ChatRoot>
    </SearchRoot>
  )
}
