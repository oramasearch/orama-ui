import React from 'react'
// import { SearchBoxModal } from '@/components/showcase/SearchBoxModal'
// import { SlidingPanelChatbox } from '@/components/showcase/SlidingPanelChatbox'
// import { InlineSearch } from '@/components/showcase/InlineSearch'
// import { SearchWithDropdown } from '@/components/showcase/SearchWithDropdown'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
import { SearchBoxModal } from '@/components/SearchBoxModal'
import { Badge } from '@/components/Badge'
import { HeroShowcase } from '@/components/HeroShowcase'
import Header from '@/components/Header'

const Showcase = () => {
  const components = [
    {
      title: 'Search Box Modal',
      description:
        'A modal dialog that opens when triggered, perfect for search interfaces that need to overlay the main content without losing context.',
      badge: 'Interactive',
      features: [
        'Keyboard shortcut support (⌘K)',
        'Recent searches',
        'Instant search results',
        'Accessible modal implementation'
      ],
      component: <SearchBoxModal />,
      cardDescription: 'Click to open the search modal'
    },
    {
      title: 'Search with Dropdown',
      description:
        'A search input combined with a dropdown filter, ideal for filtered search experiences with categorized results and suggestions.',
      badge: 'Filter',
      features: [
        'Filter dropdown with categories',
        'Live search suggestions',
        'Keyboard navigation support',
        'Responsive design'
      ],
      // component: <SearchWithDropdown />,
      cardDescription: 'Type to see suggestions and use the filter'
    },
    {
      title: 'Sliding Panel Chatbox',
      description:
        "A slide-out panel from the side of the screen, ideal for chat interfaces that don't interrupt the main workflow.",
      badge: 'Chat',
      features: [
        'Smooth slide animation',
        'Message history',
        'Online status indicator',
        'Auto-response simulation'
      ],
      // component: <SlidingPanelChatbox />,
      cardDescription: 'Click to open the chat panel'
    },
    {
      title: 'Inline Search',
      description:
        'An embedded search component that fits naturally within your page layout, great for filtered content views and data exploration.',
      badge: 'Filter',
      features: [
        'Real-time filtering',
        'Multiple filter options',
        'Sorting capabilities',
        'Empty state handling'
      ],
      // component: <InlineSearch />,
      cardDescription: 'Try searching and filtering the content below'
    }
  ]

  return (
    <>
      <Header />
      <div className='min-h-screen bg-background'>
        <HeroShowcase />

        {/* Components Section */}
        <div className='container mx-auto px-4 py-5'>
          <div className='max-w-6xl mx-auto space-y-12'>
            {components.map((item, index) => (
              <div key={index} className='relative'>
                <div className='border border-gray-200 rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-all duration-300'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
                    {/* Left: Component Info */}
                    <div className='space-y-6'>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-3'>
                          <h2 className='text-2xl font-semibold text-gray-900'>
                            {item.title}
                          </h2>
                          <Badge variant='secondary' className='px-3 py-1'>
                            {item.badge}
                          </Badge>
                        </div>

                        <p className='text-muted-foreground leading-relaxed'>
                          {item.description}
                        </p>
                      </div>

                      <div className='space-y-3'>
                        <h4 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                          Features
                        </h4>
                        <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                          {item.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className='flex items-center gap-2 text-sm text-muted-foreground'
                            >
                              <div className='w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0' />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Component Preview */}
                    <div className='relative'>
                      <div className='border border-gray-200 shadow-sm bg-background py-8 rounded-lg'>
                        <div className='pb-4 px-6 border-b border-gray-200/50'>
                          <h3 className='text-lg font-semibold'>
                            Live Preview
                          </h3>
                          <p className='text-sm text-gray-500'>
                            {item.cardDescription}
                          </p>
                        </div>
                        <div className='pt-6'>
                          <div className='min-h-[120px] flex items-center justify-center'>
                            {item.component}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section divider */}
                {index < components.length - 1 && (
                  <div className='flex items-center justify-center mt-8 mb-4'>
                    <div className='flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent' />
                    <div className='px-4'>
                      <div className='w-2 h-2 bg-border rounded-full' />
                    </div>
                    <div className='flex-1 h-px bg-gradient-to-r from-border via-border to-transparent' />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Showcase
