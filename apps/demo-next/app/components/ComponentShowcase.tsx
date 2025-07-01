'use client'
import React, { useState } from 'react'
import {
  Star,
  ArrowLeft,
  ArrowUp,
  RotateCcw,
  Copy,
  ClipboardCheck,
  SearchX,
  Lightbulb,
  PauseCircle,
  ArrowDown
} from 'lucide-react'
import { CollectionManager } from '@orama/core'
import { useArrowKeysNavigation, useScrollableContainer } from '@orama/ui/hooks'
import { cn } from '@/lib/utils'
import {
  FacetTabs,
  SearchRoot,
  SearchInput,
  SearchResults,
  ChatRoot,
  PromptTextArea,
  ChatInteractions,
  Suggestions,
  SlidingPanel
} from '@orama/ui/components'

const collectionManager = new CollectionManager({
  url: 'https://atlantis.cluster.oramacore.com',
  collectionID: 'ooo4f22zau7q7ta4i1grlgji',
  readAPIKey: 'WvStWzar7tqdX3FOZbhCMDWSQsWAewUu'
})

export const ComponentShowcase = () => {
  const [activeDemo, setActiveDemo] = useState(0)

  const scrollToCodeExamples = () => {
    document
      .getElementById('code-examples')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const demos = [
    {
      title: 'Modern Search Interface',
      description: 'Clean, minimal design with subtle gradients',
      theme: 'modern'
    },
    {
      title: 'Dark Theme Variant',
      description: 'Sleek dark mode with neon accents',
      theme: 'dark'
    },
    {
      title: 'Playful Design',
      description: 'Colorful and fun with rounded corners',
      theme: 'playful'
    }
  ]

  return (
    <section id='showcase' className='py-20 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-center mb-8'>
          <div className='flex space-x-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/20'>
            {demos.map((demo, index) => (
              <button
                key={index}
                onClick={() => setActiveDemo(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
                  activeDemo === index
                    ? 'bg-white shadow-lg text-purple-700'
                    : 'text-gray-600 hover:text-purple-700'
                }`}
              >
                {demo.title}
              </button>
            ))}
          </div>
        </div>

        {/* Component demos */}
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                {demos[activeDemo]?.title}
              </h3>
              <p className='text-gray-600 text-lg'>
                {demos[activeDemo]?.description}
              </p>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-gray-700'>Fully accessible</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-gray-700'>TypeScript support</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-gray-700'>Zero runtime CSS</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-gray-700'>Composable architecture</span>
              </div>
            </div>

            <button
              onClick={scrollToCodeExamples}
              className='px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300'
            >
              View Code Example
            </button>
          </div>

          <div>
            <ComponentDemo theme={demos[activeDemo]?.theme ?? 'modern'} />
          </div>
        </div>
      </div>
    </section>
  )
}

const getThemeClasses = (theme: string) => {
  switch (theme) {
    case 'modern':
      return {
        container: 'bg-white border border-gray-200 rounded-xl shadow-lg',
        input: 'border-gray-300 focus:ring-purple-400 focus:border-purple-400',
        promptButton:
          'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        text: 'text-gray-900',
        category:
          'bg-gray-50 hover:bg-gray-100 focus:bg-purple-100 focus:text-purple-800 focus:border-purple-200',
        categorySelected: 'bg-purple-100 text-purple-800 border-purple-200',
        resultsContainer: 'bg-gray-50/50',
        groupHeader: 'text-purple-600 border-b border-purple-100',
        resultItem:
          'bg-white hover:bg-purple-50 border-l-4 border-transparent hover:border-purple-300 hover:shadow-sm focus:border-purple-300 focus:shadow-sm focus:bg-purple-50',
        resultTitle:
          'text-gray-900 group-hover:text-purple-700 group-focus:text-purple-700',
        resultContent: 'text-gray-600',
        chatActions: {
          resetButton:
            'px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm text-red-700 transition-colors cursor-pointer',
          actionButton:
            'px-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors cursor-pointer',
          container: 'flex space-x-2 pb-3 justify-between'
        },
        noResults: {
          container: 'bg-gray-50/50 rounded-lg p-6 text-center',
          iconContainer:
            'w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3',
          icon: 'w-6 h-6 text-gray-400',
          title: 'text-lg font-medium text-gray-900',
          description: 'text-sm text-gray-500',
          suggestionContainer:
            'w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-2',
          suggestionIcon: 'w-5 h-5 text-purple-500',
          suggestionTitle: 'text-lg font-medium text-gray-900',
          suggestionItem:
            'group rounded-lg border border-gray-200 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 cursor-pointer',
          suggestionText: 'text-sm text-gray-700 group-hover:text-purple-700'
        },
        sources: {
          container: 'flex flex-row gap-2 mb-2 mt-3 overflow-x-auto',
          item: 'group inline-flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer flex-shrink-0',
          dot: 'w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 group-hover:bg-purple-600 transition-colors',
          title: 'text-xs font-semibold text-gray-900 truncate',
          content: 'text-xs text-gray-500 truncate'
        }
      }
    case 'dark':
      return {
        container: 'bg-gray-900 border border-gray-700 rounded-xl shadow-2xl',
        input:
          'bg-gray-800 border-gray-600 text-white focus:ring-cyan-400 focus:border-cyan-400',
        promptButton:
          'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600',
        text: 'text-white',
        category:
          'text-white bg-gray-800 hover:bg-gray-700 focus:bg-cyan-900 focus:text-cyan-200 focus:border-cyan-700',
        categorySelected: 'bg-cyan-900 text-cyan-200 border-cyan-700',
        resultsContainer: 'bg-gray-800/50',
        groupHeader: 'text-cyan-400 border-b border-gray-700',
        resultItem:
          'bg-gray-800 hover:bg-gray-700/80 border-l-4 border-transparent hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/10',
        resultTitle:
          'text-gray-100 group-hover:text-cyan-300 group-focus:text-cyan-300',
        resultContent: 'text-gray-400',
        chatActions: {
          resetButton:
            'px-3 py-1 bg-red-900/50 hover:bg-red-900/70 border border-red-700 rounded-lg text-sm text-red-300 transition-colors cursor-pointer',
          actionButton:
            'px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-sm text-gray-300 transition-colors cursor-pointer',
          container: 'flex space-x-2 pb-3 justify-between'
        },
        noResults: {
          container: 'bg-gray-800/50 rounded-lg p-6 text-center',
          iconContainer:
            'w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3',
          icon: 'w-6 h-6 text-gray-500',
          title: 'text-lg font-medium text-gray-100',
          description: 'text-sm text-gray-400',
          suggestionContainer:
            'w-10 h-10 rounded-full bg-cyan-900/20 flex items-center justify-center mx-auto mb-2',
          suggestionIcon: 'w-5 h-5 text-cyan-400',
          suggestionTitle: 'text-lg font-medium text-gray-100',
          suggestionItem:
            'group rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-cyan-900/20 hover:border-cyan-700 transition-all duration-200 cursor-pointer',
          suggestionText: 'text-sm text-gray-300 group-hover:text-cyan-300'
        },
        sources: {
          container: 'flex flex-row gap-2 mb-2 mt-3 overflow-x-auto',
          item: 'group inline-flex items-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 hover:shadow-lg hover:bg-gray-700 hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer flex-shrink-0',
          dot: 'w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 group-hover:bg-cyan-400 transition-colors',
          title: 'text-xs font-semibold text-gray-100 truncate',
          content: 'text-xs text-gray-400 truncate'
        }
      }
    case 'playful':
      return {
        container:
          'bg-gradient-to-br from-yellow-100 to-pink-100 border-2 border-pink-300 rounded-3xl shadow-lg',
        input:
          'border-pink-300 focus:ring-pink-400 focus:border-pink-400 rounded-full',
        promptButton:
          'bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 rounded-full',
        text: 'text-gray-800',
        category:
          'bg-white/70 hover:bg-white/90 focus:bg-pink-200 focus:text-pink-800 focus:border-pink-300',
        categorySelected: 'bg-pink-200 text-pink-800 border-pink-300',
        resultsContainer: 'bg-white/30 rounded-2xl',
        groupHeader: 'text-pink-600 border-b-2 border-pink-200',
        resultItem:
          'bg-white/80 hover:bg-white rounded-2xl border-2 border-transparent hover:border-pink-200 hover:shadow-md transform hover:scale-102 focus:border-pink-200 focus:shadow-md transform focus:scale-102 transition-all mb-2',
        resultTitle:
          'text-gray-800 group-hover:text-pink-700 group-focus:text-pink-700',
        resultContent: 'text-gray-600',
        chatActions: {
          resetButton:
            'px-3 py-1 bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded-full text-sm text-red-700 transition-all duration-200 cursor-pointer shadow-sm',
          actionButton:
            'px-3 py-1 bg-white/80 hover:bg-white border-2 border-pink-200 rounded-full text-sm text-gray-700 transition-all duration-200 cursor-pointer shadow-sm',
          container: 'flex space-x-3 pb-3 justify-between'
        },
        noResults: {
          container: 'bg-white/30 rounded-2xl p-6 text-center',
          iconContainer:
            'w-12 h-12 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-3',
          icon: 'w-6 h-6 text-pink-500',
          title: 'text-lg font-medium text-gray-800',
          description: 'text-sm text-gray-600',
          suggestionContainer:
            'w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-2',
          suggestionIcon: 'w-5 h-5 text-pink-600',
          suggestionTitle: 'text-lg font-medium text-gray-800',
          suggestionItem:
            'group rounded-2xl border-2 border-pink-200 bg-white/80 hover:bg-white hover:border-pink-300 transition-all duration-200 cursor-pointer shadow-sm',
          suggestionText: 'text-sm text-gray-700 group-hover:text-pink-700'
        },
        sources: {
          container: 'flex flex-row gap-3 mb-2 mt-4 overflow-x-auto',
          item: 'group inline-flex items-center bg-white/90 border-2 border-orange-200 rounded-2xl px-4 py-3 hover:shadow-lg hover:bg-white hover:border-orange-300 transition-all duration-200 cursor-pointer flex-shrink-0',
          dot: 'w-3 h-3 bg-orange-400 rounded-full flex-shrink-0 group-hover:bg-orange-500 transition-colors',
          title: 'text-xs font-bold text-gray-800 truncate',
          content: 'text-xs text-gray-600 truncate'
        }
      }
    default:
      return {
        container: 'bg-white border border-gray-200 rounded-xl shadow-lg',
        input: 'border-gray-300 focus:ring-purple-400 focus:border-purple-400',
        promptButton:
          'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        text: 'text-gray-900',
        category: 'bg-gray-50 hover:bg-gray-100',
        categorySelected: 'bg-purple-100 text-purple-800 border-purple-200',
        resultsContainer: 'bg-gray-50/50',
        groupHeader: 'text-purple-600 border-b border-purple-100',
        resultItem:
          'bg-white hover:bg-purple-50 border-l-4 border-transparent hover:border-purple-300 hover:shadow-sm focus:border-purple-300 focus:shadow-sm',
        resultTitle:
          'text-gray-900 group-hover:text-purple-700 group-focus:text-purple-700',
        resultContent: 'text-gray-600',
        chatActions: {
          resetButton:
            'px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm text-red-700 transition-colors cursor-pointer',
          actionButton:
            'px-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors cursor-pointer',
          container: 'flex space-x-2 my-3 justify-between'
        },
        noResults: {
          container: 'bg-gray-50/50 rounded-lg p-6 text-center',
          iconContainer:
            'w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3',
          icon: 'w-6 h-6 text-gray-400',
          title: 'text-lg font-medium text-gray-900',
          description: 'text-sm text-gray-500',
          suggestionContainer:
            'w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-2',
          suggestionIcon: 'w-5 h-5 text-purple-500',
          suggestionTitle: 'text-lg font-medium text-gray-900',
          suggestionItem:
            'group rounded-lg border border-gray-200 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 cursor-pointer',
          suggestionText: 'text-sm text-gray-700 group-hover:text-purple-700'
        },
        sources: {
          container: 'flex flex-row gap-2 mb-2 mt-3 overflow-x-auto',
          item: 'group inline-flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer flex-shrink-0',
          dot: 'w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 group-hover:bg-purple-600 transition-colors',
          title: 'text-xs font-semibold text-gray-900 truncate',
          content: 'text-xs text-gray-500 truncate'
        }
      }
  }
}

const parseRelatedQueries = (relatedQueries: string) => {
  try {
    return JSON.parse(relatedQueries)
  } catch (e: any) {
    return []
  }
}

const ComponentDemo = ({ theme }: { theme: string }) => {
  const [isChat, setIsChat] = useState(false)
  const themeClasses = getThemeClasses(theme)
  const { ref, onKeyDown } = useArrowKeysNavigation()
  const {
    containerRef,
    showGoToBottomButton,
    scrollToBottom,
    recalculateGoToBottomButton
  } = useScrollableContainer()

  return (
    <SearchRoot client={collectionManager}>
      <ChatRoot client={collectionManager}>
        <section
          className={`p-6 transition-all duration-500 ${themeClasses.container}`}
          ref={ref}
          onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
            onKeyDown(e.nativeEvent)
          }
        >
          <div className='h-120 flex flex-col gap-4'>
            <SearchInput.Wrapper className='relative flex-shrink-0'>
              <SearchInput.Input
                type='text'
                placeholder='Search for anything...'
                ariaLabel='Search for products'
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${themeClasses.input}`}
                searchParams={{
                  groupBy: 'category',
                  limit: 10
                }}
              />
            </SearchInput.Wrapper>

            <button
              onClick={() => setIsChat(true)}
              className={`w-full flex items-center justify-center px-4 py-3 text-white rounded-lg font-medium transition-all duration-300 cursor-pointer ${themeClasses.promptButton}`}
              data-focus-on-arrow-nav
            >
              <Star className='w-4 h-4 mr-2' />
              Ask AI for help
            </button>

            <FacetTabs.Wrapper>
              <FacetTabs.List className='space-x-2 flex gap-1'>
                {(group, isSelected) => (
                  <FacetTabs.Item
                    isSelected={isSelected}
                    group={group}
                    filterBy={'category'}
                    className={cn(
                      'p-3 rounded-lg text-sm cursor-pointer',
                      isSelected
                        ? themeClasses.categorySelected
                        : themeClasses.category
                    )}
                  >
                    {group.name} ({group.count})
                  </FacetTabs.Item>
                )}
              </FacetTabs.List>
            </FacetTabs.Wrapper>

            <div className='flex-1 min-h-0 flex flex-col overflow-y-auto'>
              <SearchResults.NoResults
                className={`flex flex-col items-center justify-center h-full ${themeClasses.noResults.container}`}
              >
                {(searchTerm) => (
                  <>
                    {searchTerm ? (
                      <>
                        <div className={themeClasses.noResults.iconContainer}>
                          <SearchX className={themeClasses.noResults.icon} />
                        </div>
                        <div className='space-y-1 mb-6'>
                          <p className={themeClasses.noResults.title}>
                            No results found for{' '}
                            <span>&quot;{searchTerm}&quot;</span>
                          </p>
                          <p className={themeClasses.noResults.description}>
                            Try adjusting your search terms or check spelling
                          </p>
                        </div>
                      </>
                    ) : (
                      <Suggestions.Wrapper className='flex flex-col justify-center gap-4'>
                        <div className='flex flex-col items-center'>
                          <div
                            className={
                              themeClasses.noResults.suggestionContainer
                            }
                          >
                            <Lightbulb
                              className={themeClasses.noResults.suggestionIcon}
                            />
                          </div>
                          <p className={themeClasses.noResults.suggestionTitle}>
                            Try these suggestions
                          </p>
                        </div>
                        <Suggestions.List className='space-y-2 max-w-sm mx-auto'>
                          <Suggestions.Item
                            onClick={() => setIsChat(true)}
                            className={themeClasses.noResults.suggestionItem}
                            itemClassName='cursor-pointer p-3 w-full'
                          >
                            <span
                              className={themeClasses.noResults.suggestionText}
                            >
                              What is Orama?
                            </span>
                          </Suggestions.Item>
                          <Suggestions.Item
                            onClick={() => setIsChat(true)}
                            className={themeClasses.noResults.suggestionItem}
                            itemClassName='cursor-pointer p-3 w-full'
                          >
                            <span
                              className={themeClasses.noResults.suggestionText}
                            >
                              How to use Orama?
                            </span>
                          </Suggestions.Item>
                          <Suggestions.Item
                            onClick={() => setIsChat(true)}
                            className={themeClasses.noResults.suggestionItem}
                            itemClassName='cursor-pointer p-3 w-full'
                          >
                            <span
                              className={themeClasses.noResults.suggestionText}
                            >
                              What are the features of Orama?
                            </span>
                          </Suggestions.Item>
                        </Suggestions.List>
                      </Suggestions.Wrapper>
                    )}
                  </>
                )}
              </SearchResults.NoResults>
              <SearchResults.GroupsWrapper
                className={`items-start relative overflow-y-auto p-3 ${themeClasses.resultsContainer} ${theme === 'playful' ? 'rounded-2xl' : 'rounded-lg'}`}
                groupBy='category'
              >
                {(group) => (
                  <div key={group.name} className='mb-6'>
                    <h2
                      className={`text-sm uppercase font-bold tracking-wider pb-2 mb-4 ${themeClasses.groupHeader}`}
                    >
                      {group.name}
                    </h2>
                    <SearchResults.GroupList
                      group={group}
                      className='flex flex-col gap-2'
                    >
                      {(hit) => (
                        <SearchResults.Item
                          as='a'
                          href={
                            typeof hit.document?.url === 'string'
                              ? hit.document.url
                              : '#'
                          }
                          className={`group p-4 cursor-pointer transition-all duration-200 block ${themeClasses.resultItem} ${theme === 'playful' ? 'rounded-2xl' : 'rounded-lg'}`}
                        >
                          {/* CUSTOM ITEM CONTENT */}
                          {typeof hit.document?.title === 'string' && (
                            <h3
                              className={`text-base font-semibold mb-2 transition-colors ${themeClasses.resultTitle}`}
                            >
                              {hit.document?.title}
                            </h3>
                          )}
                          {typeof hit.document?.content === 'string' && (
                            <p
                              className={`text-sm line-clamp-2 transition-colors ${themeClasses.resultContent}`}
                            >
                              {hit.document?.content.substring(0, 100)}
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
        </section>
        <SlidingPanel.Wrapper open={isChat} onClose={() => setIsChat(false)}>
          <SlidingPanel.Backdrop className='bg-black/50' />
          <SlidingPanel.Content
            className={`${themeClasses.container} rounded-xl shadow-lg overflow-hidden`}
          >
            <div className='flex flex-col justify-between h-full gap-2 mx-auto max-w-3xl'>
              <div className='flex-shrink-0'>
                <button
                  onClick={() => setIsChat(false)}
                  className={`flex items-center text-sm ${themeClasses.text} opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
                >
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Back
                </button>
              </div>

              <div className='flex-1 min-h-0 flex flex-col'>
                <ChatInteractions.Wrapper
                  ref={containerRef}
                  onScroll={recalculateGoToBottomButton}
                  onStreaming={recalculateGoToBottomButton}
                  onNewInteraction={() => scrollToBottom({ animated: true })}
                  className='items-start relative overflow-y-auto h-full'
                >
                  {(interaction, index, totalInteractions) => (
                    <>
                      <ChatInteractions.UserPrompt
                        className={`p-3 bg-purple-100 ${theme === 'dark' ? 'bg-purple-900' : ''} rounded-lg rounded-br-sm max-w-xs ml-auto`}
                      >
                        <p
                          className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                        >
                          {interaction.query}
                        </p>
                      </ChatInteractions.UserPrompt>
                      {interaction.loading &&
                        !interaction.response && ( // TODO; use theme
                          <div className='animate-pulse my-2'>
                            <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2'></div>
                            <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2'></div>
                          </div>
                        )}
                      <ChatInteractions.Sources
                        sources={
                          Array.isArray(interaction.sources)
                            ? interaction.sources
                            : []
                        }
                        className={`flex flex-row gap-1 mb-1 mt-2 overflow-x-auto ${themeClasses.sources.container}`}
                        itemClassName={themeClasses.sources.item}
                      >
                        {(document, index: number) => (
                          <div
                            className='flex items-center gap-2 max-w-xs'
                            key={index}
                          >
                            <div className='flex flex-col min-w-0'>
                              <span
                                className={`text-xs font-semibold ${themeClasses.sources.title}`}
                              >
                                {document?.title as string}
                              </span>
                              <span
                                className={`text-xs ${themeClasses.sources.content}`}
                              >
                                {typeof document?.content === 'string'
                                  ? document.content.substring(0, 40)
                                  : ''}
                                ...
                              </span>
                            </div>
                          </div>
                        )}
                      </ChatInteractions.Sources>

                      <ChatInteractions.AssistantMessage
                        className={`p-3 bg-gray-100 text-sm max-w-full ${theme === 'dark' ? 'bg-gray-800' : ''} ${themeClasses.text} rounded-lg my-3`}
                      >
                        {interaction.response}
                      </ChatInteractions.AssistantMessage>

                      {interaction.related &&
                        typeof interaction.related === 'string' && (
                          <Suggestions.List className='flex flex-col gap-1 mb-4'>
                            {(() => {
                              const relatedQueries = parseRelatedQueries(
                                interaction.related
                              )
                              if (relatedQueries.length === 0) return
                              return relatedQueries.map(
                                (item: string, idx: number) => (
                                  <Suggestions.Item
                                    key={idx}
                                    itemClassName='cursor-pointer p-1 text-sm text-left p-2 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-all duration-200'
                                  >
                                    <span
                                      className={
                                        themeClasses.noResults.suggestionText
                                      }
                                    >
                                      {item}
                                    </span>
                                  </Suggestions.Item>
                                )
                              )
                            })()}
                          </Suggestions.List>
                        )}

                      {interaction.response && !interaction.loading && (
                        <div
                          className={
                            themeClasses.chatActions.container +
                            `${index !== totalInteractions ? ' justify-end' : ''}`
                          }
                        >
                          <React.Fragment>
                            {index === totalInteractions && (
                              <div>
                                <ChatInteractions.Reset
                                  className={
                                    themeClasses.chatActions.resetButton
                                  }
                                >
                                  Reset all
                                </ChatInteractions.Reset>
                              </div>
                            )}
                          </React.Fragment>
                          <ul className='flex space-x-2'>
                            {index === totalInteractions && (
                              <li>
                                <ChatInteractions.RegenerateLatest
                                  className={
                                    themeClasses.chatActions.actionButton
                                  }
                                >
                                  <RotateCcw className='w-4 h-4' />
                                </ChatInteractions.RegenerateLatest>
                              </li>
                            )}
                            <li>
                              <ChatInteractions.CopyMessage
                                className={
                                  themeClasses.chatActions.actionButton
                                }
                                interaction={interaction}
                                copiedContent={
                                  <ClipboardCheck className='w-4 h-4' />
                                }
                              >
                                <Copy className='w-4 h-4' />
                              </ChatInteractions.CopyMessage>
                            </li>
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </ChatInteractions.Wrapper>
              </div>
              <div className='flex-shrink-0 relative'>
                {showGoToBottomButton && (
                  <button
                    onClick={() => scrollToBottom({ animated: true })}
                    // display after a few seconds of scrolling
                    className='absolute left-1/2 -top-10 -translate-x-1/2 bg-purple-500 text-white rounded-full p-2 shadow-lg hover:bg-purple-600 transition-colors cursor-pointer'
                    aria-label='Scroll to bottom'
                  >
                    <ArrowDown className='w-4 h-4' />
                  </button>
                )}
                <PromptTextArea.Wrapper className='flex items-center space-x-2'>
                  <PromptTextArea.Field
                    placeholder='Type a message...'
                    rows={1}
                    maxLength={500}
                    autoFocus
                    className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors placeholder:text-muted-foreground ${themeClasses.input}`}
                    askOptions={{
                      related: {
                        enabled: true,
                        size: 3,
                        format: 'question'
                      }
                    }}
                  />
                  <PromptTextArea.Button
                    abortContent={<PauseCircle className='w-4 h-4' />}
                    className={`p-2 text-white rounded-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.promptButton}`}
                    askOptions={{
                      related: {
                        enabled: true,
                        size: 3,
                        format: 'question'
                      }
                    }}
                  >
                    <ArrowUp className='w-4 h-4' />
                  </PromptTextArea.Button>
                </PromptTextArea.Wrapper>
              </div>
            </div>
          </SlidingPanel.Content>
        </SlidingPanel.Wrapper>
      </ChatRoot>
    </SearchRoot>
  )
}
