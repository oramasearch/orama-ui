'use client'
import { useState } from 'react'
import { Star, ArrowLeft } from 'lucide-react'
import { CollectionManager, Hit } from '@orama/core'
import SearchInput, { SearchRoot } from '@repo/ui/components/SearchInput'
import useChat from '@repo/ui/hooks/useChat'
import SearchResults from "@repo/ui/components/SearchResults";
import FacetTabs from '@repo/ui/components/FacetTabs'

const collectionManager = new CollectionManager({
  url: 'https://collections.orama.com',
  collectionID: 'q126p2tuxl69ylzhx2twjobw',
  readAPIKey: 'uXAoFvHnNZfvbR4GmXdRjTHSvfMPb45y'
})

export const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [displayChat, setDisplayChat] = useState(false)

  // WIP
  const { onAsk, interactions } = useChat({
    client: collectionManager,
    initialUserPrompt: searchTerm,
    onUserPromptChange: setSearchTerm
  })

  return (
    <>
      <div className='w-full lg:max-w-xl mx-auto border-gray-200 border-1 rounded-lg p-4 bg-white h-140 flex flex-col'>
        {!displayChat && (
          <SearchRoot client={collectionManager}>
            <SearchInput.Wrapper className='relative mb-1'>
              <SearchInput.Label
                htmlFor='product-search'
                className='text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 block'
              >
                Search Products
              </SearchInput.Label>
              <SearchInput.Input
                inputId='product-search'
                ariaLabel='Search for products'
                placeholder='Find your next favorite thing...'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400 transition-colors'
              />
            </SearchInput.Wrapper>
            {/* Search input with icon and reset button */}

            {/* Display error state */}
            {/* {state.error && (
              <div className='mt-3 text-sm text-red-500'>
                Error: {error.message}
              </div>
            )} */}

            <button
              className='mt-3 w-full cursor-pointer flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-200 hover:from-pink-100 hover:to-purple-300 text-slate-800 dark:text-slate-200 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-pink-200'
              onClick={() => {
                console.log('Get AI summary for:', searchTerm)
                setDisplayChat(true)
              }}
            >
              {/* add ai start icon with some animation */}
              <Star className='inline-block mr-2 w-4 h-4 animate-pulse' />
              Ask AI for summary
            </button>

            {/* <FacetTabs
              groupedResults={state.groupedResults}
              className='mt-4 flex flex-wrap gap-2'
              tabClassName={`cursor-pointer px-3 py-1 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors `}
              selectedTabClassName='ring-1 ring-pink-500'
              selectedTab={selectedFacet}
              searchTerm={searchTerm}
              onSearch={state.onSearch}
            /> */}

              <SearchResults.Wrapper className='mt-4 overflow-y-auto'>
                <SearchResults.NoResults>
                  {(searchTerm) => (
                    <>
                      {searchTerm ? (
                        <p className='text-sm text-slate-500 dark:text-slate-400'>
                          {`No results found for "${searchTerm}". Please try a different search term.`}
                        </p>
                      ) : (
                        <div className='flex flex-col justify-center'>
                          {/* add a section with initial chat suggestions list */}
                          <p className='text-sm text-slate-800 dark:text-slate-400 font-semibold mb-2'>
                            Suggestions
                          </p>
                          {/* You can add more content here, like a list of suggestions or tips */}
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
              </SearchResults.Wrapper>
          </SearchRoot>
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
                {interactions.length > 0 &&
                  interactions.map((interaction, index) => (
                    <div
                      key={index}
                      className='mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-80% mx-auto'
                    >
                      <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                        {interaction.response}
                      </p>
                    </div>
                  ))}
              </div>
              <div className='mt-4 border-1 border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-pink-500 transition-colors flex flex-col gap-2'>
                <textarea
                  className='w-full p-0 border-0 rounded-lg focus:outline-none resize-none'
                  rows={2}
                  placeholder='Ask your question...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                ></textarea>
                <div className='flex justify-end'>
                  <button
                    className='bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-colors'
                    onClick={() => {
                      onAsk({ term: searchTerm })
                      setSearchTerm('')
                    }}
                  >
                    <ArrowLeft className='w-6 h-6 transform rotate-90' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
