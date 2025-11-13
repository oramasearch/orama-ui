'use client'
import React, { useState } from 'react'
import { X, Search, FileText, Users, Settings, File } from 'lucide-react'
import { oramaDocsCollection } from '@/data'
import {
  SearchInput,
  SearchRoot,
  ChatRoot,
  SearchResults,
  Suggestions,
  Modal,
  RecentSearches
} from '@orama/ui/components'
import { Hit } from '@orama/core'
import Link from 'next/link'

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
  return (
    <>
      <div className='w-full h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden'>
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
                groupedBy: 'category'
              }}
            />
          </SearchInput.Wrapper>

          <SearchResults.Loading className='p-4'>
            <div className='animate-pulse flex space-x-4'>
              <div className='rounded-full bg-gray-300 h-10 w-10'></div>
              <div className='flex-1 space-y-4 py-1'>
                <div className='h-4 bg-gray-300 rounded w-3/4'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-300 rounded'></div>
                  <div className='h-4 bg-gray-300 rounded w-5/6'></div>
                </div>
              </div>
            </div>
          </SearchResults.Loading>

          <SearchResults.NoResults className='p-4 overflow-auto'>
            {(searchTerm) => (
              <>
                {searchTerm ? (
                  <div className='p-8 text-center text-gray-500'>
                    <Search className='w-8 h-8 mx-auto mb-2 text-gray-300' />
                    <p>No results found for &quot;{searchTerm}&quot;</p>
                  </div>
                ) : (
                  <>
                    <Suggestions.Wrapper className='flex flex-col justify-center'>
                      <p className='text-sm text-slate-800 font-semibold mb-2'>
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
                    <RecentSearches.Provider>
                      <div className='border-t border-slate-200 dark:border-slate-700 my-4 flex flex-col justify-center pt-4'>
                        <p className='text-sm text-slate-800 font-semibold mb-2'>
                          Your Recent Searches
                        </p>
                        <RecentSearches.List
                          className='space-y-1'
                          itemClassName='px-3'
                        >
                          {(term, index) => (
                            <RecentSearches.Item
                              key={`recent-search-${index}`}
                              term={term}
                              className='text-xs uppercase text-gray-500 hover:text-gray-700 cursor-pointer'
                            >
                              {term}
                            </RecentSearches.Item>
                          )}
                        </RecentSearches.List>
                        <div className='flex justify-end'>
                          <RecentSearches.Clear className='text-xs text-slate-400 hover:underline cursor-pointer mb-2'>
                            Clear recent searches
                          </RecentSearches.Clear>
                        </div>
                      </div>
                    </RecentSearches.Provider>
                  </>
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
                    as={Link}
                    href='#'
                    className='flex gap-4 items-center px-2 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer focus:outline-none focus:bg-gray-100 rounded-lg'
                    data-focus-on-arrow-nav
                  >
                    <div className='w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center'>
                      <File className='w-4 h-4 text-purple-600 flex-shrink-0' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      {(result.document?.title as string) && (
                        <h3 className='text-sm font-semibold text-slate-800'>
                          {result.document?.title as string}
                        </h3>
                      )}
                      {(result.document?.content as string) && (
                        <p className='text-sm text-slate-500 text-ellipsis overflow-hidden'>
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
      </div>
    </>
  )
}

export const SearchBoxModal = () => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Modal.Root>
        {/* <button
          className='w-full max-w-md mx-auto flex items-center justify-start gap-3 py-2 bg-white/50 hover:bg-white/80 border border-gray-200 px-2 rounded-lg'
          onClick={() => {
            console.log('***Opening search modal')
            setOpenModal(true)
          }}
          data-focus-on-arrow-nav
        >
          <Search className='w-4 h-4 text-gray-400' />
          <span className='text-gray-500'>Search everything...</span>
        </button> */}
        <Modal.Trigger
          enableCmdK
          className='w-full max-w-md mx-auto flex items-center justify-start gap-3 py-2 bg-white/50 hover:bg-white/80 border border-gray-200 px-2 rounded-lg'
        >
          <Search className='w-4 h-4 text-gray-400' />
          <span className='text-gray-500'>Search everything...</span>
        </Modal.Trigger>
        <Modal.Wrapper
          // open={openModal}
          // onModalClosed={() => setOpenModal(false)}
          closeOnOutsideClick={true}
          closeOnEscape={true}
          className='bg-gray-900/40'
        >
          <Modal.Inner className='flex max-w-lg h-120 m-auto bg-white'>
            <Modal.Content>
              <SearchRoot
                client={oramaDocsCollection}
                namespace='demo-default-search'
              >
                <ChatRoot client={oramaDocsCollection}>
                  <InnerSearchBox />
                </ChatRoot>
              </SearchRoot>
            </Modal.Content>
            <Modal.Close className='absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer'>
              <X className='w-4 h-4' />
            </Modal.Close>
          </Modal.Inner>
        </Modal.Wrapper>
      </Modal.Root>
    </>
  )
}
