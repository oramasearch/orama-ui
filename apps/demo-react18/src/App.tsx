import { SearchRoot, SearchInput, SearchResults } from '@orama/ui/components'
import { oramaDocsCollection } from './data'
import React from 'react'

export default function App() {
  return (
    <div>
      <h1>APP - React 18 + @orama/ui Demo</h1>
      <SearchRoot client={oramaDocsCollection}>
        <SearchInput.Wrapper>
          <SearchInput.Label htmlFor='search-input'>
            Search Documents
          </SearchInput.Label>
          <SearchInput.Input
            placeholder='Search documents...'
            autoFocus
            aria-label='Search documents'
          />
          <SearchResults.List>
            {(result, index) => (
              <SearchResults.Item
                key={index}
                className='p-2 hover:bg-gray-100'
                onClick={() => console.log('Clicked result:', result)}
              >
                <h2 className='text-lg font-semibold'>
                  {String((result.document as { title?: unknown }).title)}
                </h2>
              </SearchResults.Item>
            )}
          </SearchResults.List>
        </SearchInput.Wrapper>
      </SearchRoot>
    </div>
  )
}
